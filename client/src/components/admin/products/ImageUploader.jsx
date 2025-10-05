import { useState } from 'react';

const ImageUploader = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 6,
  primaryImageIndex = 0,
  onPrimaryImageChange 
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = [...e.dataTransfer.files];
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    const remainingSlots = maxImages - images.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    Promise.all(
      filesToAdd.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve({
            file,
            preview: e.target.result,
            id: Date.now() + Math.random()
          });
          reader.readAsDataURL(file);
        });
      })
    ).then(newImages => {
      onImagesChange([...images, ...newImages]);
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    // Adjust primary image index if needed
    if (primaryImageIndex === index) {
      onPrimaryImageChange(0);
    } else if (primaryImageIndex > index) {
      onPrimaryImageChange(primaryImageIndex - 1);
    }
  };

  const setPrimaryImage = (index) => {
    onPrimaryImageChange(index);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer
          ${dragActive 
            ? 'border-emerald-400 bg-emerald-50' 
            : 'border-slate-300 hover:border-emerald-300 hover:bg-emerald-50/50'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <div className="mx-auto w-12 h-12 text-slate-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p className="text-lg font-medium text-slate-700 mb-2">
          Drop images here or click to browse
        </p>
        <p className="text-sm text-slate-500">
          Maximum {maxImages} images, up to 5MB each. JPG, PNG, WebP supported.
        </p>
      </div>

      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles([...e.target.files])}
      />

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`
                relative group rounded-xl overflow-hidden border-2 transition-all
                ${primaryImageIndex === index 
                  ? 'border-emerald-500 shadow-lg' 
                  : 'border-slate-200 hover:border-emerald-300'
                }
              `}
            >
              <img
                src={image.preview}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              
              {/* Primary Badge */}
              {primaryImageIndex === index && (
                <div className="absolute top-2 left-2">
                  <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Primary
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {primaryImageIndex !== index && (
                  <button
                    onClick={() => setPrimaryImage(index)}
                    className="bg-white text-slate-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-emerald-50 transition-colors"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  onClick={() => removeImage(index)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-sm text-slate-500 text-center">
          {images.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
};

export default ImageUploader;