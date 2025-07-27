import axios from 'axios';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  chatId: string;
  file?: {
    type: 'image' | 'document';
    uri: string;
    name: string;
    size: number;
  };
  imageUrl?: string;
  videoUrl?: string;
}

export interface ChatResponse {
  message: string;
  imageUrl?: string;
  videoUrl?: string;
}

export class ChatService {
  private baseUrl = 'https://your-backend-api.repl.co'; // Replace with your actual backend URL

  async createNewChat(userId: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/chats`, {
        userId,
        title: 'New Chat',
      });
      return response.data.id;
    } catch (error) {
      console.error('Error creating new chat:', error);
      return Date.now().toString(); // Fallback to timestamp
    }
  }

  async sendMessage(
    message: string,
    chatId: string,
    userId: string,
    file?: any
  ): Promise<ChatResponse> {
    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('chatId', chatId);
      formData.append('userId', userId);

      if (file) {
        formData.append('file', {
          uri: file.uri,
          type: file.type === 'image' ? 'image/jpeg' : 'application/pdf',
          name: file.name,
        } as any);
      }

      const response = await axios.post(`${this.baseUrl}/api/chat`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });

      return {
        message: response.data.message,
        imageUrl: response.data.imageUrl,
        videoUrl: response.data.videoUrl,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Return a fallback response
      return {
        message: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',
      };
    }
  }

  async getChatHistory(chatId: string): Promise<ChatMessage[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/chats/${chatId}/messages`);
      return response.data.messages;
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  async getUserChats(userId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/users/${userId}/chats`);
      return response.data.chats;
    } catch (error) {
      console.error('Error getting user chats:', error);
      return [];
    }
  }
}