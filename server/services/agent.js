import puppeteer from 'puppeteer';
import OpenAI from 'openai';
import { directories } from '../data/directories.js';

export class AgentService {
  constructor(supabase) {
    this.supabase = supabase;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processPendingJobs() {
    try {
      // Get all paid but not started jobs
      const { data: jobs, error } = await this.supabase
        .from('submission_jobs')
        .select('*')
        .eq('status', 'paid');

      if (error) {
        console.error('Error fetching pending jobs:', error);
        return;
      }

      for (const job of jobs) {
        console.log(`Processing job ${job.id}`);
        await this.processJob(job.id);
      }
    } catch (error) {
      console.error('Error processing pending jobs:', error);
    }
  }

  async processJob(jobId) {
    try {
      // Update job status to in_progress
      await this.supabase
        .from('submission_jobs')
        .update({ status: 'in_progress' })
        .eq('id', jobId);

      // Get job details with startup info
      const { data: job, error } = await this.supabase
        .from('submission_jobs')
        .select(`
          *,
          startup:startups(*)
        `)
        .eq('id', jobId)
        .single();

      if (error || !job) {
        console.error('Error fetching job:', error);
        return;
      }

      console.log(`Processing ${job.total_directories} directories for job ${jobId}`);

      // Get directories to submit to (limit based on package)
      const targetDirectories = directories.slice(0, job.total_directories);

      // Create initial submission results
      const initialResults = targetDirectories.map(dir => ({
        job_id: jobId,
        directory_name: dir.name,
        directory_url: dir.url,
        status: 'pending'
      }));

      await this.supabase
        .from('submission_results')
        .insert(initialResults);

      // Process each directory
      let successCount = 0;
      let failedCount = 0;

      for (let i = 0; i < targetDirectories.length; i++) {
        const directory = targetDirectories[i];
        console.log(`Processing directory ${i + 1}/${targetDirectories.length}: ${directory.name}`);

        try {
          const result = await this.submitToDirectory(directory, job.startup);
          
          if (result.success) {
            successCount++;
          } else {
            failedCount++;
          }

          // Update result in database
          await this.supabase
            .from('submission_results')
            .update({
              status: result.success ? 'success' : 'failed',
              error_message: result.error,
              submission_url: result.submissionUrl,
              screenshot_url: result.screenshotUrl,
              notes: result.notes
            })
            .eq('job_id', jobId)
            .eq('directory_name', directory.name);

          // Update job progress
          await this.supabase
            .from('submission_jobs')
            .update({
              completed_directories: i + 1,
              successful_submissions: successCount,
              failed_submissions: failedCount
            })
            .eq('id', jobId);

          // Add delay between submissions to be respectful
          await this.delay(2000);

        } catch (error) {
          console.error(`Error processing ${directory.name}:`, error);
          failedCount++;
          
          await this.supabase
            .from('submission_results')
            .update({
              status: 'failed',
              error_message: error.message || 'Unknown error'
            })
            .eq('job_id', jobId)
            .eq('directory_name', directory.name);
        }
      }

      // Mark job as completed
      await this.supabase
        .from('submission_jobs')
        .update({
          status: 'completed',
          completed_directories: targetDirectories.length,
          successful_submissions: successCount,
          failed_submissions: failedCount
        })
        .eq('id', jobId);

      console.log(`Job ${jobId} completed: ${successCount} successful, ${failedCount} failed`);

    } catch (error) {
      console.error(`Error processing job ${jobId}:`, error);
      
      // Mark job as failed
      await this.supabase
        .from('submission_jobs')
        .update({ status: 'failed' })
        .eq('id', jobId);
    }
  }

  async submitToDirectory(directory, startup) {
    let browser;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      
      // Set user agent and viewport
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });

      console.log(`Navigating to ${directory.url}`);
      
      // Navigate to the directory submission page
      await page.goto(directory.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait a bit for any dynamic content to load
      await this.delay(3000);

      // Take screenshot for AI analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
      });

      // Get page HTML
      const html = await page.content();

      // Analyze page with AI
      console.log(`Analyzing ${directory.name} with AI...`);
      const analysis = await this.analyzePageWithAI(screenshot, html, directory.name);

      if (!analysis || !analysis.selectors) {
        throw new Error('AI analysis failed - no selectors found');
      }

      console.log(`AI found ${Object.keys(analysis.selectors).length} form fields`);

      // Fill out the form based on AI analysis
      const fillResult = await this.fillForm(page, analysis.selectors, startup);

      if (!fillResult.success) {
        throw new Error(fillResult.error || 'Form filling failed');
      }

      // Take another screenshot after filling
      const filledScreenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
      });

      // Try to submit the form
      const submitResult = await this.submitForm(page, analysis.selectors);

      return {
        success: submitResult.success,
        error: submitResult.error,
        submissionUrl: page.url(),
        screenshotUrl: null, // In production, you'd upload screenshots to storage
        notes: `AI analysis found ${Object.keys(analysis.selectors).length} fields. ${submitResult.notes || ''}`
      };

    } catch (error) {
      console.error(`Error submitting to ${directory.name}:`, error);
      
      return {
        success: false,
        error: error.message,
        submissionUrl: null,
        screenshotUrl: null,
        notes: `Failed during ${error.step || 'processing'}: ${error.message}`
      };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async analyzePageWithAI(screenshot, html, directoryName) {
    try {
      // Convert screenshot to base64
      const base64Screenshot = screenshot.toString('base64');

      const prompt = `You are an expert web automation assistant. Analyze this screenshot and HTML of a startup directory submission page for "${directoryName}".

Your task is to identify form fields and return a JSON object mapping CSS selectors to the type of data they expect.

Return ONLY a valid JSON object with this structure:
{
  "selectors": {
    "input[name='company_name']": "company_name",
    "textarea[name='description']": "description",
    "input[type='email']": "contact_email",
    "input[type='file']": "logo_upload",
    "button[type='submit']": "submit_button"
  }
}

Focus on these field types:
- company_name: Company/startup name
- company_url: Website URL
- description: Long description
- short_description: Brief description
- contact_email: Contact email
- contact_name: Contact person name
- category: Category/industry
- tags: Tags or keywords
- logo_upload: Logo file upload
- submit_button: Submit button

Use the most specific CSS selector possible (prefer name, id, or data attributes over generic classes).

HTML excerpt:
${html.substring(0, 5000)}...`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${base64Screenshot}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const analysis = JSON.parse(jsonMatch[0]);
      console.log(`AI analysis for ${directoryName}:`, analysis);
      
      return analysis;

    } catch (error) {
      console.error('AI analysis error:', error);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  async fillForm(page, selectors, startup) {
    try {
      const fieldMappings = {
        company_name: startup.name,
        company_url: startup.url,
        description: startup.description,
        short_description: startup.short_description,
        contact_email: startup.contact_email,
        contact_name: startup.contact_name,
        category: startup.category,
        tags: startup.tags?.join(', ') || '',
        founded_year: startup.founded_year?.toString() || ''
      };

      for (const [selector, fieldType] of Object.entries(selectors)) {
        if (fieldType === 'submit_button' || fieldType === 'logo_upload') {
          continue; // Skip these for now
        }

        const value = fieldMappings[fieldType];
        if (!value) {
          console.log(`No value for field type: ${fieldType}`);
          continue;
        }

        try {
          // Wait for element to be present
          await page.waitForSelector(selector, { timeout: 5000 });
          
          // Check if element exists and is visible
          const element = await page.$(selector);
          if (!element) {
            console.log(`Element not found: ${selector}`);
            continue;
          }

          // Clear and fill the field
          await page.focus(selector);
          await page.keyboard.down('Control');
          await page.keyboard.press('KeyA');
          await page.keyboard.up('Control');
          await page.type(selector, value, { delay: 50 });
          
          console.log(`Filled ${fieldType} with: ${value.substring(0, 50)}...`);
          
        } catch (error) {
          console.log(`Error filling field ${selector}:`, error.message);
        }
      }

      return { success: true };

    } catch (error) {
      return { 
        success: false, 
        error: `Form filling failed: ${error.message}` 
      };
    }
  }

  async submitForm(page, selectors) {
    try {
      // Find submit button
      const submitSelector = Object.keys(selectors).find(
        selector => selectors[selector] === 'submit_button'
      );

      if (!submitSelector) {
        // Try common submit button selectors
        const commonSubmitSelectors = [
          'button[type="submit"]',
          'input[type="submit"]',
          'button:contains("Submit")',
          'button:contains("Add")',
          'button:contains("Post")',
          '.submit-btn',
          '#submit-btn'
        ];

        let submitButton = null;
        for (const selector of commonSubmitSelectors) {
          try {
            submitButton = await page.$(selector);
            if (submitButton) break;
          } catch (e) {
            continue;
          }
        }

        if (!submitButton) {
          return {
            success: false,
            error: 'No submit button found',
            notes: 'Could not locate submit button'
          };
        }
      }

      // Wait a moment before submitting
      await this.delay(2000);

      // Click submit button
      const submitSel = submitSelector || 'button[type="submit"]';
      await page.click(submitSel);

      // Wait for navigation or response
      try {
        await page.waitForNavigation({ 
          waitUntil: 'networkidle2', 
          timeout: 10000 
        });
      } catch (e) {
        // Navigation might not happen, check for success/error messages
        await this.delay(3000);
      }

      // Check for success/error indicators
      const pageContent = await page.content();
      const url = page.url();

      // Look for success indicators
      const successIndicators = [
        'thank you',
        'success',
        'submitted',
        'received',
        'approved',
        'added successfully'
      ];

      // Look for error indicators
      const errorIndicators = [
        'error',
        'required',
        'invalid',
        'captcha',
        'try again',
        'failed'
      ];

      const contentLower = pageContent.toLowerCase();
      
      const hasSuccess = successIndicators.some(indicator => 
        contentLower.includes(indicator)
      );
      
      const hasError = errorIndicators.some(indicator => 
        contentLower.includes(indicator)
      );

      if (hasSuccess && !hasError) {
        return {
          success: true,
          notes: 'Success indicators found on page'
        };
      } else if (hasError) {
        return {
          success: false,
          error: 'Error indicators found on page',
          notes: 'Page contains error messages'
        };
      } else {
        // Assume success if no clear indicators
        return {
          success: true,
          notes: 'Form submitted, no clear success/error indicators'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: `Submit failed: ${error.message}`,
        notes: 'Error during form submission'
      };
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}