import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { X, Check, User, UserPlus, LogOut } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { useAuth } from '../../hooks/useAuth';

interface AccountSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  visible,
  onClose,
}) => {
  const { user, quickSwitch } = useAuth();

  const handleSelect = async (accountType: 'rohan' | 'priya' | 'guest') => {
    await quickSwitch(accountType);
    onClose();
  };

  const isRohan = user?.email === 'rohan@example.com';
  const isPriya = user?.email === 'priya@example.com';
  const isGuest = !user;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Evaluator / Demo User Switcher</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Select a persona to test dynamic competition and user states live:
          </Text>

          {/* Account Option 1: Rohan */}
          <TouchableOpacity
            style={[styles.accountOption, isRohan && styles.activeOption]}
            onPress={() => handleSelect('rohan')}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <User size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Rohan Sharma (Registered)</Text>
              <Text style={styles.accountDesc}>
                Matches Objective_Page.png — shows "Upload Submission" & "Registered" badge
              </Text>
            </View>
            {isRohan && <Check size={18} color={theme.colors.accentGreen} strokeWidth={2.5} />}
          </TouchableOpacity>

          {/* Account Option 2: Priya */}
          <TouchableOpacity
            style={[styles.accountOption, isPriya && styles.activeOption]}
            onPress={() => handleSelect('priya')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <UserPlus size={18} color="#D97706" />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Priya Patel (Unregistered)</Text>
              <Text style={styles.accountDesc}>
                Ready to register — click "Pay ₹99 & Register" to test atomic spot decrement
              </Text>
            </View>
            {isPriya && <Check size={18} color={theme.colors.accentGreen} strokeWidth={2.5} />}
          </TouchableOpacity>

          {/* Account Option 3: Guest */}
          <TouchableOpacity
            style={[styles.accountOption, isGuest && styles.activeOption]}
            onPress={() => handleSelect('guest')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#F3F4F6' }]}>
              <LogOut size={18} color="#6B7280" />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Guest (Unauthenticated)</Text>
              <Text style={styles.accountDesc}>
                View public details and test guest experience
              </Text>
            </View>
            {isGuest && <Check size={18} color={theme.colors.accentGreen} strokeWidth={2.5} />}
          </TouchableOpacity>
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
    maxWidth: 390,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.floating,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: theme.spacing.sm,
    backgroundColor: '#FAFAFA',
  },
  activeOption: {
    borderColor: theme.colors.accentCyan,
    backgroundColor: '#F0FDF4',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  accountInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  accountName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  accountDesc: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 15,
  },
});

