import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';
import { chatApi } from '../lib/chatApi.js';
import { typeOutText } from '../lib/typewriter.js';


export default function ChatWindow({ sessionId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;
        chatApi.getMessages(sessionId).then(setMessages).catch(console.error);
    }, [sessionId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        const question = input;
        setInput('');
        setSending(true);
        setMessages((prev) => [...prev, { role: 'user', content: question }]);

        try {
            const result = await chatApi.ask(question, sessionId);

            const assistantIndex = messages.length + 1;
            // Add the message WITHOUT source/timestamps yet — just empty content to type into
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: '', source: null, timestamps: null },
            ]);
      
            await typeOutText(result.answer, (partial) => {
              setMessages((prev) => {
                const updated = [...prev];
                updated[assistantIndex] = { ...updated[assistantIndex], content: partial };
                return updated;
              });
            }, { minDelay: 80, maxDelay: 260 });
      
            // NOW that typing is done, attach source + timestamps
            setMessages((prev) => {
              const updated = [...prev];
              updated[assistantIndex] = {
                ...updated[assistantIndex],
                source: result.source,
                timestamps: result.timestamps,
              };
              return updated;
            });
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: `Error: ${err.message}`, source: null },
            ]);
        } finally {
            setSending(false);
        }
    };

    if (!sessionId) {
        return (
            <div className="flex-1 flex items-center justify-center text-neutral-400 dark:text-neutral-600">
                Select a chat or start a new one
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {messages.map((msg, i) => (
                    <MessageBubble key={i} message={msg} />
                ))}
                {sending && (
                    <div className="text-sm text-neutral-400 dark:text-neutral-600 animate-pulse">
                        Thinking...
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl px-4 py-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your videos..."
                        className="flex-1 bg-transparent outline-none text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400"
                    />
                    <button
                        type="submit"
                        disabled={sending || !input.trim()}
                        className="p-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 disabled:opacity-40 transition-opacity"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
}