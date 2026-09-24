import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { ICompetitionDetail } from '../types/competition';
import { useAuth } from './useAuth';

export function useCompetition(competitionId?: string) {
  const { user } = useAuth();

  return useQuery<ICompetitionDetail, Error>({
    queryKey: ['competition', competitionId || 'active', user?.userId || 'guest'],
    queryFn: async () => {
      const endpoint = competitionId ? `/competitions/${competitionId}` : '/competitions/active';
      const response = await apiClient.get(endpoint);
      return response.data.data;
    },
    staleTime: 15 * 1000, // 15 seconds
    refetchInterval: 30 * 1000, // Background poll every 30s to keep spots up to date
  });
}

export function useRegisterMutation(competitionId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/competitions/${competitionId}/register`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competition'] });
    },
  });
}

export function useSubmissionMutation(competitionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { submissionUrl: string; notes?: string }) => {
      const response = await apiClient.post(`/competitions/${competitionId}/submission`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competition'] });
    },
  });
}

