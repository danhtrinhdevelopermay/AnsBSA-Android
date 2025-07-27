import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MenuItem {
  name: string;
  icon: string;
  label: string;
  route: string;
}

const menuItems: MenuItem[] = [
  { name: 'chat', icon: 'chat', label: 'AI Chat', route: 'Chat' },
  { name: 'web-builder', icon: 'web', label: 'Web Builder', route: 'WebBuilder' },
  { name: 'profile', icon: 'person', label: 'Hồ sơ', route: 'Profile' },
  { name: 'settings', icon: 'settings', label: 'Cài đặt', route: 'Settings' },
];

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { user, signOut, credits } = useAuth();
  const { colors, toggleTheme, isDark } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* User Profile Section */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Icon name="person" size={32} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.email}</Text>
          <View style={styles.creditsContainer}>
            <Icon name="monetization-on" size={16} color={colors.primary} />
            <Text style={styles.creditsText}>{credits} credits</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.menuItem,
                props.state.routeNames[props.state.index] === item.route &&
                  styles.activeMenuItem,
              ]}
              onPress={() => props.navigation.navigate(item.route)}>
              <Icon
                name={item.icon}
                size={24}
                color={
                  props.state.routeNames[props.state.index] === item.route
                    ? colors.primary
                    : colors.text
                }
              />
              <Text
                style={[
                  styles.menuItemText,
                  props.state.routeNames[props.state.index] === item.route &&
                    styles.activeMenuItemText,
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme Toggle */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
            <Icon
              name={isDark ? 'light-mode' : 'dark-mode'}
              size={24}
              color={colors.text}
            />
            <Text style={styles.menuItemText}>
              {isDark ? 'Chế độ sáng' : 'Chế độ tối'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sign Out Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Icon name="logout" size={24} color={colors.error} />
          <Text style={styles.signOutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    userSection: {
      alignItems: 'center',
      padding: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    creditsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    creditsText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 6,
      fontWeight: '500',
    },
    menuSection: {
      paddingVertical: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    activeMenuItem: {
      backgroundColor: colors.surface,
      borderRightWidth: 3,
      borderRightColor: colors.primary,
    },
    menuItemText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 16,
    },
    activeMenuItemText: {
      color: colors.primary,
      fontWeight: '600',
    },
    settingsSection: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingVertical: 16,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      padding: 24,
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    signOutText: {
      fontSize: 16,
      color: colors.error,
      marginLeft: 16,
      fontWeight: '500',
    },
  });