import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { X, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { Button } from '../ui/Button';
import { ICompetitionDetail } from '../../types/competition';

interface RegistrationModalProps {
  visible: boolean;
  competition: ICompetitionDetail;
  onClose: () => void;
  onRegister: () => Promise<void>;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  visible,
  competition,
  onClose,
  onRegister,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleConfirmPay = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await onRegister();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Registration</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {success ? (
            <View style={styles.successState}>
              <CheckCircle2 size={52} color={theme.colors.accentGreen} />
              <Text style={styles.successTitle}>Registration Confirmed!</Text>
              <Text style={styles.successDesc}>
                You are now registered for {competition.title}. You can now submit your entry.
              </Text>
            </View>
          ) : (
            <View style={styles.body}>
              <Text style={styles.compName}>{competition.title}</Text>

              {/* Fee Breakdown Box */}
              <View style={styles.breakdownBox}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.rowLabel}>Entry Fee</Text>
                  <Text style={styles.rowValue}>
                    {competition.currency} {competition.entryFee}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.rowLabel}>GST & Processing</Text>
                  <Text style={styles.rowValueFree}>₹ 0 (Free)</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.breakdownRow}>
                  <Text style={styles.totalLabel}>Total Payable</Text>
                  <Text style={styles.totalValue}>
                    {competition.currency} {competition.entryFee}
                  </Text>
                </View>
              </View>

              {/* Trust Badge */}
              <View style={styles.trustBadge}>
                <ShieldCheck size={16} color={theme.colors.primary} />
                <Text style={styles.trustText}>100% Secure Checkout powered by Razorpay</Text>
              </View>

              {/* Error Message */}
              {errorMsg && (
                <View style={styles.errorBox}>
                  <AlertCircle size={16} color="#DC2626" />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              {/* Action Button */}
              <Button
                label={`Pay ${competition.currency}${competition.entryFee} & Confirm`}
                onPress={handleConfirmPay}
                loading={loading}
                variant="darkTeal"
                style={styles.payButton}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.floating,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  body: {
    marginTop: theme.spacing.xs,
  },
  compName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.accentCyan,
    marginBottom: theme.spacing.md,
  },
  breakdownBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: theme.spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  rowLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  rowValueFree: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: theme.spacing.xs + 2,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  trustText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: theme.radii.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginLeft: 6,
    flex: 1,
  },
  payButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 13,
    borderRadius: theme.radii.md,
  },
  successState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: 6,
  },
  successDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

