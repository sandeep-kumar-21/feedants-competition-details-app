import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Home, Search, Plus, Trophy } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { useAuth } from '../../hooks/useAuth';

interface BottomNavBarProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab = 'competitions',
  onTabPress,
}) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress && onTabPress('home')}
        activeOpacity={0.7}
      >
        <Home size={22} color={activeTab === 'home' ? theme.colors.accentCyan : '#9CA3AF'} strokeWidth={1.8} />
        <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Explore */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress && onTabPress('explore')}
        activeOpacity={0.7}
      >
        <Search size={22} color={activeTab === 'explore' ? theme.colors.accentCyan : '#9CA3AF'} strokeWidth={1.8} />
        <Text style={[styles.tabLabel, activeTab === 'explore' && styles.activeTabLabel]}>
          Explore
        </Text>
      </TouchableOpacity>

      {/* Center Floating Plus Button */}
      <TouchableOpacity
        style={styles.centerButtonContainer}
        onPress={() => onTabPress && onTabPress('create')}
        activeOpacity={0.8}
      >
        <View style={styles.plusCircle}>
          <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      </TouchableOpacity>

      {/* Competitions (Active) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress && onTabPress('competitions')}
        activeOpacity={0.7}
      >
        <Trophy size={22} color={activeTab === 'competitions' ? theme.colors.accentCyan : '#9CA3AF'} strokeWidth={2} />
        <Text style={[styles.tabLabel, activeTab === 'competitions' && styles.activeTabLabel]}>
          Competitions
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress && onTabPress('profile')}
        activeOpacity={0.7}
      >
        {user?.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.profileAvatar} />
        ) : (
          <View style={styles.fallbackAvatar}>
            <Text style={styles.fallbackText}>{user ? user.name[0] : 'U'}</Text>
          </View>
        )}
        <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 3,
  },
  activeTabLabel: {
    color: theme.colors.accentCyan,
    fontWeight: '700',
  },
  centerButtonContainer: {
    top: -4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#005B64',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  profileAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  fallbackAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
});

