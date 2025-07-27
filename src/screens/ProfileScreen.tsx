import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatHeader from '../components/ChatHeader';

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, credits, signOut } = useAuth();
  const { colors } = useTheme();

  const handleSignOut = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const profileOptions = [
    {
      icon: 'account-circle',
      title: 'Thông tin tài khoản',
      subtitle: user?.email || '',
      onPress: () => Alert.alert('Thông tin', 'Tính năng đang phát triển'),
    },
    {
      icon: 'monetization-on',
      title: 'Credits',
      subtitle: `${credits} credits có sẵn`,
      onPress: () => Alert.alert('Credits', `Bạn có ${credits} credits`),
    },
    {
      icon: 'history',
      title: 'Lịch sử chat',
      subtitle: 'Xem lại các cuộc trò chuyện',
      onPress: () => Alert.alert('Lịch sử', 'Tính năng đang phát triển'),
    },
    {
      icon: 'cloud-upload',
      title: 'Sao lưu dữ liệu',
      subtitle: 'Sao lưu chat và cài đặt',
      onPress: () => Alert.alert('Sao lưu', 'Tính năng đang phát triển'),
    },
    {
      icon: 'help',
      title: 'Trợ giúp',
      subtitle: 'Hướng dẫn sử dụng',
      onPress: () => Alert.alert('Trợ giúp', 'Liên hệ support@example.com'),
    },
    {
      icon: 'info',
      title: 'Về ứng dụng',
      subtitle: 'Phiên bản 1.0.0',
      onPress: () => Alert.alert('Về ứng dụng', 'Vietnamese AI Chat v1.0.0\nPowered by React Native'),
    },
  ];

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ChatHeader
        title="Hồ sơ"
        credits={credits}
        onMenuPress={() => navigation.openDrawer()}
        onNewChatPress={() => {}}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Icon name="person" size={48} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.email}</Text>
          <Text style={styles.userRole}>Người dùng Premium</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{credits}</Text>
              <Text style={styles.statLabel}>Credits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Chats</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={option.onPress}>
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <Icon name={option.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Icon name="logout" size={24} color={colors.error} />
          <Text style={styles.signOutText}>Đăng xuất</Text>
        </TouchableOpacity>
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
    profileCard: {
      backgroundColor: colors.surface,
      margin: 16,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    userName: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    userRole: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: colors.border,
    },
    optionsContainer: {
      margin: 16,
      marginTop: 0,
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    optionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    optionText: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 2,
    },
    optionSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 16,
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.error,
    },
    signOutText: {
      fontSize: 16,
      color: colors.error,
      fontWeight: '600',
      marginLeft: 8,
    },
  });