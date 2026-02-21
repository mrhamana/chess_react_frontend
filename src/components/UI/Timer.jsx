import React from 'react';
import { formatTime } from '../../utils/gameHelpers';

const timerStyle = {
    fontFamily: "'Courier New', monospace",
    fontSize: '1.3rem',
    fontWeight: 700,
    padding: '0.4rem 0.75rem',
    borderRadius: '8px',
    background: 'rgba(0, 0, 0, 0.3)',
    color: 'var(--text)',
    minWidth: '70px',
    textAlign: 'center',
    transition: 'color 0.3s',
};

const lowTimeStyle = {
    ...timerStyle,
    color: '#ff5252',
    animation: 'timer-pulse 1s infinite',
};

export default function Timer({ seconds, isActive }) {
    const isLow = seconds !== Infinity && seconds <= 30;

    return (
        <div
            style={{
                ...(isLow ? lowTimeStyle : timerStyle),
                boxShadow: isActive ? '0 0 12px rgba(102,126,234,0.3)' : 'none',
            }}
        >
            {formatTime(seconds)}
        </div>
    );
}
