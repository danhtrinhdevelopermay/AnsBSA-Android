import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { ChatMessage, ChatService } from '../services/ChatService';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import ChatHeader from '../components/ChatHeader';

interface ChatScreenProps {
  navigation: any;
}

export default function ChatScreen({ navigation }: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [currentChatId, setCurrentChatId] = useState<string>('');

  const { user, credits, updateCredits } = useAuth();
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const chatService = new ChatService();

  useEffect(() => {
    // Initialize new chat
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const chatId = await chatService.createNewChat(user?.uid || '');
      setCurrentChatId(chatId);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: 'Xin chào! Tôi là AI Assistant của bạn. Tôi có thể giúp bạn chat, tạo hình ảnh, video, phân tích tài liệu và xây dựng website. Bạn cần tôi hỗ trợ gì?',
        isUser: false,
        timestamp: Date.now(),
        chatId: chatId,
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const sendMessage = async () => {
    if ((!inputText.trim() && !selectedFile) || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: Date.now(),
      chatId: currentChatId,
      file: selectedFile,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedFile(null);
    setIsTyping(true);

    try {
      // Check credits for AI features
      const costMap = {
        image: 200,
        video: 300,
        analysis: 200,
        chat: 50,
      };

      let estimatedCost = costMap.chat;
      const lowerText = inputText.toLowerCase();
      
      if (lowerText.includes('tạo ảnh') || lowerText.includes('vẽ') || lowerText.includes('hình')) {
        estimatedCost = costMap.image;
      } else if (lowerText.includes('video') || lowerText.includes('phim')) {
        estimatedCost = costMap.video;
      } else if (selectedFile) {
        estimatedCost = costMap.analysis;
      }

      if (credits < estimatedCost) {
        Alert.alert(
          'Không đủ Credits',
          `Bạn cần ${estimatedCost} credits cho tính năng này nhưng chỉ có ${credits} credits.`,
          [{ text: 'OK' }]
        );
        setIsTyping(false);
        return;
      }

      const response = await chatService.sendMessage(
        inputText,
        currentChatId,
        user?.uid || '',
        selectedFile
      );

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        timestamp: Date.now(),
        chatId: currentChatId,
        imageUrl: response.imageUrl,
        videoUrl: response.videoUrl,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Deduct credits
      updateCredits(-estimatedCost);

    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsTyping(false);
    }
  };

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          setSelectedFile({
            type: 'image',
            uri: response.assets[0].uri,
            name: response.assets[0].fileName,
            size: response.assets[0].fileSize,
          });
        }
      }
    );
  };

  const selectDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx],
      });
      
      setSelectedFile({
        type: 'document',
        uri: result.uri,
        name: result.name,
        size: result.size,
      });
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Error selecting document:', error);
      }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} />
  );

  const styles = createStyles(colors);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      
      <ChatHeader
        title="AI Chat"
        credits={credits}
        onMenuPress={() => navigation.openDrawer()}
        onNewChatPress={initializeChat}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        showsVerticalScrollIndicator={false}
      />

      {isTyping && <TypingIndicator />}

      {selectedFile && (
        <View style={styles.selectedFileContainer}>
          <View style={styles.selectedFile}>
            <Icon
              name={selectedFile.type === 'image' ? 'image' : 'description'}
              size={20}
              color={colors.primary}
            />
            <Text style={styles.selectedFileName} numberOfLines={1}>
              {selectedFile.name}
            </Text>
            <TouchableOpacity onPress={removeSelectedFile}>
              <Icon name="close" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <View style={styles.attachmentButtons}>
          <TouchableOpacity onPress={selectImage} style={styles.attachButton}>
            <Icon name="image" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={selectDocument} style={styles.attachButton}>
            <Icon name="attach-file" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={2000}
          editable={!isTyping}
        />

        <TouchableOpacity
          onPress={sendMessage}
          style={[
            styles.sendButton,
            (!inputText.trim() && !selectedFile) && styles.sendButtonDisabled
          ]}
          disabled={(!inputText.trim() && !selectedFile) || isTyping}>
          <Icon name="send" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    messagesList: {
      flex: 1,
    },
    messagesContainer: {
      padding: 16,
      paddingBottom: 8,
    },
    selectedFileContainer: {
      padding: 16,
      paddingTop: 8,
    },
    selectedFile: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    selectedFileName: {
      flex: 1,
      marginLeft: 8,
      color: colors.text,
      fontSize: 14,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    attachmentButtons: {
      flexDirection: 'row',
      marginRight: 12,
    },
    attachButton: {
      padding: 8,
      marginRight: 4,
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
      maxHeight: 100,
    },
    sendButton: {
      backgroundColor: colors.primary,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });