import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import './MessagingPage.css';

const MessagingPage = () => {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          deals (title),
          profiles!messages_sender_id_fkey (full_name, role),
          profiles!messages_recipient_id_fkey (full_name, role)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
        return;
      }

      // Group messages by conversation
      const conversationMap = new Map();
      data.forEach(message => {
        const otherUserId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        const otherUserName = message.sender_id === user.id 
          ? message.profiles_recipient_id_fkey?.full_name 
          : message.profiles_sender_id_fkey?.full_name;
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            name: otherUserName || 'Unknown User',
            lastMessage: message.content,
            lastMessageTime: message.created_at,
            dealTitle: message.deals?.title
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages(data);
      setSelectedConversation(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedConversation,
          content: newMessage.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      setNewMessage('');
      loadMessages(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="messaging-loading">
        <div className="spinner"></div>
        <p>Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="messaging-page">
      <div className="messaging-container">
        <div className="conversations-sidebar">
          <h2>Conversations</h2>
          <div className="conversations-list">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedConversation === conversation.id ? 'active' : ''}`}
                onClick={() => loadMessages(conversation.id)}
              >
                <div className="conversation-header">
                  <h4>{conversation.name}</h4>
                  <span className="conversation-time">
                    {new Date(conversation.lastMessageTime).toLocaleDateString()}
                  </span>
                </div>
                <p className="conversation-preview">{conversation.lastMessage}</p>
                {conversation.dealTitle && (
                  <span className="deal-context">Re: {conversation.dealTitle}</span>
                )}
              </div>
            ))}
            {conversations.length === 0 && (
              <p className="no-conversations">No conversations yet</p>
            )}
          </div>
        </div>

        <div className="messages-area">
          {selectedConversation ? (
            <>
              <div className="messages-header">
                <h3>Messages</h3>
              </div>
              <div className="messages-list">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.sender_id === user.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">{message.content}</div>
                    <div className="message-time">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage; 