import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Upload, Sun, Moon, LogOut } from 'lucide-react';
import { chatApi } from '../lib/chatApi.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar({ activeSessionId, onSelectSession, onNewChat, onUploadClick, refreshKey }) {
  const [sessions, setSessions] = useState([]);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    chatApi.listSessions().then(setSessions).catch(console.error);
  }, [refreshKey]);

  return (
    <div className="w-72 h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800">
      <div className="p-4 space-y-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> New chat
        </button>
        <button
          onClick={onUploadClick}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Upload size={18} /> Upload video Transcripts
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {sessions.map((session) => (
          <motion.button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm truncate transition-colors ${
              activeSessionId === session.id
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <MessageSquare size={16} className="shrink-0" />
            <span className="truncate">{session.title}</span>
          </motion.button>
        ))}
      </div>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{user?.name}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}