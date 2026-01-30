import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function useVehicles(search = '') {
  return useQuery({
    queryKey: ['vehicles', search],
    queryFn: async () => {
      const res = await api.get('/vehicles', { params: { search } });
      return res.data as any[];
    },
  });
}
