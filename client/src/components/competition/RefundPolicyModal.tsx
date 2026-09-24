import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { X, ShieldCheck, Check, Clock, RefreshCw } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { Button } from '../ui/Button';

interface RefundPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <ShieldCheck size={22} color={theme.colors.primary} />
              <Text style={styles.title}>Feedants Refund Policy</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.badgeBox}>
              <Text style={styles.badgeTitle}>100% Money-Back Guarantee</Text>
              <Text style={styles.badgeDesc}>
                Feedants protects participant contributions with transparent, automated refund protocols.
              </Text>
            </View>

            <View style={styles.pointRow}>
              <View style={styles.iconCircle}>
                <RefreshCw size={16} color={theme.colors.accentCyan} />
              </View>
              <View style={styles.pointTextCol}>
                <Text style={styles.pointTitle}>Competition Cancellation</Text>
                <Text style={styles.pointDesc}>
                  If the competition is canceled or rescheduled by Feedants, 100% of the entry fee is automatically refunded.
                </Text>
              </View>
            </View>

            <View style={styles.pointRow}>
              <View style={styles.iconCircle}>
                <Clock size={16} color={theme.colors.accentCyan} />
              </View>
              <View style={styles.pointTextCol}>
                <Text style={styles.pointTitle}>Cancellation by Participant</Text>
                <Text style={styles.pointDesc}>
                  Full refund is granted if cancellation is requested at least 24 hours before registration closes.
                </Text>
              </View>
            </View>

            <View style={styles.pointRow}>
              <View style={styles.iconCircle}>
                <Check size={16} color={theme.colors.accentCyan} />
              </View>
              <View style={styles.pointTextCol}>
                <Text style={styles.pointTitle}>Automated Razorpay Reversal</Text>
                <Text style={styles.pointDesc}>
                  Refunds are credited directly to your original payment source (UPI, Debit Card, NetBanking) within 5–7 business days.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              label="Understand & Close"
              onPress={onClose}
              variant="darkTeal"
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginLeft: 8,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  badgeBox: {
    backgroundColor: '#EAF8F4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C6EFE4',
  },
  badgeTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#005B64',
    marginBottom: 4,
  },
  badgeDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#00454D',
    lineHeight: 18,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  pointTextCol: {
    flex: 1,
  },
  pointTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  pointDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    lineHeight: 17,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
