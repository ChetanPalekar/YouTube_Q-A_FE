import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import { chatApi } from '../lib/chatApi.js';
import UploadModal from '../components/UploadModal.jsx';

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUpload, setShowUpload] = useState(false);

  const handleNewChat = async () => {
    const session = await chatApi.createSession();
    setActiveSessionId(session.id);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="flex bg-white dark:bg-neutral-900">
      <Sidebar
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        onUploadClick={() => setShowUpload(true)}
        refreshKey={refreshKey}
      />
      <ChatWindow sessionId={activeSessionId} />
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploadComplete={() => {}}
        />
      )}
    </div>
  );
}