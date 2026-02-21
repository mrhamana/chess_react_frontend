import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated particles and floating chess pieces background for the hero section.
 */
export default function HeroSection() {
    // Generate random particles once
    const particles = useMemo(
        () =>
            Array.from({ length: 30 }, (_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                size: 2 + Math.random() * 4,
                duration: 8 + Math.random() * 12,
                delay: Math.random() * 10,
                opacity: 0.15 + Math.random() * 0.25,
            })),
        []
    );

    const floatingPieces = ['♔', '♛', '♜', '♝', '♞', '♟'];

    return (
        <>
            {/* Particles */}
            <div className="particles-container">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="particle"
                        style={{
                            left: p.left,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`,
                            opacity: p.opacity,
                        }}
                    />
                ))}
            </div>

            {/* Floating chess pieces */}
            <div className="floating-pieces">
                {floatingPieces.map((piece, i) => (
                    <motion.span
                        key={i}
                        className="floating-piece"
                        animate={{
                            y: [0, -20, -10, -25, 0],
                            rotate: [0, 5, -3, 2, 0],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            delay: i * 1.5,
                            ease: 'easeInOut',
                        }}
                    >
                        {piece}
                    </motion.span>
                ))}
            </div>
        </>
    );
}
