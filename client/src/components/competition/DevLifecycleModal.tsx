import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { X, Sparkles, RefreshCw, CheckCircle, Clock, Users, Trophy } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';

interface DevLifecycleModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DevLifecycleModal: React.FC<DevLifecycleModalProps> = ({ visible, onClose }) => {
  const queryClient = useQueryClient();
  const [loadingPhase, setLoadingPhase] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSelectPhase = async (phase: string) => {
    setLoadingPhase(phase);
    setStatusMessage(null);
    try {
      await apiClient.post('/dev/lifecycle', { phase });
      await queryClient.invalidateQueries({ queryKey: ['competition'] });
      setStatusMessage(`Switched to ${phase}`);
      setTimeout(() => {
        setLoadingPhase(null);
        onClose();
      }, 700);
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message || 'Failed to switch'}`);
      setLoadingPhase(null);
    }
  };

  const handleReseed = async () => {
    setLoadingPhase('RESEED');
    setStatusMessage(null);
    try {
      await apiClient.post('/dev/reseed');
      await queryClient.invalidateQueries({ queryKey: ['competition'] });
      setStatusMessage('Reseeded with exact Objective_Page.png data!');
      setTimeout(() => {
        setLoadingPhase(null);
        onClose();
      }, 700);
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message || 'Failed to reseed'}`);
      setLoadingPhase(null);
    }
  };

  const PHASES = [
    {
      id: 'REGISTRATION_OPEN',
      label: 'Registration Open',
      sub: '19 spots left, 01d:06h:28m active countdown',
      icon: Clock,
      color: '#007A87',
    },
    {
      id: 'SOLD_OUT',
      label: 'Spots Full (Sold Out)',
      sub: '20/20 booked, registration closed banner',
      icon: Users,
      color: '#DC2626',
    },
    {
      id: 'SUBMISSION_OPEN',
      label: 'Submission Window Open',
      sub: 'Allows registered users to upload performance',
      icon: CheckCircle,
      color: '#059669',
    },
    {
      id: 'JUDGING',
      label: 'Judging in Progress',
      sub: 'Submissions closed, judge evaluating entries',
      icon: Sparkles,
      color: '#7C3AED',
    },
    {
      id: 'COMPLETED',
      label: 'Competition Completed',
      sub: 'Results announced, winners leaderboard',
      icon: Trophy,
      color: '#F59E0B',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Sparkles size={20} color="#005B64" />
              <Text style={styles.title}>Evaluator State Switcher</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.instruction}>
              Test any lifecycle state and verify dynamic UI transitions live:
            </Text>

            {PHASES.map((p) => {
              const IconComp = p.icon;
              const isSelected = loadingPhase === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.phaseBtn, isSelected && styles.phaseBtnActive]}
                  onPress={() => handleSelectPhase(p.id)}
                  disabled={loadingPhase !== null}
                  activeOpacity={0.7}
                >
                  <View style={[styles.phaseIconCircle, { backgroundColor: `${p.color}15` }]}>
                    <IconComp size={18} color={p.color} />
                  </View>
                  <View style={styles.phaseTextCol}>
                    <Text style={styles.phaseLabel}>{p.label}</Text>
                    <Text style={styles.phaseSub}>{p.sub}</Text>
                  </View>
                  {isSelected && <ActivityIndicator size="small" color="#005B64" />}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.reseedBtn}
              onPress={handleReseed}
              disabled={loadingPhase !== null}
              activeOpacity={0.7}
            >
              <RefreshCw size={16} color="#005B64" style={{ marginRight: 8 }} />
              <Text style={styles.reseedBtnText}>
                {loadingPhase === 'RESEED' ? 'Reseeding...' : 'Reset Database to Default (Objective_Page)'}
              </Text>
            </TouchableOpacity>

            {statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
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
    padding: 16,
  },
  instruction: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  phaseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  phaseBtnActive: {
    borderColor: '#005B64',
    backgroundColor: '#EAF8F4',
  },
  phaseIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  phaseTextCol: {
    flex: 1,
  },
  phaseLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#1F2937',
  },
  phaseSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    marginTop: 1,
  },
  reseedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF8F4',
    borderRadius: 10,
    paddingVertical: 11,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#C6EFE4',
  },
  reseedBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#005B64',
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#059669',
    textAlign: 'center',
    marginTop: 8,
  },
});
