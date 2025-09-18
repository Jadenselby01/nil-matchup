import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MessagingPage.css';

const MessagingPage = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(null);

  const conversations = [
    {
      id: 1,
      name: 'Carolina Sports Bar & Gr',
      sender: 'Car...',
      date: 'Jan 15',
      message: 'Great! Let\'s...',
      unread: 2
    },
    {
      id: 2,
      name: 'Elite Fitness Center',
      sender: 'Elite Fitnes...',
      date: 'Jan 14',
      message: 'When can you start...',
      unread: 0
    },
    {
      id: 3,
      name: 'Sports Gear Co.',
      sender: 'Sports Gear Co.',
      date: 'Jan 13',
      message: 'We\'d love to send you s...',
      unread: 0
    }
  ];

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="messaging-page">
      <div className="messaging-container">
        <div className="conversations-sidebar">
          <button className="back-btn" onClick={handleBack}>
             Back
          </button>
          <h2>Messages</h2>
          <p className="messages-subtitle">Connect with businesses about opportunities.</p>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search businesses..." 
              className="search-input"
            />
          </div>

          <div className="conversations-list">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="conversation-header">
                  <h4>{conversation.name}</h4>
                  <span className="conversation-date">{conversation.date}</span>
                </div>
                <div className="conversation-preview">
                  <span className="sender">{conversation.sender}</span>
                  <span className="message-text">{conversation.message}</span>
                </div>
                {conversation.unread > 0 && (
                  <div className="unread-badge">{conversation.unread}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="messages-area">
          {selectedConversation ? (
            <div className="selected-conversation">
              <h3>{selectedConversation.name}</h3>
              <div className="messages-list">
                <p>Messages will appear here...</p>
              </div>
            </div>
          ) : (
            <div className="no-conversation-selected">
              <h2>Messages</h2>
              <h3>Select a conversation</h3>
              <p>Choose a business from the list to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
