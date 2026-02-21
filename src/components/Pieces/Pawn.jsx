import React from 'react';

export default function Pawn({ color, className }) {
    const fill = color === 'w' ? '#fff' : '#333';
    const stroke = color === 'w' ? '#333' : '#111';

    return (
        <svg className={className} viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M 22.5,9 C 19.8,9 18,10.8 18,13.5
           C 18,15.1 18.8,16.4 20,17.2
           C 18,18.1 15,21.7 15,25.5
           C 15,27.2 15.4,28.8 16.5,30
           C 13.5,31 11,33.5 10.5,36
           L 34.5,36
           C 34,33.5 31.5,31 28.5,30
           C 29.6,28.8 30,27.2 30,25.5
           C 30,21.7 27,18.1 25,17.2
           C 26.2,16.4 27,15.1 27,13.5
           C 27,10.8 25.2,9 22.5,9 z"
                fill={fill}
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}
