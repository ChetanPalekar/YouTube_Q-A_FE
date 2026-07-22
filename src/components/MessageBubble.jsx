import { motion } from 'framer-motion';
import { Globe, Video, Bot, AlertCircle } from 'lucide-react';

const sourceConfig = {
    video: { icon: Video, label: 'From your videos', color: 'text-blue-500' },
    web: { icon: Globe, label: 'From web search', color: 'text-amber-500' },
    agent: { icon: Bot, label: 'Assistant', color: 'text-neutral-400' },
    out_of_scope: { icon: AlertCircle, label: 'Out of scope', color: 'text-neutral-400' },
};

function formatTimestamp(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const config = sourceConfig[message.source];

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`max-w-2xl ${isUser ? 'ml-12' : 'mr-12'}`}>
                {!isUser && config && (
                    <div className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${config.color}`}>
                        <config.icon size={13} />
                        {config.label}
                    </div>
                )}

                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                        }`}
                >
                    {message.content}
                </div>

                {message.timestamps?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {message.timestamps.map((ts, i) => (
                            <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono"
                            >
                                {ts.video_title ? `${ts.video_title} · ` : ''}
                                {formatTimestamp(ts.start_ts)} – {formatTimestamp(ts.end_ts)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}