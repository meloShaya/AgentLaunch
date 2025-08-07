import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Upload, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { createStartup, uploadLogo, getUser } from '../lib/supabase';
import { FormData } from '../types';

const categories = [
  'SaaS', 'E-commerce', 'FinTech', 'HealthTech', 'EdTech', 'MarTech',
  'AI/ML', 'IoT', 'Gaming', 'Social', 'Productivity', 'Other'
];

const commonTags = [
  'startup', 'innovation', 'technology', 'SaaS', 'mobile', 'web',
  'AI', 'automation', 'productivity', 'business', 'analytics', 'cloud'
];

export const SubmitStartup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    clearErrors,
    getValues
  } = useForm<FormData>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      url: '',
      contactEmail: '',
      contactName: '',
      foundedYear: undefined,
      description: '',
      shortDescription: '',
      category: ''
    }
  });

  const totalSteps = 3;

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['name', 'url', 'contactEmail', 'contactName'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['description', 'shortDescription', 'category'];
    }

    // Clear any existing errors first
    clearErrors();

    // Trigger validation for specific fields
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Use useCallback to prevent unnecessary re-renders that might trigger submission
  const onSubmit = useCallback(async (data: FormData) => {
    console.log('onSubmit called, currentStep:', currentStep, 'submitting:', submitting);

    // Prevent submission if not on the final step or already submitting
    if (currentStep !== totalSteps || submitting) {
      console.log('Submission prevented - not on final step or already submitting');
      return;
    }

    setSubmitting(true);
    try {
      const user = await getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create startup data
      const startupData = {
        user_id: user.id,
        name: data.name,
        url: data.url,
        description: data.description,
        short_description: data.shortDescription,
        contact_email: data.contactEmail,
        contact_name: data.contactName,
        founded_year: data.foundedYear,
        category: data.category,
        tags: selectedTags,
      };

      // Create startup in database
      const startup = await createStartup(startupData);

      // Upload logo if provided
      let logoUrl = null;
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile, startup.id);
        // Update startup with logo URL
        // This would require an update function in the supabase lib
      }

      // Redirect to pricing page with startup ID
      navigate(`/pricing?startup=${startup.id}`);
    } catch (error) {
      console.error('Error submitting startup:', error);
      alert('There was an error submitting your startup. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [currentStep, totalSteps, submitting, selectedTags, logoFile, navigate]);

  // Handle form submission attempt - only allow on final step with explicit user action
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleFormSubmit called, currentStep:', currentStep);

    // Only proceed if we're on the final step
    if (currentStep === totalSteps) {
      handleSubmit(onSubmit)(e);
    }
  };

  // Handle explicit submit button click
  const handleSubmitButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Submit button clicked, currentStep:', currentStep, 'submitting:', submitting);

    if (currentStep === totalSteps && !submitting) {
      const formData = getValues();
      onSubmit(formData);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-sm sm:text-base text-gray-600">Tell us about your startup</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Startup Name *"
                {...register('name', {
                  required: 'Startup name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  validate: value => value.trim().length > 0 || 'Startup name cannot be empty'
                })}
                error={errors.name?.message}
                placeholder="e.g., MyAwesome Startup"
              />

              <Input
                label="Website URL *"
                {...register('url', {
                  required: 'Website URL is required',
                  pattern: {
                    value: /^https?:\/\/.+\..+/,
                    message: 'Please enter a valid URL (e.g., https://example.com)'
                  },
                  validate: value => {
                    if (!value) return 'Website URL is required';
                    if (!value.startsWith('http://') && !value.startsWith('https://')) {
                      return 'URL must start with http:// or https://';
                    }
                    return true;
                  }
                })}
                error={errors.url?.message}
                placeholder="https://myawesomestartup.com"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Contact Email *"
                type="email"
                {...register('contactEmail', {
                  required: 'Contact email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Please enter a valid email address'
                  },
                  validate: value => {
                    if (!value) return 'Contact email is required';
                    if (!value.includes('@')) return 'Please enter a valid email address';
                    return true;
                  }
                })}
                error={errors.contactEmail?.message}
                placeholder="founder@myawesomestartup.com"
              />

              <Input
                label="Contact Name *"
                {...register('contactName', {
                  required: 'Contact name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  validate: value => value.trim().length > 0 || 'Contact name cannot be empty'
                })}
                error={errors.contactName?.message}
                placeholder="John Doe"
              />
            </div>

            <Input
              label="Founded Year"
              type="number"
              {...register('foundedYear', {
                min: { value: 1900, message: 'Please enter a valid year' },
                max: { value: new Date().getFullYear(), message: 'Founded year cannot be in the future' },
                validate: value => {
                  if (value && (value < 1900 || value > new Date().getFullYear())) {
                    return 'Please enter a valid year';
                  }
                  return true;
                }
              })}
              error={errors.foundedYear?.message}
              placeholder="2024"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Describe Your Startup</h2>
              <p className="text-sm sm:text-base text-gray-600">Help directories understand what you do</p>
            </div>

            <Textarea
              label="Full Description *"
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 50, message: 'Description should be at least 50 characters' },
                maxLength: { value: 1000, message: 'Description should be under 1000 characters' },
                validate: value => {
                  if (!value) return 'Description is required';
                  if (value.trim().length < 50) return 'Description should be at least 50 characters';
                  return true;
                }
              })}
              error={errors.description?.message}
              placeholder="Provide a detailed description of your startup, what problem it solves, and what makes it unique..."
              rows={4}
              className="text-sm sm:text-base"
              helperText={`${watch('description')?.length || 0}/1000 characters`}
            />

            <Textarea
              label="Short Description *"
              {...register('shortDescription', {
                required: 'Short description is required',
                minLength: { value: 10, message: 'Short description should be at least 10 characters' },
                maxLength: { value: 160, message: 'Short description should be under 160 characters' },
                validate: value => {
                  if (!value) return 'Short description is required';
                  if (value.trim().length < 10) return 'Short description should be at least 10 characters';
                  return true;
                }
              })}
              error={errors.shortDescription?.message}
              placeholder="A brief one-line description of what your startup does..."
              rows={2}
              className="text-sm sm:text-base"
              helperText={`${watch('shortDescription')?.length || 0}/160 characters`}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category', {
                  required: 'Please select a category',
                  validate: value => value !== '' || 'Please select a category'
                })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Final Touches</h2>
              <p className="text-sm sm:text-base text-gray-600">Add your logo and tags to complete your profile</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-emerald-500 transition-colors">
                {logoPreview ? (
                  <div className="space-y-4">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-20 h-20 sm:w-32 sm:h-32 object-contain mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      Change Logo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        Upload Logo
                      </Button>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        PNG, JPG or SVG up to 5MB
                      </p>
                    </div>
                  </div>
                )}
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                Select relevant tags to help categorize your startup
              </p>
              <div className="flex flex-wrap gap-2">
                {commonTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Selected tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm bg-emerald-100 text-emerald-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="ml-1 sm:ml-2 hover:text-emerald-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Submit Your Startup</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-emerald-600 to-amber-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <Card className="p-4 sm:p-6 lg:p-8">
          {/* Remove form wrapper to prevent auto-submission */}
          <div>
            {renderStep()}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row sm:justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto order-2 sm:order-1"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto order-1 sm:order-2"
                  size="sm"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmitButtonClick}
                  loading={submitting}
                  disabled={submitting}
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto order-1 sm:order-2"
                  size="sm"
                >
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Submit & Continue to Pricing</span>
                  <span className="sm:hidden">Submit</span>
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
