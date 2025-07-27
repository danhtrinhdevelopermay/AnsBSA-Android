import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatHeader from '../components/ChatHeader';
import CodeEditor from '../components/CodeEditor';
import FileManager from '../components/FileManager';

interface WebBuilderScreenProps {
  navigation: any;
}

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  path: string;
}

export default function WebBuilderScreen({ navigation }: WebBuilderScreenProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeFile, setActiveFile] = useState<FileItem | null>(null);
  const [viewMode, setViewMode] = useState<'code' | 'preview' | 'files'>('files');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const { colors } = useTheme();
  const { credits } = useAuth();

  useEffect(() => {
    loadSampleProject();
  }, []);

  const loadSampleProject = () => {
    const sampleFiles: FileItem[] = [
      {
        name: 'index.html',
        type: 'file',
        path: '/index.html',
        content: `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Chào mừng đến với Website của tôi</h1>
            <nav>
                <a href="#home">Trang chủ</a>
                <a href="#about">Giới thiệu</a>
                <a href="#contact">Liên hệ</a>
            </nav>
        </header>
        
        <main>
            <section id="home">
                <h2>Trang chủ</h2>
                <p>Đây là nội dung trang chủ của website.</p>
            </section>
            
            <section id="about">
                <h2>Giới thiệu</h2>
                <p>Thông tin về tôi và website này.</p>
            </section>
            
            <section id="contact">
                <h2>Liên hệ</h2>
                <p>Thông tin liên hệ của tôi.</p>
            </section>
        </main>
        
        <footer>
            <p>&copy; 2025 My Website. All rights reserved.</p>
        </footer>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: 'style.css',
        type: 'file',
        path: '/style.css',
        content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

header {
    background: #2c3e50;
    color: white;
    padding: 1rem 0;
    text-align: center;
}

nav {
    margin-top: 1rem;
}

nav a {
    color: white;
    text-decoration: none;
    margin: 0 15px;
    padding: 5px 10px;
    border-radius: 3px;
    transition: background 0.3s;
}

nav a:hover {
    background: rgba(255,255,255,0.1);
}

main {
    padding: 2rem 0;
    background: white;
    margin: 2rem 0;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

section {
    padding: 2rem;
    margin-bottom: 2rem;
}

h1, h2 {
    margin-bottom: 1rem;
}

footer {
    background: #34495e;
    color: white;
    text-align: center;
    padding: 1rem 0;
}

@media (max-width: 768px) {
    nav a {
        display: block;
        margin: 5px 0;
    }
    
    section {
        padding: 1rem;
    }
}`,
      },
      {
        name: 'script.js',
        type: 'file',
        path: '/script.js',
        content: `// Simple JavaScript for website interactions
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation to sections when they come into view
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    console.log('Website loaded successfully!');
});`,
      },
    ];

    setFiles(sampleFiles);
    setActiveFile(sampleFiles[0]);
  };

  const handleFileSelect = (file: FileItem) => {
    setActiveFile(file);
    setViewMode('code');
  };

  const handleFileSave = (content: string) => {
    if (activeFile) {
      const updatedFiles = files.map(file =>
        file.path === activeFile.path ? { ...file, content } : file
      );
      setFiles(updatedFiles);
      setActiveFile({ ...activeFile, content });
      
      // Update preview if it's an HTML file
      if (activeFile.name === 'index.html') {
        generatePreview(updatedFiles);
      }
    }
  };

  const generatePreview = (fileList: FileItem[]) => {
    const htmlFile = fileList.find(f => f.name === 'index.html');
    if (htmlFile && htmlFile.content) {
      const blob = new Blob([htmlFile.content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    }
  };

  const handlePreview = () => {
    generatePreview(files);
    setViewMode('preview');
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ChatHeader
        title="Web Builder"
        credits={credits}
        onMenuPress={() => navigation.openDrawer()}
        onNewChatPress={() => {
          Alert.alert(
            'Tạo project mới',
            'Bạn có muốn tạo một project web mới không?',
            [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Tạo mới', onPress: loadSampleProject },
            ]
          );
        }}
      />

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolbarButton, viewMode === 'files' && styles.activeButton]}
          onPress={() => setViewMode('files')}>
          <Icon name="folder" size={20} color={colors.text} />
          <Text style={styles.toolbarButtonText}>Files</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolbarButton, viewMode === 'code' && styles.activeButton]}
          onPress={() => setViewMode('code')}>
          <Icon name="code" size={20} color={colors.text} />
          <Text style={styles.toolbarButtonText}>Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolbarButton, viewMode === 'preview' && styles.activeButton]}
          onPress={handlePreview}>
          <Icon name="visibility" size={20} color={colors.text} />
          <Text style={styles.toolbarButtonText}>Preview</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {viewMode === 'files' && (
          <FileManager
            files={files}
            onFileSelect={handleFileSelect}
            activeFile={activeFile}
          />
        )}

        {viewMode === 'code' && activeFile && (
          <CodeEditor
            file={activeFile}
            onSave={handleFileSave}
          />
        )}

        {viewMode === 'preview' && previewUrl && (
          <WebView
            source={{ uri: previewUrl }}
            style={styles.webview}
            onError={(error) => {
              console.error('WebView error:', error);
              Alert.alert('Lỗi', 'Không thể tải preview');
            }}
          />
        )}

        {viewMode === 'preview' && !previewUrl && (
          <View style={styles.emptyPreview}>
            <Icon name="web" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyPreviewText}>
              Nhấn Preview để xem website
            </Text>
          </View>
        )}
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
    toolbar: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    toolbarButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
    },
    activeButton: {
      backgroundColor: colors.primary,
    },
    toolbarButtonText: {
      marginLeft: 8,
      fontSize: 14,
      color: colors.text,
    },
    content: {
      flex: 1,
    },
    webview: {
      flex: 1,
    },
    emptyPreview: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyPreviewText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.textSecondary,
    },
  });