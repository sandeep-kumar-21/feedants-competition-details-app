import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Send, Upload, Trophy } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { ICompetitionDates } from '../../types/competition';

interface ImportantDatesCardProps {
  dates: ICompetitionDates;
}

export const ImportantDatesCard: React.FC<ImportantDatesCardProps> = ({ dates }) => {
  const { t } = useLanguage();

  const formatDateParts = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear().toString().slice(-2);
      const dateStr = `${day} ${month} ${year}`;

      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hoursStr = hours.toString().padStart(2, '0');
      const timeStr = `${hoursStr}:${minutes} ${ampm}`;

      return { dateStr, timeStr };
    } catch {
      return { dateStr: '10 Aug 26', timeStr: '11:50 PM' };
    }
  };

  const regBefore = formatDateParts(dates.registrationClosesAt);
  const subStart = formatDateParts(dates.submissionStartsAt);
  const subEnd = formatDateParts(dates.submissionEndsAt);
  const result = formatDateParts(dates.resultDate);

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{t('importantDates')}</Text>

      <View style={styles.gridContainer}>
        {/* Top Row */}
        <View style={styles.row}>
          {/* Register Before */}
          <View style={[styles.cell, styles.rightBorder]}>
            <View style={styles.cellHeader}>
              <Calendar size={18} color={theme.colors.accentCyan} strokeWidth={2} />
              <View style={styles.cellHeaderText}>
                <Text style={styles.label}>{t('registerBefore')}</Text>
                <Text style={styles.dateText}>{regBefore.dateStr}</Text>
                <Text style={styles.timeText}>{regBefore.timeStr}</Text>
              </View>
            </View>
          </View>

          {/* Submission Starts */}
          <View style={styles.cell}>
            <View style={styles.cellHeader}>
              <Send size={18} color={theme.colors.accentCyan} strokeWidth={2} />
              <View style={styles.cellHeaderText}>
                <Text style={styles.label}>{t('submissionStarts')}</Text>
                <Text style={styles.dateText}>{subStart.dateStr}</Text>
                <Text style={styles.timeText}>{subStart.timeStr}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Horizontal Divider */}
        <View style={styles.horizontalDivider} />

        {/* Bottom Row */}
        <View style={styles.row}>
          {/* Submission Ends */}
          <View style={[styles.cell, styles.rightBorder]}>
            <View style={styles.cellHeader}>
              <Upload size={18} color={theme.colors.accentCyan} strokeWidth={2} />
              <View style={styles.cellHeaderText}>
                <Text style={styles.label}>{t('submissionEnds')}</Text>
                <Text style={styles.dateText}>{subEnd.dateStr}</Text>
                <Text style={styles.timeText}>{subEnd.timeStr}</Text>
              </View>
            </View>
          </View>

          {/* Result Date */}
          <View style={styles.cell}>
            <View style={styles.cellHeader}>
              <Trophy size={18} color={theme.colors.accentCyan} strokeWidth={2} />
              <View style={styles.cellHeaderText}>
                <Text style={styles.label}>{t('resultDate')}</Text>
                <Text style={styles.dateText}>{result.dateStr}</Text>
                <Text style={styles.timeText}>{result.timeStr}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
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
  gridContainer: {
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: '#EBF1F4',
    padding: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.sm,
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: '#EBF1F4',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#EBF1F4',
    marginHorizontal: theme.spacing.xs,
  },
  cellHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cellHeaderText: {
    marginLeft: theme.spacing.sm,
  },
  label: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 1,
  },
});

