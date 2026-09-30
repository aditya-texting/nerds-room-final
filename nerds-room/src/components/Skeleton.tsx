import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
    const baseClass = "bg-gray-200 animate-pulse";
    const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-lg';

    return (
        <div className={`${baseClass} ${variantClass} ${className}`} />
    );
};

export default Skeleton;
