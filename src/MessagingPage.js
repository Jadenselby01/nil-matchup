import React, { useState, useEffect, useRef } from 'react';
import './MessagingPage.css';

function MessagingPage({ currentUser, onBack }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Sample conversations data - only with businesses
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
        id: 103,
        name: "Sports Gear Co.",
        image: "https://via.placeholder.com/200x200/fd7e14/ffffff?text=SGC",
        type: "business"
      },
      lastMessage: "We'd love to send you some samples to review!",
      lastMessageTime: "2024-01-13T11:20:00Z",
      unreadCount: 0,
      messages: [
        {
          id: 1,
          senderId: 103,
          text: "Hi Michael! We're launching a new line of basketball equipment and would love to work with you.",
          timestamp: "2024-01-13T10:00:00Z",
          isRead: true
        },
        {
          id: 2,
          senderId: 1,
          text: "That sounds great! What kind of equipment are we talking about?",
          timestamp: "2024-01-13T10:30:00Z",
          isRead: true
        },
        {
          id: 3,
          senderId: 103,
          text: "We have new basketballs, training equipment, and accessories. We'd love to send you some samples!",
          timestamp: "2024-01-13T11:00:00Z",
          isRead: true
        },
        {
          id: 4,
          senderId: 1,
          text: "That would be perfect! I'd love to review and promote your products.",
          timestamp: "2024-01-13T11:15:00Z",
          isRead: true
        },
        {
          id: 5,
          senderId: 103,
          text: "We'd love to send you some samples to review!",
          timestamp: "2024-01-13T11:20:00Z",
          isRead: true
        }
      ]
    },
    // NIL Matchup business conversations with athletes
    {
      id: 4,
      participant: {
        id: 201,
        name: "Alex Rodriguez",
        image: "https://via.placeholder.com/200x200/007bff/ffffff?text=AR",
        type: "athlete"
      },
      lastMessage: "I can start the platform promotion campaign next week!",
      lastMessageTime: "2024-01-25T15:30:00Z",
      unreadCount: 1,
      messages: [
        {
          id: 1,
          senderId: 201,
          text: "Hi NIL Matchup team! I'm interested in promoting your platform to other athletes.",
          timestamp: "2024-01-25T09:00:00Z",
          isRead: true
        },
        {
          id: 2,
          senderId: 999, // NIL Matchup business ID
          text: "Hi Alex! That's fantastic. We'd love to work with you on promoting our platform.",
          timestamp: "2024-01-25T10:00:00Z",
          isRead: true
        },
        {
          id: 3,
          senderId: 201,
          text: "Great! I was thinking of creating content about how NIL Matchup helped me find opportunities.",
          timestamp: "2024-01-25T11:00:00Z",
          isRead: true
        },
        {
          id: 4,
          senderId: 999,
          text: "That's exactly what we're looking for! We can offer $2,000 for the campaign.",
          timestamp: "2024-01-25T12:00:00Z",
          isRead: true
        },
        {
          id: 5,
          senderId: 201,
          text: "I can start the platform promotion campaign next week!",
          timestamp: "2024-01-25T15:30:00Z",
          isRead: false
        }
      ]
    },
    {
      id: 5,
      participant: {
        id: 202,
        name: "Emma Thompson",
        image: "https://via.placeholder.com/200x200/e83e8c/ffffff?text=ET",
        type: "athlete"
      },
      lastMessage: "The social media takeover was a huge success!",
      lastMessageTime: "2024-01-22T18:00:00Z",
      unreadCount: 0,
      messages: [
        {
          id: 1,
          senderId: 202,
          text: "Hi! I'd love to do a social media takeover for NIL Matchup.",
          timestamp: "2024-01-20T14:00:00Z",
          isRead: true
        },
        {
          id: 2,
          senderId: 999,
          text: "Hi Emma! That sounds amazing. We'd love to showcase athlete success stories.",
          timestamp: "2024-01-20T15:00:00Z",
          isRead: true
        },
        {
          id: 3,
          senderId: 202,
          text: "Perfect! I can take over your Instagram and share my NIL journey.",
          timestamp: "2024-01-21T10:00:00Z",
          isRead: true
        },
        {
          id: 4,
          senderId: 999,
          text: "Excellent! We'll pay $1,500 for the week-long takeover.",
          timestamp: "2024-01-21T11:00:00Z",
          isRead: true
        },
        {
          id: 5,
          senderId: 202,
          text: "The social media takeover was a huge success!",
          timestamp: "2024-01-22T18:00:00Z",
          isRead: true
        }
      ]
    },
    {
      id: 6,
      participant: {
        id: 203,
        name: "Marcus Johnson",
        image: "https://via.placeholder.com/200x200/28a745/ffffff?text=MJ",
        type: "athlete"
      },
      lastMessage: "I can create 5 testimonial videos about successful partnerships.",
      lastMessageTime: "2024-01-23T16:45:00Z",
      unreadCount: 0,
      messages: [
        {
          id: 1,
          senderId: 203,
          text: "Hi NIL Matchup! I'd love to create testimonial videos about successful partnerships.",
          timestamp: "2024-01-23T16:00:00Z",
          isRead: true
        },
        {
          id: 2,
          senderId: 999,
          text: "Hi Marcus! That's exactly what we need. How many videos are you thinking?",
          timestamp: "2024-01-23T16:15:00Z",
          isRead: true
        },
        {
          id: 3,
          senderId: 203,
          text: "I can create 5 testimonial videos about successful partnerships.",
          timestamp: "2024-01-23T16:45:00Z",
          isRead: true
        }
      ]
    },
    {
      id: 7,
      participant: {
        id: 204,
        name: "Sophia Chen",
        image: "https://via.placeholder.com/200x200/6f42c1/ffffff?text=SC",
        type: "athlete"
      },
      lastMessage: "The campus ambassador program was amazing!",
      lastMessageTime: "2024-01-30T17:00:00Z",
      unreadCount: 0,
      messages: [
        {
          id: 1,
          senderId: 204,
          text: "Hi! I'd love to be a campus ambassador for NIL Matchup.",
          timestamp: "2024-01-15T10:00:00Z",
          isRead: true
        },
        {
          id: 2,
          senderId: 999,
          text: "Hi Sophia! That's wonderful. We'd love to have you represent us on campus.",
          timestamp: "2024-01-15T11:00:00Z",
          isRead: true
        },
        {
          id: 3,
          senderId: 204,
          text: "I can promote NIL opportunities to fellow athletes and host info sessions.",
          timestamp: "2024-01-15T12:00:00Z",
          isRead: true
        },
        {
          id: 4,
          senderId: 999,
          text: "Perfect! We'll pay $1,200 for the month-long program.",
          timestamp: "2024-01-16T09:00:00Z",
          isRead: true
        },
        {
          id: 5,
          senderId: 204,
          text: "The campus ambassador program was amazing!",
          timestamp: "2024-01-30T17:00:00Z",
          isRead: true
        }
      ]
    }
  ];

  useEffect(() => {
    // Filter conversations based on current user
    let userConversations = sampleConversations;
    
    if (currentUser) {
      // For business users, show only conversations with athletes who have proposed deals
      if (currentUser.userType === 'business' || currentUser.businessName || currentUser.name?.toLowerCase().includes('nil')) {
        const businessName = currentUser.businessName || currentUser.name || '';
        userConversations = sampleConversations.filter(conv => {
          // Show conversations where the business is NIL Matchup (senderId 999) or matches the business name
          const isNILMatchupConversation = conv.messages.some(msg => msg.senderId === 999);
          const businessNameMatch = businessName.toLowerCase().includes('nil') && conv.participant.type === 'athlete';
          
          return isNILMatchupConversation || businessNameMatch;
        });
      }
      // For athlete users, show only conversations with businesses
      else if (currentUser.userType === 'athlete' || currentUser.athleteName) {
        const athleteName = currentUser.athleteName || currentUser.name || '';
        userConversations = sampleConversations.filter(conv => {
          // Show conversations where the athlete is the current user
          const isAthleteConversation = conv.participant.type === 'business';
          const athleteNameMatch = conv.participant.name.toLowerCase().includes(athleteName.toLowerCase());
          
          return isAthleteConversation && athleteNameMatch;
        });
      }
    }
    
    setConversations(userConversations);
  }, [currentUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (selectedConversation && selectedConversation.messages.length > 0) {
      // Only scroll if there are messages and we're not just selecting a conversation
      const lastMessage = selectedConversation.messages[selectedConversation.messages.length - 1];
      if (lastMessage.senderId === currentUser.id) {
        // Only auto-scroll when we send a new message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedConversation?.messages?.length, currentUser.id]);

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
            <h1>Messages</h1>
            <p className="subtitle">
              {currentUser?.userType === 'business' || currentUser?.name?.toLowerCase().includes('nil')
                ? 'Communicate with athletes about their proposals'
                : 'Connect with businesses about opportunities'
              }
            </p>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder={
                currentUser?.userType === 'business' || currentUser?.name?.toLowerCase().includes('nil')
                  ? "Search athletes..."
                  : "Search businesses..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
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
                      {currentUser?.userType === 'business' || currentUser?.name?.toLowerCase().includes('nil')
                        ? 'Athlete'
                        : 'Business'
                      }
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
                <span className="no-conversation-icon">Messages</span>
                <h3>Select a conversation</h3>
                <p>Choose a business from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagingPage; 