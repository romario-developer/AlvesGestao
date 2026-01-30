import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function useWorkOrders(status?: string) {
  return useQuery({
    queryKey: ['work-orders', status],
    queryFn: async () => {
      const res = await api.get('/work-orders', { params: { status } });
      return res.data as any[];
    },
  });
}
