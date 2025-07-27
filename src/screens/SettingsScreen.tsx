import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatHeader from '../components/ChatHeader';
import { useAuth } from '../context/AuthContext';

interface SettingsScreenProps {
  navigation: any;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { credits } = useAuth();
  
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const settingSections = [
    {
      title: 'Giao diện',
      items: [
        {
          icon: isDark ? 'light-mode' : 'dark-mode',
          title: 'Chế độ tối',
          subtitle: isDark ? 'Đang bật' : 'Đang tắt',
          type: 'switch',
          value: isDark,
          onPress: toggleTheme,
        },
        {
          icon: 'palette',
          title: 'Chủ đề màu sắc',
          subtitle: 'Tùy chỉnh màu sắc ứng dụng',
          type: 'navigation',
          onPress: () => Alert.alert('Chủ đề', 'Tính năng đang phát triển'),
        },
      ],
    },
    {
      title: 'Thông báo',
      items: [
        {
          icon: 'notifications',
          title: 'Thông báo push',
          subtitle: 'Nhận thông báo từ AI',
          type: 'switch',
          value: notifications,
          onPress: () => setNotifications(!notifications),
        },
        {
          icon: 'volume-up',
          title: 'Âm thanh',
          subtitle: 'Âm báo khi có tin nhắn mới',
          type: 'switch',
          value: soundEnabled,
          onPress: () => setSoundEnabled(!soundEnabled),
        },
      ],
    },
    {
      title: 'Chat & AI',
      items: [
        {
          icon: 'save',
          title: 'Tự động lưu',
          subtitle: 'Lưu tin nhắn tự động',
          type: 'switch',
          value: autoSave,
          onPress: () => setAutoSave(!autoSave),
        },
        {
          icon: 'smart-toy',
          title: 'AI Model',
          subtitle: 'Gemini 1.5 Flash',
          type: 'navigation',
          onPress: () => Alert.alert('AI Model', 'Đang sử dụng Gemini 1.5 Flash'),
        },
        {
          icon: 'translate',
          title: 'Ngôn ngữ',
          subtitle: 'Tiếng Việt',
          type: 'navigation',
          onPress: () => Alert.alert('Ngôn ngữ', 'Hiện tại hỗ trợ tiếng Việt'),
        },
      ],
    },
    {
      title: 'Dữ liệu & Bảo mật',
      items: [
        {
          icon: 'backup',
          title: 'Sao lưu',
          subtitle: 'Sao lưu chat và cài đặt',
          type: 'navigation',
          onPress: () => Alert.alert('Sao lưu', 'Tính năng đang phát triển'),
        },
        {
          icon: 'delete-forever',
          title: 'Xóa dữ liệu',
          subtitle: 'Xóa tất cả chat và file',
          type: 'navigation',
          onPress: () => {
            Alert.alert(
              'Xóa dữ liệu',
              'Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.',
              [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', style: 'destructive', onPress: () => {} },
              ]
            );
          },
        },
        {
          icon: 'security',
          title: 'Quyền riêng tư',
          subtitle: 'Cài đặt bảo mật',
          type: 'navigation',
          onPress: () => Alert.alert('Quyền riêng tư', 'Tính năng đang phát triển'),
        },
      ],
    },
    {
      title: 'Hỗ trợ',
      items: [
        {
          icon: 'help',
          title: 'Trợ giúp',
          subtitle: 'Hướng dẫn sử dụng',
          type: 'navigation',
          onPress: () => Alert.alert('Trợ giúp', 'Liên hệ support@example.com'),
        },
        {
          icon: 'feedback',
          title: 'Phản hồi',
          subtitle: 'Gửi ý kiến đóng góp',
          type: 'navigation',
          onPress: () => Alert.alert('Phản hồi', 'Cảm ơn bạn quan tâm!'),
        },
        {
          icon: 'info',
          title: 'Về ứng dụng',
          subtitle: 'Phiên bản 1.0.0',
          type: 'navigation',
          onPress: () => Alert.alert('Về ứng dụng', 'Vietnamese AI Chat v1.0.0\nPowered by React Native'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    return (
      <View
        key={index}
        style={[
          styles.settingItem,
          index === 0 && styles.firstItem,
        ]}>
        <View style={styles.settingLeft}>
          <View style={styles.settingIcon}>
            <Icon name={item.icon} size={24} color={colors.primary} />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
        </View>

        {item.type === 'switch' ? (
          <Switch
            value={item.value}
            onValueChange={item.onPress}
            trackColor={{
              false: colors.border,
              true: colors.primary + '40',
            }}
            thumbColor={item.value ? colors.primary : colors.textSecondary}
          />
        ) : (
          <TouchableOpacity onPress={item.onPress} style={styles.navigationButton}>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ChatHeader
        title="Cài đặt"
        credits={credits}
        onMenuPress={() => navigation.openDrawer()}
        onNewChatPress={() => {}}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) =>
                renderSettingItem(item, itemIndex)
              )}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>
            Vietnamese AI Chat
          </Text>
          <Text style={styles.appVersionText}>
            Phiên bản 1.0.0 (Build 1)
          </Text>
          <Text style={styles.appCopyrightText}>
            © 2025 Vietnamese AI Chat. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 8,
      marginHorizontal: 16,
      textTransform: 'uppercase',
    },
    sectionContent: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    firstItem: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    navigationButton: {
      padding: 4,
    },
    appInfo: {
      alignItems: 'center',
      padding: 32,
      marginBottom: 16,
    },
    appInfoText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    appVersionText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    appCopyrightText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });