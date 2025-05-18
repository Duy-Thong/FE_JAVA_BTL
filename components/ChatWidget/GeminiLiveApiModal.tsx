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
                left: 10,
                bottom: 10,
                background: 'rgba(30, 41, 59, 0.10)', // subtle dark overlay
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                zIndex: 9999,
                pointerEvents: 'auto',
                boxShadow: 'none',
            }}
        >
            <div
                style={{
                    background: '#fff',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                }}
            >
                <Button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        zIndex: 10,
                        padding: '2px 10px',
                        fontSize: 13,
                        height: 28,
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: 6,
                        color: '#334155',
                        boxShadow: '0 1px 4px 0 rgba(30,41,59,0.06)',
                        fontWeight: 500,
                        transition: 'background 0.2s',
                    }}
                    icon={
                        <ThunderboltOutlined
                            style={{ fontSize: 15, color: '#f59e42' }}
                        />
                    }
                >
                    Đóng
                </Button>
                <div style={{ width: '100%', height: '100%' }}>
                    <LiveApiApp />
                </div>
            </div>
        </div>
    );
};

export default GeminiLiveApiModal;
