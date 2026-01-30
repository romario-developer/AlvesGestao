import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function useServices(search = '') {
  return useQuery({
    queryKey: ['services', search],
    queryFn: async () => {
      const res = await api.get('/services', { params: { search } });
      return res.data as any[];
    },
  });
}
