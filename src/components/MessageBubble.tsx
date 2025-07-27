import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ChatMessage } from '../services/ChatService';
import MarkdownDisplay from 'react-native-markdown-display';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { colors } = useTheme();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const styles = createStyles(colors, message.isUser);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        {message.file && (
          <View style={styles.fileContainer}>
            {message.file.type === 'image' ? (
              <Image source={{ uri: message.file.uri }} style={styles.fileImage} />
            ) : (
              <View style={styles.documentContainer}>
                <Icon name="description" size={24} color={colors.primary} />
                <Text style={styles.fileName} numberOfLines={1}>
                  {message.file.name}
                </Text>
              </View>
            )}
          </View>
        )}

        {message.text && (
          <View style={styles.textContainer}>
            {message.isUser ? (
              <Text style={styles.messageText}>{message.text}</Text>
            ) : (
              <MarkdownDisplay
                style={{
                  body: { color: colors.text, fontSize: 16 },
                  code_inline: {
                    backgroundColor: colors.surface,
                    color: colors.primary,
                    fontFamily: 'monospace',
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: 4,
                  },
                  code_block: {
                    backgroundColor: colors.surface,
                    padding: 12,
                    borderRadius: 8,
                    fontFamily: 'monospace',
                  },
                  link: {
                    color: colors.primary,
                    textDecorationLine: 'underline',
                  },
                }}>
                {message.text}
              </MarkdownDisplay>
            )}
          </View>
        )}

        {message.imageUrl && (
          <View style={styles.generatedContentContainer}>
            <Image source={{ uri: message.imageUrl }} style={styles.generatedImage} />
          </View>
        )}

        {message.videoUrl && (
          <View style={styles.generatedContentContainer}>
            <TouchableOpacity
              style={styles.videoContainer}
              onPress={() => handleLinkPress(message.videoUrl!)}>
              <Icon name="play-circle-filled" size={48} color={colors.primary} />
              <Text style={styles.videoText}>Nhấn để xem video</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.timeText}>{formatTime(message.timestamp)}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: any, isUser: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginVertical: 4,
    },
    bubble: {
      maxWidth: '80%',
      backgroundColor: isUser ? colors.primary : colors.surface,
      borderRadius: 18,
      padding: 12,
      borderBottomRightRadius: isUser ? 4 : 18,
      borderBottomLeftRadius: isUser ? 18 : 4,
    },
    fileContainer: {
      marginBottom: 8,
    },
    fileImage: {
      width: 200,
      height: 200,
      borderRadius: 12,
      resizeMode: 'cover',
    },
    documentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : colors.background,
      borderRadius: 8,
    },
    fileName: {
      marginLeft: 8,
      color: isUser ? '#ffffff' : colors.text,
      fontSize: 14,
      flex: 1,
    },
    textContainer: {
      marginBottom: 4,
    },
    messageText: {
      fontSize: 16,
      color: isUser ? '#ffffff' : colors.text,
      lineHeight: 22,
    },
    generatedContentContainer: {
      marginTop: 8,
    },
    generatedImage: {
      width: 250,
      height: 250,
      borderRadius: 12,
      resizeMode: 'cover',
    },
    videoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : colors.background,
      borderRadius: 12,
    },
    videoText: {
      marginTop: 8,
      color: isUser ? '#ffffff' : colors.text,
      fontSize: 14,
    },
    timeText: {
      fontSize: 12,
      color: isUser ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
      alignSelf: 'flex-end',
      marginTop: 4,
    },
  });