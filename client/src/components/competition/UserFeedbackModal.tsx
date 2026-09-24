import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, Star, MessageSquare, Send } from 'lucide-react-native';
import { theme } from '../../theme/theme';
import { Button } from '../ui/Button';

interface Review {
  id: string;
  name: string;
  avatarBg: string;
  initials: string;
  rating: number;
  timeAgo: string;
  comment: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Ananya Deshmukh',
    avatarBg: '#E0F2FE',
    initials: 'AD',
    rating: 5,
    timeAgo: '2 days ago',
    comment:
      'The feedback from Guru Manju Dubey was incredibly insightful! The judging parameters were transparent, and my prize certificate was dispatched seamlessly.',
  },
  {
    id: '2',
    name: 'Kavita Menon',
    avatarBg: '#FEF3C7',
    initials: 'KM',
    rating: 5,
    timeAgo: '1 week ago',
    comment:
      'Seamless upload process and genuine appreciation for Indian classical art. The ₹1,500 prize pool payout reached my UPI account within 12 hours!',
  },
  {
    id: '3',
    name: 'Suresh Iyer',
    avatarBg: '#DCFCE7',
    initials: 'SI',
    rating: 4,
    timeAgo: '2 weeks ago',
    comment:
      'Great platform for emerging artists to showcase their talent without geographic barriers. Highly recommend to all classical dancers.',
  },
];

interface UserFeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export const UserFeedbackModal: React.FC<UserFeedbackModalProps> = ({ visible, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<boolean>(false);

  const handlePostReview = () => {
    if (!userComment.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        name: 'You (Participant)',
        avatarBg: '#EAF8F4',
        initials: 'ME',
        rating: userRating,
        timeAgo: 'Just now',
        comment: userComment.trim(),
      };
      setReviews([newReview, ...reviews]);
      setUserComment('');
      setIsSubmitting(false);
      setSubmittedFeedback(true);
    }, 600);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <MessageSquare size={20} color={theme.colors.accentCyan} />
              <Text style={styles.title}>Participant Reviews & Ratings</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.scorecard}>
              <View style={styles.scoreLeft}>
                <Text style={styles.scoreBig}>4.9</Text>
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </View>
                <Text style={styles.reviewCount}>1,240+ Verified Reviews</Text>
              </View>
              <View style={styles.scoreRight}>
                <View style={styles.barRow}>
                  <Text style={styles.barLabel}>5★</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: '88%' }]} />
                  </View>
                </View>
                <View style={styles.barRow}>
                  <Text style={styles.barLabel}>4★</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: '10%' }]} />
                  </View>
                </View>
                <View style={styles.barRow}>
                  <Text style={styles.barLabel}>3★</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: '2%' }]} />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.writeBox}>
              <Text style={styles.writeTitle}>Share Your Experience</Text>
              <View style={styles.starSelectorRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setUserRating(star)}
                    style={styles.starTouch}
                  >
                    <Star
                      size={24}
                      color="#F59E0B"
                      fill={star <= userRating ? '#F59E0B' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.commentInput}
                placeholder="Write your honest review about this competition..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={userComment}
                onChangeText={setUserComment}
              />

              <TouchableOpacity
                onPress={handlePostReview}
                disabled={isSubmitting || !userComment.trim()}
                style={[
                  styles.submitReviewBtn,
                  (!userComment.trim() || isSubmitting) && styles.submitReviewBtnDisabled,
                ]}
              >
                <Send size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.submitReviewText}>
                  {isSubmitting ? 'Posting Review...' : 'Post Review'}
                </Text>
              </TouchableOpacity>

              {submittedFeedback && (
                <Text style={styles.feedbackSuccessText}>
                  Thank you! Your verified review has been posted.
                </Text>
              )}
            </View>

            <Text style={styles.listHeading}>Recent Participant Reviews</Text>
            {reviews.map((rev) => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={[styles.avatarCircle, { backgroundColor: rev.avatarBg }]}>
                    <Text style={styles.avatarText}>{rev.initials}</Text>
                  </View>
                  <View style={styles.reviewUserCol}>
                    <Text style={styles.reviewUserName}>{rev.name}</Text>
                    <View style={styles.reviewMetaRow}>
                      <View style={styles.starSmallRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            color="#F59E0B"
                            fill={s <= rev.rating ? '#F59E0B' : 'transparent'}
                          />
                        ))}
                      </View>
                      <Text style={styles.timeAgoText}>{rev.timeAgo}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Button
              label="Close Reviews"
              onPress={onClose}
              variant="outline"
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
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
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
  scorecard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scoreLeft: {
    alignItems: 'center',
    marginRight: 20,
  },
  scoreBig: {
    fontSize: 32,
    fontFamily: 'Inter_800ExtraBold',
    color: '#111827',
  },
  starRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  reviewCount: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
  },
  scoreRight: {
    flex: 1,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  barLabel: {
    width: 22,
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#4B5563',
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  writeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  writeTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 8,
  },
  starSelectorRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  starTouch: {
    paddingRight: 6,
  },
  commentInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlignVertical: 'top',
    minHeight: 65,
    marginBottom: 10,
  },
  submitReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005B64',
    paddingVertical: 9,
    borderRadius: 8,
  },
  submitReviewBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitReviewText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  feedbackSuccessText: {
    color: '#10B981',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  listHeading: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#1F2937',
  },
  reviewUserCol: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  reviewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  starSmallRow: {
    flexDirection: 'row',
    marginRight: 6,
  },
  timeAgoText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#9CA3AF',
  },
  reviewComment: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
