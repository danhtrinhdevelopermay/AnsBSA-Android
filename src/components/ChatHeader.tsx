import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ChatHeaderProps {
  title: string;
  credits: number;
  onMenuPress: () => void;
  onNewChatPress: () => void;
}

export default function ChatHeader({
  title,
  credits,
  onMenuPress,
  onNewChatPress,
}: ChatHeaderProps) {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.surface}
        barStyle={colors.text === '#ffffff' ? 'light-content' : 'dark-content'}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Icon name="menu" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.creditsContainer}>
            <Icon name="monetization-on" size={16} color={colors.primary} />
            <Text style={styles.creditsText}>{credits} credits</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onNewChatPress} style={styles.newChatButton}>
          <Icon name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      height: 64,
    },
    menuButton: {
      padding: 8,
      marginRight: 8,
    },
    titleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    creditsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    creditsText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    newChatButton: {
      padding: 8,
      marginLeft: 8,
    },
  });