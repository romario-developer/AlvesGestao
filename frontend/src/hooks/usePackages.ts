import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function usePackages() {
  return useQuery({
    queryKey: ['service-packages'],
    queryFn: async () => {
      const res = await api.get('/service-packages');
      return res.data as any[];
    },
  });
}
