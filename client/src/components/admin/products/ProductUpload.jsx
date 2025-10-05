import { useState } from 'react';
import FormSection from './FormSection';
import FormField from './FormField';
import ImageUploader from './ImageUploader';
import VideoUploader from './VideoUploader';
import ColorPicker from './ColorPicker';
import MultiSelectTags from './MultiSelectTags';
import RichTextEditor from './RichTextEditor';
import Button from '../../common/Button';
import { categoryStructure, sizeOptions, materialOptions, fitTypes, countries } from '../../../data/categories';

const ProductUpload = () => {
  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    brand: '',
    gender: '',
    category: '',
    subCategory: '',
    productType: '',
    
    // Media
    images: [],
    primaryImageIndex: 0,
    video: null,
    
    // Pricing & Inventory
    price: '',
    discountPercentage: '',
    stockQuantity: '',
    sku: '',
    availableSizes: [],
    colors: [],
    
    // Additional Details
    material: '',
    fitType: '',
    careInstructions: '',
    madeIn: 'India',
    warranty: '',
    
    // SEO & Tags
    metaTitle: '',
    metaDescription: '',
    tags: [],
    
    // Shipping & Returns
    shippingTime: '3-5 business days',
    returnPolicy: true,
    
    // Status
    visibility: 'draft',
    featured: false
  });

  // Section visibility state
  const [sections, setSections] = useState({
    basic: true,
    media: true,
    pricing: true,
    details: false,
    seo: false,
    shipping: false,
    status: true
  });

  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [loading, setLoading] = useState(false);

  const toggleSection = (sectionName) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleGenderChange = (gender) => {
    updateFormData('gender', gender);
    updateFormData('category', '');
    updateFormData('subCategory', '');
  };

  const handleCategoryChange = (category) => {
    updateFormData('category', category);
    updateFormData('subCategory', '');
  };

  const calculateDiscountedPrice = () => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discountPercentage) || 0;
    return price - (price * discount / 100);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.title.trim()) newErrors.title = 'Product title is required';
    if (!formData.description.trim()) newErrors.description = 'Product description is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand name is required';
    if (!formData.gender) newErrors.gender = 'Gender selection is required';
    if (!formData.category) newErrors.category = 'Category selection is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.stockQuantity) newErrors.stockQuantity = 'Stock quantity is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.images.length === 0) newErrors.images = 'At least one product image is required';
    
    // Price validation
    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) <= 0)) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    // Stock validation
    if (formData.stockQuantity && (isNaN(formData.stockQuantity) || parseInt(formData.stockQuantity) < 0)) {
      newErrors.stockQuantity = 'Stock quantity must be a valid non-negative number';
    }
    
    // Discount validation
    if (formData.discountPercentage && (isNaN(formData.discountPercentage) || parseFloat(formData.discountPercentage) < 0 || parseFloat(formData.discountPercentage) > 100)) {
      newErrors.discountPercentage = 'Discount must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Here you would typically upload images first, then create product
      console.log('Product data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Product uploaded successfully!');
      
      // Reset form or redirect
      // resetForm();
      
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Failed to upload product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      brand: '',
      gender: '',
      category: '',
      subCategory: '',
      productType: '',
      images: [],
      primaryImageIndex: 0,
      video: null,
      price: '',
      discountPercentage: '',
      stockQuantity: '',
      sku: '',
      availableSizes: [],
      colors: [],
      material: '',
      fitType: '',
      careInstructions: '',
      madeIn: 'India',
      warranty: '',
      metaTitle: '',
      metaDescription: '',
      tags: [],
      shippingTime: '3-5 business days',
      returnPolicy: true,
      visibility: 'draft',
      featured: false
    });
    setErrors({});
  };

  const availableCategories = formData.gender ? Object.keys(categoryStructure[formData.gender] || {}) : [];
  const availableSubCategories = formData.gender && formData.category 
    ? categoryStructure[formData.gender][formData.category] || [] 
    : [];

  const getSizeOptions = () => {
    if (formData.gender === 'Kids') return sizeOptions.kids;
    if (formData.category?.toLowerCase().includes('footwear')) return sizeOptions.footwear;
    return sizeOptions.clothing;
  };

  const commonTags = [
    'New Arrival', 'Best Seller', 'Premium', 'Eco-Friendly', 'Limited Edition', 
    'Trendy', 'Classic', 'Casual', 'Formal', 'Festive', 'Summer', 'Winter', 
    'Monsoon', 'Breathable', 'Comfortable', 'Durable', 'Lightweight'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-emerald-100/20">
      <div className="max-w-4xl mx-auto py-6 px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
              <p className="text-slate-600 text-sm">Create a new product listing with detailed information and media</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <FormSection
            title="Basic Information"
            subtitle="Essential product details and categorization"
            isOpen={sections.basic}
            onToggle={() => toggleSection('basic')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                label="Product Title" 
                required 
                error={errors.title}
                className="md:col-span-2"
              >
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Enter product title"
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white/70 hover:bg-white"
                />
              </FormField>

              <FormField 
                label="Product Description" 
                required 
                error={errors.description}
                className="md:col-span-2"
              >
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => updateFormData('description', value)}
                  placeholder="Describe your product features, benefits, and specifications..."
                />
              </FormField>

              <FormField label="Brand Name" required error={errors.brand}>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => updateFormData('brand', e.target.value)}
                  placeholder="Enter brand name"
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white/70 hover:bg-white"
                />
              </FormField>

              <FormField label="Gender" required error={errors.gender}>
                <select
                  value={formData.gender}
                  onChange={(e) => handleGenderChange(e.target.value)}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white/70 hover:bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Men">👔 Men</option>
                  <option value="Women">👗 Women</option>
                  <option value="Kids">🧒 Kids</option>
                </select>
              </FormField>

              <FormField label="Category" required error={errors.category}>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={!formData.gender}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white/70 hover:bg-white disabled:opacity-50 disabled:bg-slate-100"
                >
                  <option value="">Select Category</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Sub-category">
                <select
                  value={formData.subCategory}
                  onChange={(e) => updateFormData('subCategory', e.target.value)}
                  disabled={!formData.category}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white/70 hover:bg-white disabled:opacity-50 disabled:bg-slate-100"
                >
                  <option value="">Select Sub-category</option>
                  {availableSubCategories.map((subCategory) => (
                    <option key={subCategory} value={subCategory}>{subCategory}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Product Type" helpText="Optional - for more specific categorization">
                <input
                  type="text"
                  value={formData.productType}
                  onChange={(e) => updateFormData('productType', e.target.value)}
                  placeholder="e.g., Polo, V-neck, Crew neck"
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white/70 hover:bg-white"
                />
              </FormField>
            </div>
          </FormSection>

          {/* Product Media */}
          <FormSection
            title="Product Media"
            subtitle="Upload images and videos to showcase your product"
            isOpen={sections.media}
            onToggle={() => toggleSection('media')}
          >
            <FormField 
              label="Product Images" 
              required 
              error={errors.images}
              helpText="Upload up to 6 high-quality images. The first image will be used as the primary display image."
            >
              <ImageUploader
                images={formData.images}
                onImagesChange={(images) => updateFormData('images', images)}
                primaryImageIndex={formData.primaryImageIndex}
                onPrimaryImageChange={(index) => updateFormData('primaryImageIndex', index)}
                maxImages={6}
              />
            </FormField>

            <FormField 
              label="Product Video (Optional)" 
              helpText="Upload a product demonstration or showcase video (max 50MB)."
            >
              <VideoUploader
                video={formData.video}
                onVideoChange={(video) => updateFormData('video', video)}
                maxSize={50 * 1024 * 1024} // 50MB
              />
            </FormField>
          </FormSection>

          {/* Pricing & Inventory */}
          <FormSection
            title="Pricing & Inventory"
            subtitle="Set pricing, stock levels, and product variants"
            isOpen={sections.pricing}
            onToggle={() => toggleSection('pricing')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Price (₹)" required error={errors.price}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => updateFormData('price', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </FormField>

              <FormField label="Discount %" error={errors.discountPercentage}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.discountPercentage}
                  onChange={(e) => updateFormData('discountPercentage', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </FormField>

              {formData.price && formData.discountPercentage && (
                <div className="md:col-span-2 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-800">Final Price:</span>
                    <span className="text-lg font-bold text-emerald-900">
                      ₹{calculateDiscountedPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">
                    Savings: ₹{(parseFloat(formData.price) - calculateDiscountedPrice()).toFixed(2)}
                  </div>
                </div>
              )}

              <FormField label="Stock Quantity" required error={errors.stockQuantity}>
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => updateFormData('stockQuantity', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </FormField>

              <FormField label="SKU / Product Code" required error={errors.sku}>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => updateFormData('sku', e.target.value)}
                  placeholder="e.g., TSH-BLU-M-001"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </FormField>

              <FormField label="Available Sizes" className="md:col-span-2">
                <MultiSelectTags
                  options={getSizeOptions()}
                  selectedValues={formData.availableSizes}
                  onSelectionChange={(sizes) => updateFormData('availableSizes', sizes)}
                  placeholder="Select available sizes..."
                  maxTags={15}
                />
              </FormField>

              <FormField label="Available Colors" className="md:col-span-2">
                <ColorPicker
                  colors={formData.colors}
                  onColorsChange={(colors) => updateFormData('colors', colors)}
                  maxColors={10}
                />
              </FormField>
            </div>
          </FormSection>

          {/* Additional Details */}
          <FormSection
            title="Additional Details"
            subtitle="Material, fit, care instructions, and other specifications"
            isOpen={sections.details}
            onToggle={() => toggleSection('details')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Material Type">
                <select
                  value={formData.material}
                  onChange={(e) => updateFormData('material', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="">Select Material</option>
                  {materialOptions.map((material) => (
                    <option key={material} value={material}>{material}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Fit Type">
                <select
                  value={formData.fitType}
                  onChange={(e) => updateFormData('fitType', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="">Select Fit Type</option>
                  {fitTypes.map((fit) => (
                    <option key={fit} value={fit}>{fit}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Made In">
                <select
                  value={formData.madeIn}
                  onChange={(e) => updateFormData('madeIn', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Warranty">
                <input
                  type="text"
                  value={formData.warranty}
                  onChange={(e) => updateFormData('warranty', e.target.value)}
                  placeholder="e.g., 1 year manufacturer warranty"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </FormField>

              <FormField label="Care Instructions" className="md:col-span-2">
                <textarea
                  value={formData.careInstructions}
                  onChange={(e) => updateFormData('careInstructions', e.target.value)}
                  placeholder="Enter care and washing instructions..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                />
              </FormField>
            </div>
          </FormSection>

          {/* SEO & Tags */}
          <FormSection
            title="SEO & Tags"
            subtitle="Optimize for search engines and add relevant tags"
            isOpen={sections.seo}
            onToggle={() => toggleSection('seo')}
          >
            <div className="space-y-6">
              <FormField label="Meta Title" helpText="Recommended: 50-60 characters">
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => updateFormData('metaTitle', e.target.value)}
                  placeholder="SEO-friendly product title"
                  maxLength={60}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
                <div className="text-right text-xs text-slate-500 mt-1">
                  {formData.metaTitle.length}/60
                </div>
              </FormField>

              <FormField label="Meta Description" helpText="Recommended: 150-160 characters">
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => updateFormData('metaDescription', e.target.value)}
                  placeholder="Brief description for search engine results"
                  maxLength={160}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                />
                <div className="text-right text-xs text-slate-500 mt-1">
                  {formData.metaDescription.length}/160
                </div>
              </FormField>

              <FormField label="Product Tags" helpText="Add relevant tags to help customers find this product">
                <MultiSelectTags
                  options={commonTags}
                  selectedValues={formData.tags}
                  onSelectionChange={(tags) => updateFormData('tags', tags)}
                  placeholder="Add product tags..."
                  maxTags={20}
                  allowCustom={true}
                />
              </FormField>
            </div>
          </FormSection>

          {/* Shipping & Returns */}
          <FormSection
            title="Shipping & Returns"
            subtitle="Configure shipping and return policy settings"
            isOpen={sections.shipping}
            onToggle={() => toggleSection('shipping')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Shipping Time">
                <select
                  value={formData.shippingTime}
                  onChange={(e) => updateFormData('shippingTime', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="1-2 business days">1-2 business days</option>
                  <option value="3-5 business days">3-5 business days</option>
                  <option value="5-7 business days">5-7 business days</option>
                  <option value="7-10 business days">7-10 business days</option>
                  <option value="10-15 business days">10-15 business days</option>
                </select>
              </FormField>

              <FormField label="Return Policy">
                <div className="flex items-center gap-3 py-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.returnPolicy}
                      onChange={(e) => updateFormData('returnPolicy', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span className="text-sm font-medium text-slate-700">
                    {formData.returnPolicy ? 'Returns Accepted' : 'No Returns'}
                  </span>
                </div>
              </FormField>
            </div>
          </FormSection>

          {/* Status Controls */}
          <FormSection
            title="Status & Visibility"
            subtitle="Control product visibility and featured status"
            isOpen={sections.status}
            onToggle={() => toggleSection('status')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Product Visibility">
                <select
                  value={formData.visibility}
                  onChange={(e) => updateFormData('visibility', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="draft">📝 Draft (Not visible to customers)</option>
                  <option value="active">✅ Active (Visible to customers)</option>
                  <option value="archived">📦 Archived (Hidden from catalog)</option>
                </select>
              </FormField>

              <FormField label="Featured Product">
                <div className="flex items-center gap-3 py-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => updateFormData('featured', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span className="text-sm font-medium text-slate-700">
                    {formData.featured ? 'Featured on homepage' : 'Regular product'}
                  </span>
                </div>
              </FormField>
            </div>
          </FormSection>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-emerald-50/50 to-emerald-100/30 rounded-2xl border border-emerald-100 p-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-emerald-200 text-slate-600 bg-white hover:bg-emerald-50 rounded-xl transition-colors font-medium"
                >
                  Reset Form
                </Button>
                
                <Button
                  type="button"
                  onClick={() => updateFormData('visibility', 'draft')}
                  className="px-6 py-3 border border-emerald-300 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors font-medium"
                >
                  Save as Draft
                </Button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`
                  px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl
                  ${loading 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5'
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Uploading...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpload;