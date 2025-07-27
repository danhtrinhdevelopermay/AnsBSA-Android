import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  path: string;
}

interface FileManagerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  activeFile: FileItem | null;
}

export default function FileManager({
  files,
  onFileSelect,
  activeFile,
}: FileManagerProps) {
  const { colors } = useTheme();

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
        return 'language';
      case 'css':
        return 'palette';
      case 'js':
        return 'code';
      case 'json':
        return 'data-object';
      case 'md':
        return 'description';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'image';
      default:
        return 'description';
    }
  };

  const getFileColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
        return '#e34c26';
      case 'css':
        return '#1572b6';
      case 'js':
        return '#f7df1e';
      case 'json':
        return '#000000';
      case 'md':
        return '#083fa1';
      default:
        return colors.textSecondary;
    }
  };

  const formatFileSize = (content?: string) => {
    if (!content) return '0 B';
    const bytes = new Blob([content]).size;
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFilePress = (file: FileItem) => {
    if (file.type === 'file') {
      onFileSelect(file);
    } else {
      Alert.alert('Thư mục', `Đây là thư mục: ${file.name}`);
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="folder-open" size={24} color={colors.primary} />
        <Text style={styles.headerTitle}>Project Files</Text>
      </View>

      <ScrollView style={styles.fileList} showsVerticalScrollIndicator={false}>
        {files.map((file, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.fileItem,
              activeFile?.path === file.path && styles.activeFileItem,
            ]}
            onPress={() => handleFilePress(file)}>
            <View style={styles.fileInfo}>
              <Icon
                name={file.type === 'folder' ? 'folder' : getFileIcon(file.name)}
                size={24}
                color={file.type === 'folder' ? colors.primary : getFileColor(file.name)}
              />
              <View style={styles.fileDetails}>
                <Text
                  style={[
                    styles.fileName,
                    activeFile?.path === file.path && styles.activeFileName,
                  ]}>
                  {file.name}
                </Text>
                {file.type === 'file' && (
                  <Text style={styles.fileSize}>
                    {formatFileSize(file.content)}
                  </Text>
                )}
              </View>
            </View>
            
            {activeFile?.path === file.path && (
              <Icon name="check-circle" size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
            Alert.alert(
              'Tạo file mới',
              'Tính năng này sẽ được thêm trong phiên bản sau',
              [{ text: 'OK' }]
            );
          }}>
          <Icon name="add" size={20} color={colors.primary} />
          <Text style={styles.footerButtonText}>Tạo file</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
            Alert.alert(
              'Tạo thư mục',
              'Tính năng này sẽ được thêm trong phiên bản sau',
              [{ text: 'OK' }]
            );
          }}>
          <Icon name="create-new-folder" size={20} color={colors.primary} />
          <Text style={styles.footerButtonText}>Tạo thư mục</Text>
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    headerTitle: {
      marginLeft: 12,
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    fileList: {
      flex: 1,
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    activeFileItem: {
      backgroundColor: colors.surface,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
    fileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    fileDetails: {
      marginLeft: 12,
      flex: 1,
    },
    fileName: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    activeFileName: {
      color: colors.primary,
      fontWeight: '600',
    },
    fileSize: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    footer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
    },
    footerButtonText: {
      marginLeft: 8,
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
    },
  });