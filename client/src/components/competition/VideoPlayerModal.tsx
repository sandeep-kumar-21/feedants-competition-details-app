import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { X, Play, Pause, Volume2, RotateCcw, ExternalLink, Video } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { WebView } from 'react-native-webview';
import { theme } from '../../theme/theme';

interface VideoPlayerModalProps {
  visible: boolean;
  videoUrl: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

// Custom authentic YouTube Icon component (eliminates undefined export error)
const YouTubeIcon: React.FC<{ size?: number; color?: string; style?: any }> = ({
  size = 18,
  color = '#EF4444',
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
    <Path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </Svg>
);

export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  visible,
  videoUrl,
  title,
  subtitle,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(35);
  const [webViewLoading, setWebViewLoading] = useState<boolean>(true);

  const youtubeId = getYouTubeVideoId(videoUrl);
  const isYouTube = !!youtubeId;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleOpenExternal = async () => {
    try {
      const targetUrl = isYouTube ? `https://www.youtube.com/watch?v=${youtubeId}` : videoUrl;
      await Linking.openURL(targetUrl);
    } catch (err) {
      console.warn('Could not open external video URL:', err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTextCol}>
              <View style={styles.titleRow}>
                {isYouTube ? (
                  <YouTubeIcon size={18} color="#EF4444" style={{ marginRight: 6 }} />
                ) : (
                  <Video size={16} color="#007A87" style={{ marginRight: 6 }} />
                )}
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
              </View>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Video Player Display */}
          <View style={styles.playerContainer}>
            {isYouTube ? (
              // Embedded YouTube Player (Universal: iframe on Web, WebView on Native)
              <View style={styles.webViewWrapper}>
                {Platform.OS === 'web' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
                    style={{
                      width: '100%',
                      height: 220,
                      border: 'none',
                      borderRadius: 8,
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={title}
                  />
                ) : (
                  <>
                    {webViewLoading && (
                      <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#007A87" />
                        <Text style={styles.loadingText}>Loading YouTube Video...</Text>
                      </View>
                    )}
                    <WebView
                      style={styles.webView}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      allowsFullscreenVideo={true}
                      mediaPlaybackRequiresUserAction={false}
                      onLoadEnd={() => setWebViewLoading(false)}
                      source={{
                        uri: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`,
                      }}
                    />
                  </>
                )}
              </View>
            ) : (
              // Standard Video Display Simulator
              <View style={styles.videoStage}>
                <TouchableOpacity onPress={togglePlay} style={styles.centerPlayBtn} activeOpacity={0.8}>
                  {isPlaying ? <Pause size={32} color="#FFFFFF" /> : <Play size={32} color="#FFFFFF" />}
                </TouchableOpacity>

                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>HD 1080p</Text>
                </View>

                {/* Timeline & Controls */}
                <View style={styles.controlsBar}>
                  <View style={styles.timelineBackground}>
                    <View style={[styles.timelineProgress, { width: `${progress}%` }]} />
                  </View>

                  <View style={styles.controlsRow}>
                    <View style={styles.controlsLeft}>
                      <TouchableOpacity onPress={togglePlay} style={styles.controlIconBtn}>
                        {isPlaying ? <Pause size={18} color="#FFFFFF" /> : <Play size={18} color="#FFFFFF" />}
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setProgress(0)} style={styles.controlIconBtn}>
                        <RotateCcw size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                      <Text style={styles.timeText}>01:24 / 03:45</Text>
                    </View>
                    <View style={styles.controlsRight}>
                      <Volume2 size={18} color="#9CA3AF" />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Footer Action */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleOpenExternal} style={styles.externalBtn} activeOpacity={0.7}>
              {isYouTube ? (
                <>
                  <YouTubeIcon size={16} color="#EF4444" style={{ marginRight: 6 }} />
                  <Text style={styles.externalText}>Watch on YouTube</Text>
                </>
              ) : (
                <>
                  <ExternalLink size={15} color="#9CA3AF" style={{ marginRight: 6 }} />
                  <Text style={styles.externalText}>Open Video in Browser</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111827',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerTextCol: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webViewWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'Inter_500Medium',
  },
  videoStage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  centerPlayBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 122, 135, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  liveIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  controlsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
  },
  timelineBackground: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 8,
  },
  timelineProgress: {
    height: '100%',
    backgroundColor: '#007A87',
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlIconBtn: {
    marginRight: 10,
  },
  timeText: {
    color: '#D1D5DB',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  controlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    padding: 12,
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    alignItems: 'center',
  },
  externalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  externalText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
