import { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helper?: string;
}

export function Input({ label, error, icon, helper, className = "", id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        )}
        <input
          id={inputId}
          {...props}
          className={`w-full ${icon ? "pl-9" : "pl-3"} pr-3 py-2.5 text-[13.5px] border rounded-lg bg-white text-slate-800
            placeholder:text-slate-400 transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
            ${error ? "border-red-300 focus:border-red-400 focus:ring-red-500/20" : "border-slate-300"}
            disabled:bg-slate-50 disabled:text-slate-400
            ${className}`}
        />
      </div>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
      {helper && !error && <p className="text-[12px] text-slate-400">{helper}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = "", id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-[13px] font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        {...props}
        className={`w-full px-3 py-2.5 text-[13.5px] border rounded-lg bg-white text-slate-800
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
          ${error ? "border-red-300" : "border-slate-300"}
          disabled:bg-slate-50 disabled:text-slate-400
          ${className}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-[13px] font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={4}
        {...props}
        className={`w-full px-3 py-2.5 text-[13.5px] border rounded-lg bg-white text-slate-800
          placeholder:text-slate-400 resize-y min-h-[100px] transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
          ${error ? "border-red-300" : "border-slate-300"}
          ${className}`}
      />
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helper?: string;
  value: number;
  onChange: (value: number) => void;
  currency?: string;
}

export function CurrencyInput({ label, error, icon, helper, className = "", id, value, onChange, currency = "IDR", ...props }: CurrencyInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  
  // Format to string with thousand separators
  const formatValue = (val: number) => {
    if (val === 0 || isNaN(val)) return "";
    return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US").format(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digit characters
    const rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) {
      onChange(0);
      return;
    }
    const numValue = parseInt(rawValue, 10);
    onChange(numValue);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        )}
        <input
          type="text"
          id={inputId}
          {...props}
          value={formatValue(value)}
          onChange={handleInputChange}
          className={`w-full ${icon ? "pl-9" : "pl-3"} pr-3 py-2.5 text-[13.5px] border rounded-lg bg-white text-slate-800
            placeholder:text-slate-400 transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
            ${error ? "border-red-300 focus:border-red-400 focus:ring-red-500/20" : "border-slate-300"}
            disabled:bg-slate-50 disabled:text-slate-400
            ${className}`}
        />
      </div>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
      {helper && !error && <p className="text-[12px] text-slate-400">{helper}</p>}
    </div>
  );
}
