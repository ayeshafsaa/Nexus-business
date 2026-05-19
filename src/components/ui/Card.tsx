import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const hoverableClass = hoverable ? 'transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click originated from a button or anchor, don't fire card's onClick
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    onClick?.();
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${hoverableClass} ${clickableClass} ${className}`}
      onClick={onClick ? handleClick : undefined}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};