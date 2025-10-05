import { useState } from 'react';

const ColorPicker = ({ colors = [], onColorsChange, maxColors = 10 }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

  const predefinedColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Green', hex: '#10b981' },
    { name: 'Yellow', hex: '#f59e0b' },
    { name: 'Purple', hex: '#8b5cf6' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Gray', hex: '#6b7280' },
    { name: 'Navy', hex: '#1e40af' },
    { name: 'Maroon', hex: '#991b1b' },
  ];

  const addPredefinedColor = (color) => {
    if (colors.find(c => c.hex === color.hex) || colors.length >= maxColors) return;
    onColorsChange([...colors, { ...color, id: Date.now() + Math.random() }]);
  };

  const addCustomColor = () => {
    if (!newColorName.trim() || colors.find(c => c.hex === newColorHex) || colors.length >= maxColors) return;
    
    onColorsChange([...colors, {
      id: Date.now() + Math.random(),
      name: newColorName.trim(),
      hex: newColorHex
    }]);
    
    setNewColorName('');
    setNewColorHex('#000000');
    setShowColorPicker(false);
  };

  const removeColor = (id) => {
    onColorsChange(colors.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Selected Colors */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-700">Selected Colors:</h4>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <div
                key={color.id}
                className="flex items-center gap-2 bg-slate-50 rounded-full px-3 py-2 border border-slate-200"
              >
                <div
                  className="w-4 h-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm font-medium text-slate-700">{color.name}</span>
                <button
                  onClick={() => removeColor(color.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors ml-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predefined Colors */}
      {colors.length < maxColors && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-700">Quick Select:</h4>
          <div className="grid grid-cols-6 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => addPredefinedColor(color)}
                disabled={colors.find(c => c.hex === color.hex)}
                className={`
                  group relative w-10 h-10 rounded-lg border-2 transition-all
                  ${colors.find(c => c.hex === color.hex) 
                    ? 'border-slate-300 cursor-not-allowed opacity-50' 
                    : 'border-slate-200 hover:border-emerald-300 hover:scale-110 cursor-pointer'
                  }
                `}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {colors.find(c => c.hex === color.hex) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Color Picker */}
      {colors.length < maxColors && (
        <div className="space-y-3">
          {!showColorPicker ? (
            <button
              onClick={() => setShowColorPicker(true)}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              + Add Custom Color
            </button>
          ) : (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Color Name
                  </label>
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="e.g., Forest Green"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <button
                  onClick={addCustomColor}
                  disabled={!newColorName.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {colors.length >= maxColors && (
        <p className="text-sm text-amber-600">
          Maximum {maxColors} colors allowed
        </p>
      )}
    </div>
  );
};

export default ColorPicker;