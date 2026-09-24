import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { X, Award, AlertCircle } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { Button } from '../ui/Button';

interface PrizePayoutModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PrizePayoutModal: React.FC<PrizePayoutModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Award size={22} color={theme.colors.accentCyan} />
              <Text style={styles.title}>Prize Money Disbursement</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Direct & Automated Payouts</Text>
              <Text style={styles.infoDesc}>
                Feedants distributes prize pool money directly to verified winners within 24 hours of final leaderboard announcement.
              </Text>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNum}>1</Text>
              </View>
              <View style={styles.stepTextCol}>
                <Text style={styles.stepTitle}>Result Verification & Notification</Text>
                <Text style={styles.stepDesc}>
                  Winners receive an official notification via SMS, Email, and Feedants In-App notification on Result Day.
                </Text>
              </View>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNum}>2</Text>
              </View>
              <View style={styles.stepTextCol}>
                <Text style={styles.stepTitle}>Payout Method Selection</Text>
                <Text style={styles.stepDesc}>
                  Provide your preferred payout channel: UPI ID (instant transfer) or Direct Bank Account (IMPS/NEFT).
                </Text>
              </View>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNum}>3</Text>
              </View>
              <View style={styles.stepTextCol}>
                <Text style={styles.stepTitle}>Certificate & Trophy Dispatch</Text>
                <Text style={styles.stepDesc}>
                  Digital certificates are generated immediately. Physical trophies are shipped within 7 working days.
                </Text>
              </View>
            </View>

            <View style={styles.taxNote}>
              <AlertCircle size={14} color="#6B7280" />
              <Text style={styles.taxNoteText}>
                All prize winnings adhere to applicable Indian tax regulations.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              label="Understood"
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
  infoBox: {
    backgroundColor: '#EBF7F7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CDEAEA',
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#007A87',
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#004D54',
    lineHeight: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#005B64',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNum: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    lineHeight: 17,
  },
  taxNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  taxNoteText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
