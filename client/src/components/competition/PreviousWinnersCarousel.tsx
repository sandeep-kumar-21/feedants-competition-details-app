import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Play } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { IPreviousWinner } from '../../types/competition';

interface PreviousWinnersCarouselProps {
  winners: IPreviousWinner[];
  onPressWinner?: (winner: IPreviousWinner) => void;
}

export const PreviousWinnersCarousel: React.FC<PreviousWinnersCarouselProps> = ({
  winners,
  onPressWinner,
}) => {
  const { t } = useLanguage();

  if (!winners || winners.length === 0) return null;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{t('previousWinners')}</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={winners}
        keyExtractor={(item, index) => item._id || `${item.name}-${index}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.winnerCard}
            onPress={() => onPressWinner && onPressWinner(item)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.position}`}
          >
            {/* Square thumbnail with play overlay */}
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
              <View style={styles.playOverlay}>
                <Play size={12} color={theme.colors.accentCyan} fill={theme.colors.accentCyan} style={styles.playIcon} />
              </View>
            </View>

            {/* Winner details to the right of thumbnail */}
            <View style={styles.details}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.position} numberOfLines={1}>
                {item.position}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.md + 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    paddingRight: theme.spacing.md,
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: '#EBF1F4',
    padding: theme.spacing.xs + 2,
    marginRight: theme.spacing.md,
    width: 175,
  },
  thumbnailContainer: {
    position: 'relative',
    width: 58,
    height: 58,
    borderRadius: theme.radii.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  playOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.accentCyan,
  },
  playIcon: {
    marginLeft: 1,
  },
  details: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    justifyContent: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  position: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.accentCyan,
  },
});

