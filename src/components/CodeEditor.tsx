import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  path: string;
}

interface CodeEditorProps {
  file: FileItem;
  onSave: (content: string) => void;
}

export default function CodeEditor({ file, onSave }: CodeEditorProps) {
  const [content, setContent] = useState(file.content || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  const { colors } = useTheme();

  useEffect(() => {
    setContent(file.content || '');
    setHasChanges(false);
  }, [file]);

  useEffect(() => {
    // Generate line numbers
    const lines = content.split('\n');
    setLineNumbers(lines.map((_, index) => index + 1));
  }, [content]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== file.content);
  };

  const handleSave = () => {
    onSave(content);
    setHasChanges(false);
  };

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
      default:
        return 'description';
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* File Header */}
      <View style={styles.header}>
        <View style={styles.fileInfo}>
          <Icon
            name={getFileIcon(file.name)}
            size={20}
            color={colors.primary}
          />
          <Text style={styles.fileName}>{file.name}</Text>
          {hasChanges && <View style={styles.changeIndicator} />}
        </View>
        
        <TouchableOpacity
          style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!hasChanges}>
          <Icon name="save" size={20} color="#ffffff" />
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      {/* Editor */}
      <View style={styles.editorContainer}>
        <ScrollView
          style={styles.lineNumbersContainer}
          showsVerticalScrollIndicator={false}>
          {lineNumbers.map((lineNum) => (
            <Text key={lineNum} style={styles.lineNumber}>
              {lineNum}
            </Text>
          ))}
        </ScrollView>

        <ScrollView style={styles.codeContainer} showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.codeInput}
            value={content}
            onChangeText={handleContentChange}
            multiline
            placeholder="Nhập code..."
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            scrollEnabled={false}
            textAlignVertical="top"
          />
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => {
            const indentedContent = content
              .split('\n')
              .map(line => '  ' + line)
              .join('\n');
            handleContentChange(indentedContent);
          }}>
          <Icon name="format-indent-increase" size={16} color={colors.text} />
          <Text style={styles.quickActionText}>Indent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => {
            const unindentedContent = content
              .split('\n')
              .map(line => line.replace(/^  /, ''))
              .join('\n');
            handleContentChange(unindentedContent);
          }}>
          <Icon name="format-indent-decrease" size={16} color={colors.text} />
          <Text style={styles.quickActionText}>Unindent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => {
            // Format code (basic formatting)
            let formatted = content;
            if (file.name.endsWith('.html')) {
              // Basic HTML formatting
              formatted = formatted
                .replace(/></g, '>\n<')
                .replace(/\n\s*\n/g, '\n');
            } else if (file.name.endsWith('.css')) {
              // Basic CSS formatting
              formatted = formatted
                .replace(/}/g, '}\n')
                .replace(/{/g, ' {\n  ')
                .replace(/;/g, ';\n  ');
            }
            handleContentChange(formatted);
          }}>
          <Icon name="format-shapes" size={16} color={colors.text} />
          <Text style={styles.quickActionText}>Format</Text>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    fileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fileName: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    changeIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.warning,
      marginLeft: 8,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      color: '#ffffff',
      marginLeft: 4,
      fontSize: 14,
      fontWeight: '600',
    },
    editorContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    lineNumbersContainer: {
      width: 50,
      backgroundColor: colors.surface,
      paddingTop: 16,
    },
    lineNumber: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'right',
      paddingRight: 8,
      paddingVertical: 2,
      fontFamily: 'monospace',
    },
    codeContainer: {
      flex: 1,
    },
    codeInput: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      fontFamily: 'monospace',
      padding: 16,
      lineHeight: 20,
    },
    quickActions: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    quickActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      borderRadius: 4,
      backgroundColor: colors.background,
    },
    quickActionText: {
      marginLeft: 4,
      fontSize: 12,
      color: colors.text,
    },
  });