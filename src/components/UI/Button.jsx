import React from 'react';
import { motion } from 'framer-motion';

const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
};

const sizes = {
    sm: { padding: '0.4rem 0.8rem', fontSize: '0.8rem' },
    md: { padding: '0.6rem 1.2rem', fontSize: '0.9rem' },
    lg: { padding: '0.8rem 1.8rem', fontSize: '1rem' },
};

const variants = {
    primary: {
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
    secondary: {
        background: 'rgba(255, 255, 255, 0.08)',
        color: 'var(--text)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
    },
    danger: {
        background: 'rgba(255, 82, 82, 0.15)',
        color: '#ff5252',
        border: '1px solid rgba(255, 82, 82, 0.3)',
    },
    ghost: {
        background: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid transparent',
    },
};

export default function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    style: customStyle,
    ...props
}) {
    const btnStyle = {
        ...baseStyle,
        ...sizes[size],
        ...variants[variant],
        ...(disabled && { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' }),
        ...customStyle,
    };

    return (
        <motion.button
            style={btnStyle}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.04, filter: 'brightness(1.1)' } : {}}
            whileTap={!disabled ? { scale: 0.97 } : {}}
            {...props}
        >
            {children}
        </motion.button>
    );
}
