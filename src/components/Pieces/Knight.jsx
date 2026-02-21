import React from 'react';

export default function Knight({ color, className }) {
    const fill = color === 'w' ? '#fff' : '#333';
    const stroke = color === 'w' ? '#333' : '#111';

    return (
        <svg className={className} viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round">
                <path
                    d="M 22,10 C 32.5,11 38.5,18 38,39
             L 15,39 C 15,30 25,32.5 23,18"
                    fill={fill}
                    stroke={stroke}
                />
                <path
                    d="M 24,18 C 24.4,20.9 18.5,19.4 16,20
             C 13,20.4 13.2,23.9 12,24
             C 10,24.2 8.2,23 6.5,28
             C 13,28.5 13,30 14.5,31.5
             C 16,33.4 18.5,33.5 15,39"
                    fill={fill}
                    stroke={stroke}
                />
                <path d="M 9.5,25.5 A 0.5,0.5 0 1 1 8.5,25.5 A 0.5,0.5 0 1 1 9.5,25.5 z" fill={stroke} stroke={stroke} />
                <path
                    d="M 15,15.5 A 0.5,1.5 0 1 1 14,15.5
             A 0.5,1.5 0 1 1 15,15.5 z"
                    fill={stroke}
                    stroke={stroke}
                    transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
                />
                {color === 'b' && (
                    <>
                        <path d="M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.5 32.5,18.75 C 34.75,23 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z" fill="#fff" stroke="none" />
                    </>
                )}
            </g>
        </svg>
    );
}
