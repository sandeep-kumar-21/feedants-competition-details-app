import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { X, Upload, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { Button } from '../ui/Button';
import { ICompetitionDetail } from '../../types/competition';

interface SubmissionModalProps {
  visible: boolean;
  competition: ICompetitionDetail;
  onClose: () => void;
  onSubmit: (data: { submissionUrl: string; notes?: string }) => Promise<void>;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  visible,
  competition,
  onClose,
  onSubmit,
}) => {
  const viewer = competition.viewerStatus;
  const existingSubmission = viewer.submissionDetails;

  const [url, setUrl] = useState<string>(existingSubmission?.submissionUrl || '');
  const [notes, setNotes] = useState<string>(existingSubmission?.notes || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!url.trim()) {
      setErrorMsg('Please enter a valid video link (YouTube, Drive, Vimeo, etc.)');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await onSubmit({ submissionUrl: url.trim(), notes: notes.trim() });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload submission.');
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
            <Text style={styles.title}>
              {viewer.hasSubmitted ? 'Your Submission' : 'Upload Dance Entry'}
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {success ? (
            <View style={styles.successState}>
              <CheckCircle2 size={52} color={theme.colors.accentGreen} />
              <Text style={styles.successTitle}>Entry Submitted!</Text>
              <Text style={styles.successDesc}>
                Your performance video has been uploaded for evaluation by Judge {competition.judge.name}.
              </Text>
            </View>
          ) : (
            <View style={styles.body}>
              <Text style={styles.instruction}>
                Provide a high-quality video link (YouTube Unlisted, Google Drive, or Vimeo):
              </Text>

              <Text style={styles.fieldLabel}>Video Link URL *</Text>
              <TextInput
                style={styles.input}
                placeholder="https://youtu.be/... or Google Drive link"
                placeholderTextColor="#9CA3AF"
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                keyboardType="url"
              />

              <Text style={styles.fieldLabel}>Notes for Judge (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Raga / Taal details, choreography notes, or credits..."
                placeholderTextColor="#9CA3AF"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />

              {errorMsg && (
                <View style={styles.errorBox}>
                  <AlertCircle size={16} color="#DC2626" />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              <Button
                label={viewer.hasSubmitted ? 'Update Submission' : 'Submit Performance'}
                icon={<Upload size={16} color="#FFFFFF" />}
                onPress={handleSubmit}
                loading={loading}
                variant="darkTeal"
                style={styles.submitBtn}
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
  instruction: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 17,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 9,
    fontSize: 13,
    color: theme.colors.textPrimary,
    backgroundColor: '#F9FAFB',
    marginBottom: theme.spacing.md,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
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
  submitBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
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

