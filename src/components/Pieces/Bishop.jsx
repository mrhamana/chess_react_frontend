import React from 'react';

export default function Bishop({ color, className }) {
    const fill = color === 'w' ? '#fff' : '#333';
    const stroke = color === 'w' ? '#333' : '#111';

    return (
        <svg className={className} viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
            <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round">
                <g strokeLinecap="round">
                    <path d="M 9,36 C 12.4,35.7 19,36.3 22.5,34 C 26,36.3 32.6,35.7 36,36 C 36,36 37.7,36.8 39,38 C 38.3,38.9 37.1,38.5 36,38 C 33,36.4 27.5,37 22.5,36 C 17.5,37 12,36.4 9,38 C 7.9,38.5 6.7,38.9 6,38 C 7.3,36.8 9,36 9,36 z" />
                    <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
                    <path d="M 25,8 A 2.5,2.5 0 1 1 20,8 A 2.5,2.5 0 1 1 25,8 z" />
                </g>
                <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" fill="none" stroke={color === 'w' ? stroke : '#fff'} strokeLinejoin="miter" />
            </g>
        </svg>
    );
}
