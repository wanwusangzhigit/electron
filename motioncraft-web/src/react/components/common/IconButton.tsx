// 文件路径: src/react/components/common/IconButton.tsx

/**
 * 图标按钮组件
 */

import React from 'react';

interface IconButtonProps {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  variant?: 'default' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
  active = false,
  variant = 'default',
  size = 'md',
  title,
  className = '',
}) => {
  const baseClasses = 'btn flex items-center justify-center transition-all';
  
  const variantClasses = {
    default: active ? 'bg-[var(--mc-bg-active)] text-[var(--mc-accent)]' : 'hover:bg-[var(--mc-bg-hover)]',
    primary: 'bg-[var(--mc-accent)] text-black hover:bg-[var(--mc-accent-hover)]',
    danger: 'bg-[var(--mc-danger)] text-white hover:bg-[#ff6666]',
  };

  const sizeClasses = {
    sm: 'p-1.5 min-w-[28px] h-[28px]',
    md: 'p-2 min-w-[36px] h-[36px]',
    lg: 'p-2.5 min-w-[44px] h-[44px]',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title || label}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {label && <span className="ml-1 text-sm">{label}</span>}
    </button>
  );
};

export default IconButton;
