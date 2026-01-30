import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function useClients(search = '') {
  return useQuery({
    queryKey: ['clients', search],
    queryFn: async () => {
      const res = await api.get('/clients', { params: { search } });
      return res.data as any[];
    },
  });
}
