import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../ui/Button';
import { theme } from '../../theme/theme';
import { useLanguage } from '../../hooks/useLanguage';
import { ICompetitionDetail } from '../../types/competition';

interface BottomActionBarProps {
  competition: ICompetitionDetail;
  onPressAction: () => void;
  loading?: boolean;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  competition,
  onPressAction,
  loading = false,
}) => {
  const { t } = useLanguage();
  const viewer = competition.viewerStatus;
  const isSoldOut = competition.isSoldOut;
  const lifecycle = competition.lifecycle;

  // Determine button state and copy dynamically
  let buttonLabel = t('uploadSubmission');
  let subLabel: string | undefined = t('registeredBadge');
  let isDisabled = false;
  let variant: 'darkTeal' | 'primary' = 'darkTeal';

  if (!viewer.isRegistered) {
    if (isSoldOut) {
      buttonLabel = t('competitionFull');
      subLabel = undefined;
      isDisabled = true;
    } else if (!lifecycle.isRegistrationOpen && lifecycle.phase === 'REGISTRATION_CLOSED') {
      buttonLabel = t('registrationClosed');
      subLabel = undefined;
      isDisabled = true;
    } else {
      buttonLabel = t('payAndRegister', { fee: `${competition.currency}${competition.entryFee}` });
      subLabel = undefined;
      variant = 'darkTeal';
    }
  } else {
    // User is registered
    if (viewer.hasSubmitted) {
      buttonLabel = t('viewSubmission');
      subLabel = 'Submitted';
    } else {
      buttonLabel = t('uploadSubmission');
      subLabel = t('registeredBadge');
    }
  }

  return (
    <View style={styles.container}>
      <Button
        label={buttonLabel}
        subLabel={subLabel}
        onPress={onPressAction}
        disabled={isDisabled}
        loading={loading}
        variant={variant}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    backgroundColor: '#005B64',
    paddingVertical: 12,
    borderRadius: theme.radii.sm,
  },
});

