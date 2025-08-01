import React, { useState, useEffect, useRef } from 'react';
import './MessagingPage.css';

function MessagingPage({ currentUser, onBack }) {
  const [conversations, setConversations] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'proposals'
  const messagesEndRef = useRef(null);

  // Sample conversations data
  const sampleConversations = [
    {
      id: 1,
      participant: {
        id: 101,
        name: "Carolina Sports Bar & Grill",
        image: "https://via.placeholder.com/200x200/6f42c1/ffffff?text=CSB",
        type: "business"
      },
      lastMessage: "Great! Let's discuss the details for the game day promotion.",
      lastMessageTime: "2024-01-15T14:30:00Z",
      unreadCount: 2,
      messages: [
        {
          id: 1,
          senderId: 101,
          text: "Hi Michael! We loved your proposal for our game day menu promotion.",
          timestamp: "2024-01-15T10:00:00Z",
          isRead: true
        },
        {
          id: 2,
          senderId: 1,
          text: "Thank you! I'm excited about this opportunity. What specific content are you looking for?",
          timestamp: "2024-01-15T10:15:00Z",
          isRead: true
        },
        {
          id: 3,
          senderId: 101,
          text: "We'd like Instagram stories during game days and a feed post about our new menu items.",
          timestamp: "2024-01-15T11:00:00Z",
          isRead: true
        },
        {
          id: 4,
          senderId: 1,
          text: "Perfect! I can definitely do that. What's the timeline you're thinking?",
          timestamp: "2024-01-15T12:00:00Z",
          isRead: true
        },
        {
          id: 5,
          senderId: 101,
          text: "Great! Let's discuss the details for the game day promotion.",
          timestamp: "2024-01-15T14:30:00Z",
          isRead: false
        }
      ]
    },
    {
      id: 2,
      participant: {
        id: 102,
        name: "Elite Fitness Center",
        image: "https://via.placeholder.com/200x200/20c997/ffffff?text=EFC",
        type: "business"
      },
      lastMessage: "When can you start filming the workout content?",
      lastMessageTime: "2024-01-14T16:45:00Z",
      unreadCount: 0,
      messages: [
        {
          id: 1,
          senderId: 102,
          text: "Hi Michael! We're interested in having you promote our new HIIT program.",
          timestamp: "2024-01-14T09:00:00Z",
          isRead: true
        },
        {
          id: 2,
          senderId: 1,
          text: "That sounds amazing! I love HIIT workouts. What kind of content are you looking for?",
          timestamp: "2024-01-14T10:00:00Z",
          isRead: true
        },
        {
          id: 3,
          senderId: 102,
          text: "We'd like workout videos, before/after posts, and testimonials about the program.",
          timestamp: "2024-01-14T14:00:00Z",
          isRead: true
        },
        {
          id: 4,
          senderId: 1,
          text: "I can definitely do that! I'm available to start next week.",
          timestamp: "2024-01-14T15:00:00Z",
          isRead: true
        },
        {
          id: 5,
          senderId: 102,
          text: "When can you start filming the workout content?",
          timestamp: "2024-01-14T16:45:00Z",
          isRead: true
        }
      ]
    },
    {
      id: 3,
      participant: {
        id: 2,
        name: "Sarah Williams",
        image: "https://via.placeholder.com/200x200/28a745/ffffff?text=SW",
        type: "athlete"
      },
      lastMessage: "Thanks for the collaboration opportunity!",
      lastMessageTime: "2024-01-13T11:20:00Z",
      unreadCount: 0,
      messages: [
        {
          id: 1,
          senderId: 1,
          text: "Hi Sarah! I saw you're also working with Carolina Sports Bar. Would you be interested in a collaboration?",
          timestamp: "2024-01-13T10:00:00Z",
          isRead: true
        },
        {
          id: 2,
          senderId: 2,
          text: "That sounds great! What did you have in mind?",
          timestamp: "2024-01-13T10:30:00Z",
          isRead: true
        },
        {
          id: 3,
          senderId: 1,
          text: "We could do a joint post about game day traditions and food!",
          timestamp: "2024-01-13T11:00:00Z",
          isRead: true
        },
        {
          id: 4,
          senderId: 2,
          text: "Thanks for the collaboration opportunity!",
          timestamp: "2024-01-13T11:20:00Z",
          isRead: true
        }
      ]
    }
  ];

  // Sample proposals data
  const sampleProposals = [
    {
      id: 1,
      title: "Game Day Menu Promotion",
      business: "Carolina Sports Bar & Grill",
      athlete: "Michael Johnson",
      status: "pending",
      amount: 1500,
      description: "Instagram stories during game days and feed post about new menu items",
      submittedDate: "2024-01-15T10:00:00Z",
      deadline: "2024-01-25T00:00:00Z"
    },
    {
      id: 2,
      title: "HIIT Workout Program",
      business: "Elite Fitness Center",
      athlete: "Michael Johnson",
      status: "accepted",
      amount: 2500,
      description: "Workout videos, before/after posts, and testimonials about the program",
      submittedDate: "2024-01-14T09:00:00Z",
      deadline: "2024-01-30T00:00:00Z"
    },
    {
      id: 3,
      title: "Sports Equipment Review",
      business: "Sports Gear Co.",
      athlete: "Sarah Williams",
      status: "rejected",
      amount: 800,
      description: "Product review and demonstration videos for new basketball equipment",
      submittedDate: "2024-01-10T14:00:00Z",
      deadline: "2024-01-20T00:00:00Z"
    }
  ];

  // Initialize conversations and proposals
  useEffect(() => {
    setConversations(sampleConversations);
    setProposals(sampleProposals);
  }, [sampleConversations, sampleProposals]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      senderId: currentUser.id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // Update conversation with new message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: message.text,
          lastMessageTime: message.timestamp,
          messages: [...conv.messages, message]
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(prev => ({
      ...prev,
      lastMessage: message.text,
      lastMessageTime: message.timestamp,
      messages: [...prev.messages, message]
    }));
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markConversationAsRead = (conversationId) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, isRead: true }))
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
  };

  return (
    <div className="messaging-page">
      <div className="messaging-container">
        {/* Conversations Sidebar */}
        <div className="conversations-sidebar">
          <div className="sidebar-header">
            <button className="back-btn" onClick={onBack}>
              ← Back
            </button>
            <h2>Communication</h2>
            
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
                onClick={() => setActiveTab('messages')}
              >
                Messages
              </button>
              <button 
                className={`tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
                onClick={() => setActiveTab('proposals')}
              >
                Proposals
              </button>
            </div>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          {activeTab === 'messages' && (
            <div className="conversations-list">
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    markConversationAsRead(conversation.id);
                  }}
                >
                  <div className="conversation-avatar">
                    <img src={conversation.participant.image} alt={conversation.participant.name} />
                    {conversation.unreadCount > 0 && (
                      <span className="unread-badge">{conversation.unreadCount}</span>
                    )}
                  </div>
                  
                  <div className="conversation-content">
                    <div className="conversation-header">
                      <h3>{conversation.participant.name}</h3>
                      <span className="conversation-time">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    
                    <p className="conversation-preview">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'proposals' && (
            <div className="proposals-list">
              {proposals.map(proposal => (
                <div key={proposal.id} className="proposal-item">
                  <div className="proposal-header">
                    <h3>{proposal.title}</h3>
                    <span className={`status-badge ${proposal.status}`}>
                      {proposal.status === 'pending' ? 'Pending' : 
                       proposal.status === 'accepted' ? 'Accepted' : 'Rejected'}
                    </span>
                  </div>
                  
                  <div className="proposal-content">
                    <p><strong>Business:</strong> {proposal.business}</p>
                    <p><strong>Athlete:</strong> {proposal.athlete}</p>
                    <p><strong>Amount:</strong> ${proposal.amount.toLocaleString()}</p>
                    <p><strong>Description:</strong> {proposal.description}</p>
                    <p><strong>Submitted:</strong> {new Date(proposal.submittedDate).toLocaleDateString()}</p>
                    <p><strong>Deadline:</strong> {new Date(proposal.deadline).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="proposal-actions">
                    {proposal.status === 'pending' && (
                      <>
                        <button className="action-btn primary-btn">Accept</button>
                        <button className="action-btn secondary-btn">Reject</button>
                      </>
                    )}
                    {proposal.status === 'accepted' && (
                      <button className="action-btn primary-btn">View Details</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-participant">
                  <img src={selectedConversation.participant.image} alt={selectedConversation.participant.name} />
                  <div>
                    <h3>{selectedConversation.participant.name}</h3>
                    <span className="participant-type">
                      {selectedConversation.participant.type === 'athlete' ? 'Athlete' : 'Business'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {selectedConversation.messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === currentUser.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.text}</p>
                      <span className="message-time">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <div className="message-input-wrapper">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="message-input"
                    rows="1"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="send-button"
                  >
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="no-conversation-content">
                {activeTab === 'messages' ? (
                  <>
                    <span className="no-conversation-icon">Messages</span>
                    <h3>Select a conversation</h3>
                    <p>Choose a conversation from the list to start messaging</p>
                  </>
                ) : (
                  <>
                    <span className="no-conversation-icon">Proposals</span>
                    <h3>Proposals Overview</h3>
                    <p>View and manage your NIL proposals from the list</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagingPage; 