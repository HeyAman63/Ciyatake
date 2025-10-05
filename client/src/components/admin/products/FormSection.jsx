const FormSection = ({ title, subtitle, children, isOpen = true, onToggle = null }) => {
  return (
    <div className="border border-emerald-100 rounded-2xl bg-gradient-to-br from-white to-emerald-50/20 shadow-sm hover:shadow-md transition-shadow">
      <div 
        className={`
          p-5 border-b border-emerald-100/50 
          ${onToggle ? 'cursor-pointer hover:bg-emerald-50/50 transition-colors' : ''}
        `}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>
          {onToggle && (
            <div className={`
              transform transition-transform duration-200 text-emerald-500
              ${isOpen ? 'rotate-180' : ''}
            `}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-5">
          {children}
        </div>
      )}
    </div>
  );
};

export default FormSection;