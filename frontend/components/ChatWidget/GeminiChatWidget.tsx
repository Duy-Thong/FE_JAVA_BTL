import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Input, Button, Typography, Divider } from 'antd';
import {
    MessageOutlined,
    CloseCircleFilled,
    ThunderboltOutlined,
} from '@ant-design/icons';
import GeminiLiveApiModal from './GeminiLiveApiModal';

const { Text } = Typography;

const ai = new GoogleGenAI({
    apiKey: 'AIzaSyAEMi_o3YbFKqhr_8PMT_kIZWF2UQxdy-g',
});

const GeminiChatWidget: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: string; text: string }[]>(
        [],
    );
    const [loading, setLoading] = useState(false);
    const [showLiveApi, setShowLiveApi] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const currentInput = input;
        setInput(''); // Clear input immediately
        setMessages((msgs) => [...msgs, { role: 'user', text: currentInput }]);
        setLoading(true);
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: currentInput,
            });
            setMessages((msgs) => [
                ...msgs,
                { role: 'ai', text: formatGeminiResponse(response.text) },
            ]);
        } catch (e) {
            setMessages((msgs) => [
                ...msgs,
                { role: 'ai', text: 'Đã xảy ra lỗi khi gửi yêu cầu.' },
            ]);
        }
        setLoading(false);
    };

    // Helper function to format Gemini's response
    function formatGeminiResponse(text?: string) {
        if (!text) return '(No response)';
        // Simple formatting: preserve line breaks, trim, and basic markdown-like bold/italic
        return text
            .trim()
            .replace(/\n/g, '<br/>')
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\*(.*?)\*/g, '<i>$1</i>');
    }

    return (
        <>
            <Button
                type="primary"
                shape="circle"
                size="large"
                icon={
                    open ? (
                        <CloseCircleFilled style={{ fontSize: 28 }} />
                    ) : (
                        <MessageOutlined style={{ fontSize: 28 }} />
                    )
                }
                onClick={() => setOpen((v) => !v)}
                style={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 1000,
                    background: open ? '#ff7875' : '#4285F4',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                aria-label="Chat với Gemini"
            />
            <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                style={{
                    position: 'fixed',
                    bottom: 100,
                    right: 32,
                    zIndex: 1100,
                    background: '#ffd700',
                    color: '#222',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    fontWeight: 600,
                }}
                onClick={() => setShowLiveApi(true)}
            >
                Live API
            </Button>
            {open && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 100,
                        right: 32,
                        width: 370,
                        height: 520,
                        background: 'white',
                        borderRadius: 16,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                        zIndex: 1001,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            padding: 16,
                            borderBottom: '1px solid #eee',
                            fontWeight: 600,
                            background: '#f5f5f5',
                        }}
                    >
                        Chat
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                float: 'right',
                                background: 'none',
                                border: 'none',
                                fontSize: 18,
                                cursor: 'pointer',
                            }}
                            aria-label="Đóng"
                        >
                            ×
                        </button>
                    </div>
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: 16,
                            background: '#f9f9f9',
                            height: 0,
                        }}
                    >
                        {messages.length === 0 && (
                            <Text type="secondary">
                                Hỏi chúng tôi bất cứ điều gì!
                            </Text>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    marginBottom: 12,
                                    textAlign:
                                        msg.role === 'user' ? 'right' : 'left',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'inline-block',
                                        background:
                                            msg.role === 'user'
                                                ? '#e6f4ff'
                                                : '#f1f1f1',
                                        color: '#222',
                                        borderRadius: 8,
                                        padding: '8px 12px',
                                        maxWidth: 260,
                                        wordBreak: 'break-word',
                                        fontSize: 15,
                                        boxShadow:
                                            msg.role === 'user'
                                                ? '0 1px 4px #b6e0fe'
                                                : undefined,
                                    }}
                                    dangerouslySetInnerHTML={
                                        msg.role === 'ai'
                                            ? { __html: msg.text }
                                            : undefined
                                    }
                                >
                                    {msg.role === 'user' ? msg.text : undefined}
                                </span>
                            </div>
                        ))}
                        {loading && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    marginTop: 4,
                                }}
                            >
                                <span className="gemini-typing">
                                    <span className="dot">.</span>
                                    <span className="dot">.</span>
                                    <span className="dot">.</span>
                                </span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <Divider style={{ margin: 0 }} />
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 12,
                            background: '#fff',
                            borderTop: '1px solid #eee',
                        }}
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onPressEnter={handleSend}
                            placeholder="Nhập câu hỏi..."
                            style={{
                                flex: 1,
                                borderRadius: 8,
                                marginRight: 8,
                                fontSize: 15,
                            }}
                            disabled={loading}
                            autoFocus
                        />
                        <Button
                            type="primary"
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            style={{ borderRadius: 8, fontWeight: 600 }}
                        >
                            Gửi
                        </Button>
                    </div>
                </div>
            )}
            <GeminiLiveApiModal
                open={showLiveApi}
                onClose={() => setShowLiveApi(false)}
            />
            <style>{`
            .gemini-typing {
              display: inline-block;
              margin-left: 2px;
            }
            .gemini-typing .dot {
              display: inline-block;
              font-size: 22px;
              line-height: 1;
              opacity: 0.5;
              animation: gemini-blink 1.2s infinite both;
            }
            .gemini-typing .dot:nth-child(1) { animation-delay: 0s; }
            .gemini-typing .dot:nth-child(2) { animation-delay: 0.2s; }
            .gemini-typing .dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes gemini-blink {
              0%, 80%, 100% { opacity: 0.5; }
              40% { opacity: 1; }
            }
            `}</style>
        </>
    );
};

export default GeminiChatWidget;
