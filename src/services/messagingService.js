import { supabase, db, realtime } from '../config/supabase';

class MessagingService {
  constructor() {
    this.subscriptions = new Map();
  }

  // Send a message
  async sendMessage(dealId, senderId, content, messageType = 'text', fileUrl = null) {
    try {
      const messageData = {
        deal_id: dealId,
        sender_id: senderId,
        content,
        message_type: messageType,
        file_url: fileUrl,
        is_read: false
      };

      const { data, error } = await db.createMessage(messageData);
      
      if (error) throw error;

      // Mark message as read for sender
      await this.markMessageAsRead(data[0].id, senderId);

      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error sending message:', error);
      return { data: null, error };
    }
  }

  // Get messages for a deal
  async getMessages(dealId) {
    try {
      const { data, error } = await db.getMessages(dealId);
      
      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error getting messages:', error);
      return { data: null, error };
    }
  }

  // Mark message as read
  async markMessageAsRead(messageId, userId) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .neq('sender_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { error };
    }
  }

  // Mark all messages in a deal as read
  async markDealMessagesAsRead(dealId, userId) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('deal_id', dealId)
        .neq('sender_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error marking deal messages as read:', error);
      return { error };
    }
  }

  // Subscribe to real-time messages for a deal
  subscribeToMessages(dealId, callback) {
    // Unsubscribe from existing subscription if any
    if (this.subscriptions.has(dealId)) {
      this.subscriptions.get(dealId).unsubscribe();
    }

    // Create new subscription
    const subscription = realtime.subscribeToMessages(dealId, (payload) => {
      callback(payload);
    });

    // Store subscription for cleanup
    this.subscriptions.set(dealId, subscription);

    return subscription;
  }

  // Unsubscribe from messages
  unsubscribeFromMessages(dealId) {
    if (this.subscriptions.has(dealId)) {
      this.subscriptions.get(dealId).unsubscribe();
      this.subscriptions.delete(dealId);
    }
  }

  // Get unread message count for a user
  async getUnreadMessageCount(userId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id')
        .eq('is_read', false)
        .neq('sender_id', userId)
        .in('deal_id', 
          supabase
            .from('deals')
            .select('id')
            .or(`athlete_id.eq.${userId},business_id.eq.${userId}`)
        );

      if (error) throw error;

      return { data: data.length, error: null };
    } catch (error) {
      console.error('Error getting unread message count:', error);
      return { data: 0, error };
    }
  }

  // Get recent conversations for a user
  async getRecentConversations(userId) {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          id,
          title,
          status,
          athlete_id,
          business_id,
          messages (
            id,
            content,
            sender_id,
            created_at
          )
        `)
        .or(`athlete_id.eq.${userId},business_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Process conversations to get latest message
      const conversations = data.map(deal => {
        const messages = deal.messages || [];
        const latestMessage = messages.length > 0 
          ? messages[messages.length - 1] 
          : null;

        return {
          dealId: deal.id,
          title: deal.title,
          status: deal.status,
          latestMessage,
          unreadCount: messages.filter(m => !m.is_read && m.sender_id !== userId).length
        };
      });

      return { data: conversations, error: null };
    } catch (error) {
      console.error('Error getting recent conversations:', error);
      return { data: null, error };
    }
  }

  // Upload file for message
  async uploadMessageFile(file, dealId) {
    try {
      const fileName = `${dealId}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('message-files')
        .upload(fileName, file);

      if (error) throw error;

      const fileUrl = await supabase.storage
        .from('message-files')
        .getPublicUrl(fileName);

      return { data: fileUrl.data.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading message file:', error);
      return { data: null, error };
    }
  }

  // Delete a message (only sender can delete)
  async deleteMessage(messageId, userId) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { error };
    }
  }

  // Cleanup all subscriptions
  cleanup() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }
}

export default new MessagingService(); 