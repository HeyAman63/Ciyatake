import { useState } from 'react';

const VideoUploader = ({ video, onVideoChange, maxSize = 50 * 1024 * 1024 }) => { // 50MB limit
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

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
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    setError('');

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file.');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`Video size should be less than ${Math.round(maxSize / (1024 * 1024))}MB.`);
      return;
    }

    // Create preview URL
    const videoUrl = URL.createObjectURL(file);
    
    onVideoChange({
      file,
      preview: videoUrl,
      name: file.name,
      size: file.size
    });
  };

  const removeVideo = () => {
    if (video?.preview) {
      URL.revokeObjectURL(video.preview);
    }
    onVideoChange(null);
    setError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {!video ? (
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
          onClick={() => document.getElementById('video-input').click()}
        >
          <div className="mx-auto w-12 h-12 text-slate-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-slate-700 mb-2">
            Drop video here or click to browse
          </p>
          <p className="text-sm text-slate-500">
            Maximum {Math.round(maxSize / (1024 * 1024))}MB. MP4, WebM, AVI supported.
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
          <div className="aspect-video bg-slate-100 relative">
            <video
              src={video.preview}
              controls
              className="w-full h-full object-cover"
            />
            <button
              onClick={removeVideo}
              className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 truncate">{video.name}</p>
                <p className="text-sm text-slate-500">{formatFileSize(video.size)}</p>
              </div>
              <button
                onClick={removeVideo}
                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        id="video-input"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;