import { useState } from 'react';

const RichTextEditor = ({ value = '', onChange, placeholder = 'Enter product description...' }) => {
  const [isPreview, setIsPreview] = useState(false);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleInput = (e) => {
    onChange(e.currentTarget.innerHTML);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const toolbar = [
    { 
      icon: 'B', 
      command: 'bold', 
      title: 'Bold',
      className: 'font-bold'
    },
    { 
      icon: 'I', 
      command: 'italic', 
      title: 'Italic',
      className: 'italic'
    },
    { 
      icon: 'U', 
      command: 'underline', 
      title: 'Underline',
      className: 'underline'
    },
    { 
      icon: '•', 
      command: 'insertUnorderedList', 
      title: 'Bullet List'
    },
    { 
      icon: '1.', 
      command: 'insertOrderedList', 
      title: 'Numbered List'
    }
  ];

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-1">
          {toolbar.map((tool, index) => (
            <button
              key={index}
              type="button"
              onClick={() => formatText(tool.command)}
              className={`
                px-3 py-1 text-sm rounded-lg hover:bg-slate-200 transition-colors border border-transparent
                ${tool.className || ''}
              `}
              title={tool.title}
            >
              {tool.icon}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`
              px-3 py-1 text-xs rounded-lg transition-colors
              ${isPreview 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="min-h-[120px] max-h-[300px] overflow-y-auto">
        {isPreview ? (
          <div 
            className="p-4 text-sm text-slate-700 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-400">No content to preview</p>' }}
          />
        ) : (
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onPaste={handlePaste}
            className="p-4 text-sm text-slate-700 outline-none min-h-[120px] focus:bg-white [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-400 [&:empty]:before:italic"
            dangerouslySetInnerHTML={{ __html: value }}
            data-placeholder={placeholder}
            style={{
              minHeight: '120px'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;