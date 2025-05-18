import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

// Dynamically import the Live API Console (client-only)
const LiveApiApp = dynamic(() => import('../live-api-web-console/src/App'), {
    ssr: false,
});

const GeminiLiveApiModal: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => {
    if (!open) return null;
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.35)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 12,
                    width: 1100,
                    height: 700,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 10,
                    }}
                    icon={<ThunderboltOutlined />}
                >
                    Đóng Live API
                </Button>
                <div
                    style={{ width: '100%', height: '100%', overflow: 'auto' }}
                >
                    <LiveApiApp />
                </div>
            </div>
        </div>
    );
};

export default GeminiLiveApiModal;
