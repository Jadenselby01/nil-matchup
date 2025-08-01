import { db } from '../config/supabase';

class NotificationService {
  constructor() {
    this.emailService = this.initializeEmailService();
    this.smsService = this.initializeSMSService();
  }

  // Initialize email service (SendGrid or Resend)
  initializeEmailService() {
    const sendGridApiKey = process.env.REACT_APP_SENDGRID_API_KEY;
    const resendApiKey = process.env.REACT_APP_RESEND_API_KEY;

    if (sendGridApiKey) {
      return 'sendgrid';
    } else if (resendApiKey) {
      return 'resend';
    } else {
      return 'console'; // Fallback for development
    }
  }

  // Initialize SMS service (Twilio)
  initializeSMSService() {
    const twilioAccountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;

    if (twilioAccountSid && twilioAuthToken) {
      return 'twilio';
    } else {
      return 'console'; // Fallback for development
    }
  }

  // Create notification in database
  async createNotification(userId, title, message, notificationType = 'system', actionUrl = null, metadata = {}) {
    try {
      const notificationData = {
        user_id: userId,
        title,
        message,
        notification_type: notificationType,
        action_url: actionUrl,
        metadata,
        is_read: false
      };

      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select();

      if (error) throw error;

      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { data: null, error };
    }
  }

  // Send email notification
  async sendEmail(to, subject, content, template = null) {
    try {
      if (this.emailService === 'sendgrid') {
        return await this.sendEmailViaSendGrid(to, subject, content, template);
      } else if (this.emailService === 'resend') {
        return await this.sendEmailViaResend(to, subject, content, template);
      } else {
        // Console fallback for development
        console.log('Email would be sent:', { to, subject, content });
        return { success: true, error: null };
      }
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }
  }

  // Send SMS notification
  async sendSMS(to, message) {
    try {
      if (this.smsService === 'twilio') {
        return await this.sendSMSViaTwilio(to, message);
      } else {
        // Console fallback for development
        console.log('SMS would be sent:', { to, message });
        return { success: true, error: null };
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error };
    }
  }

  // SendGrid email implementation
  async sendEmailViaSendGrid(to, subject, content, template) {
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          content,
          template,
          service: 'sendgrid'
        }),
      });

      const data = await response.json();
      return { success: response.ok, error: response.ok ? null : data.error };
    } catch (error) {
      return { success: false, error };
    }
  }

  // Resend email implementation
  async sendEmailViaResend(to, subject, content, template) {
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          content,
          template,
          service: 'resend'
        }),
      });

      const data = await response.json();
      return { success: response.ok, error: response.ok ? null : data.error };
    } catch (error) {
      return { success: false, error };
    }
  }

  // Twilio SMS implementation
  async sendSMSViaTwilio(to, message) {
    try {
      const response = await fetch('/.netlify/functions/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          message
        }),
      });

      const data = await response.json();
      return { success: response.ok, error: response.ok ? null : data.error };
    } catch (error) {
      return { success: false, error };
    }
  }

  // Get user notifications
  async getUserNotifications(userId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return { data: null, error };
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId, userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { error };
    }
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { error };
    }
  }

  // Get unread notification count
  async getUnreadNotificationCount(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      return { data: data.length, error: null };
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      return { data: 0, error };
    }
  }

  // Delete notification
  async deleteNotification(notificationId, userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { error };
    }
  }

  // Predefined notification templates
  getNotificationTemplates() {
    return {
      // Deal notifications
      dealApplied: {
        title: 'New Deal Application',
        message: 'An athlete has applied for your NIL deal.',
        type: 'deal_update'
      },
      dealAccepted: {
        title: 'Deal Accepted',
        message: 'Your deal application has been accepted!',
        type: 'deal_update'
      },
      dealRejected: {
        title: 'Deal Application Update',
        message: 'Your deal application was not selected.',
        type: 'deal_update'
      },
      paymentSecured: {
        title: 'Payment Secured',
        message: 'Payment has been secured for your deal.',
        type: 'payment'
      },
      paymentReleased: {
        title: 'Payment Released',
        message: 'Your payment has been released!',
        type: 'payment'
      },
      postUploaded: {
        title: 'Post Uploaded',
        message: 'The athlete has uploaded their NIL post.',
        type: 'deal_update'
      },
      postVerified: {
        title: 'Post Verified',
        message: 'Your NIL post has been verified.',
        type: 'deal_update'
      },

      // Message notifications
      newMessage: {
        title: 'New Message',
        message: 'You have a new message in your deal.',
        type: 'message'
      },

      // System notifications
      welcome: {
        title: 'Welcome to NILMatch!',
        message: 'Thank you for joining our platform.',
        type: 'system'
      },
      profileComplete: {
        title: 'Profile Complete',
        message: 'Your profile has been successfully completed.',
        type: 'system'
      },
      legalDocumentsComplete: {
        title: 'Legal Documents Complete',
        message: 'All required legal documents have been signed.',
        type: 'system'
      }
    };
  }

  // Send notification with template
  async sendTemplateNotification(userId, templateKey, customData = {}) {
    try {
      const templates = this.getNotificationTemplates();
      const template = templates[templateKey];

      if (!template) {
        throw new Error(`Template ${templateKey} not found`);
      }

      // Replace placeholders in template
      let message = template.message;
      Object.keys(customData).forEach(key => {
        message = message.replace(`{${key}}`, customData[key]);
      });

      const notification = await this.createNotification(
        userId,
        template.title,
        message,
        template.type
      );

      return notification;
    } catch (error) {
      console.error('Error sending template notification:', error);
      return { data: null, error };
    }
  }

  // Send bulk notifications
  async sendBulkNotifications(userIds, title, message, notificationType = 'system') {
    try {
      const notifications = userIds.map(userId => ({
        user_id: userId,
        title,
        message,
        notification_type: notificationType,
        is_read: false
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      return { data: null, error };
    }
  }
}

export default new NotificationService(); 