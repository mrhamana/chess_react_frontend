import React, { lazy, Suspense, Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChessProvider } from './context/ChessContext';
import HomePage from './components/Home/HomePage';

// Lazy-load the game page for faster initial load
const GameContainer = lazy(() => import('./components/Game/GameContainer'));

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('React Error Boundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        background: '#1a1a2e',
                        color: '#e0e0e0',
                        fontFamily: 'Inter, monospace',
                        padding: '2rem',
                    }}
                >
                    <div style={{ textAlign: 'center', maxWidth: 600 }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h2 style={{ marginBottom: '1rem' }}>Something went wrong</h2>
                        <pre
                            style={{
                                background: '#0d0d1a',
                                padding: '1rem',
                                borderRadius: 8,
                                textAlign: 'left',
                                overflow: 'auto',
                                fontSize: '0.85rem',
                                maxHeight: 300,
                            }}
                        >
                            {this.state.error?.toString()}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '1.5rem',
                                padding: '0.7rem 2rem',
                                background: '#646cff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontSize: '1rem',
                            }}
                        >
                            Reload
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function LoadingFallback() {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'var(--background)',
                color: 'var(--text)',
                fontSize: '1.2rem',
                fontFamily: 'Inter, sans-serif',
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♔</div>
                <div>Loading game...</div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/play"
                            element={
                                <ChessProvider>
                                    <GameContainer />
                                </ChessProvider>
                            }
                        />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </ErrorBoundary>
    );
}
