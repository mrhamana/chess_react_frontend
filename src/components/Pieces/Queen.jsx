import React from 'react';

export default function Queen({ color, className }) {
    const fill = color === 'w' ? '#fff' : '#333';
    const stroke = color === 'w' ? '#333' : '#111';

    return (
        <svg className={className} viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
            <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round">
                <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" />
                <path d="M 9,26 C 9,28 10.5,28.5 12.5,30 C 14.5,31.5 16.5,31 16.5,31 C 18.5,30 19.5,30 22.5,30 C 25.5,30 26.5,30 28.5,31 C 28.5,31 30.5,31.5 32.5,30 C 34.5,28.5 36,28 36,26" />
                <path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 18,27 12.5,30 L 12.5,37" />
                <path d="M 12.5,30 C 18,27 27,27 32.5,30" fill="none" />
                <path d="M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5" fill="none" />
                <path d="M 12.5,37 C 18,34 27,34 32.5,37" fill="none" />
                {/* Crown tips */}
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="14" cy="9" r="2.5" />
                <circle cx="22.5" cy="8" r="2.5" />
                <circle cx="31" cy="9" r="2.5" />
                <circle cx="39" cy="12" r="2.5" />
            </g>
        </svg>
    );
}
