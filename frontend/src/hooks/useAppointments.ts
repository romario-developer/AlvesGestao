import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function useAppointments(dateStart?: string, dateEnd?: string) {
  return useQuery({
    queryKey: ['appointments', dateStart, dateEnd],
    queryFn: async () => {
      const res = await api.get('/appointments', { params: { dateStart, dateEnd } });
      return res.data as any[];
    },
  });
}
