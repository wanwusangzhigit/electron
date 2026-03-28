// 文件路径: src/react/components/common/NumberInput.tsx

/**
 * 数字输入组件
 */

import React, { useState, useCallback } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  label,
  unit,
  disabled = false,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value.toString());

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    let numValue = parseFloat(localValue);
    
    if (isNaN(numValue)) {
      numValue = value;
    } else {
      numValue = Math.min(Math.max(numValue, min), max);
    }
    
    onChange(numValue);
    setLocalValue(numValue.toString());
  }, [localValue, value, min, max, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }, []);

  const increment = useCallback(() => {
    let newValue = value + step;
    newValue = Math.min(Math.max(newValue, min), max);
    onChange(newValue);
    setLocalValue(newValue.toString());
  }, [value, step, min, max, onChange]);

  const decrement = useCallback(() => {
    let newValue = value - step;
    newValue = Math.min(Math.max(newValue, min), max);
    onChange(newValue);
    setLocalValue(newValue.toString());
  }, [value, step, min, max, onChange]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <label className="text-xs text-[var(--mc-text-secondary)] w-16 flex-shrink-0">
          {label}
        </label>
      )}
      
      <div className="flex items-center flex-1">
        <button
          className="w-5 h-6 bg-[var(--mc-bg-tertiary)] border border-[var(--mc-border)] rounded-l text-[var(--mc-text-secondary)] hover:bg-[var(--mc-bg-hover)] disabled:opacity-50"
          onClick={decrement}
          disabled={disabled || value <= min}
          type="button"
        >
          −
        </button>
        
        <div className="relative flex-1">
          <input
            type="text"
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="w-full px-2 py-1 text-xs bg-[var(--mc-bg-tertiary)] border-y border-[var(--mc-border)] text-[var(--mc-text-primary)] outline-none focus:border-[var(--mc-accent)] text-center"
          />
          {unit && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--mc-text-tertiary)] pointer-events-none">
              {unit}
            </span>
          )}
        </div>
        
        <button
          className="w-5 h-6 bg-[var(--mc-bg-tertiary)] border border-[var(--mc-border)] rounded-r text-[var(--mc-text-secondary)] hover:bg-[var(--mc-bg-hover)] disabled:opacity-50"
          onClick={increment}
          disabled={disabled || value >= max}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
