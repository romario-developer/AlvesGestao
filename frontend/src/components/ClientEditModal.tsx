import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../lib/api';
import { Modal } from './Modal';

type Client = {
  id: string;
  nomeCompleto: string;
  whatsapp?: string;
  email?: string;
  tags?: string[];
};

type ClientEditModalProps = {
  open: boolean;
  client: Client | null;
  onClose: () => void;
  onSuccess?: () => void;
};

type ClientForm = {
  nomeCompleto: string;
  whatsapp?: string;
  email?: string;
  tags?: string;
};

export function ClientEditModal({ open, client, onClose }: ClientEditModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<ClientForm>({
    defaultValues: {
      nomeCompleto: client?.nomeCompleto ?? '',
      whatsapp: client?.whatsapp ?? '',
      email: client?.email ?? '',
      tags: client?.tags?.join(', ') ?? '',
    },
  });

  React.useEffect(() => {
    reset({
      nomeCompleto: client?.nomeCompleto ?? '',
      whatsapp: client?.whatsapp ?? '',
      email: client?.email ?? '',
      tags: client?.tags?.join(', ') ?? '',
    });
  }, [client, reset]);

  const mutation = useMutation(
    (payload: ClientForm) => api.patch(`/clients/${client?.id}`, {
      nomeCompleto: payload.nomeCompleto,
      whatsapp: payload.whatsapp,
      email: payload.email,
      tags: payload.tags ? payload.tags.split(',').map((t) => t.trim()) : [],
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        onClose();
        onSuccess?.();
      },
    },
  );

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <Modal open={open} title="Editar cliente" onClose={() => mutation.reset() || onClose()}>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="input" placeholder="Nome completo" {...register('nomeCompleto', { required: true })} />
        <input className="input" placeholder="WhatsApp" {...register('whatsapp')} />
        <input className="input" placeholder="Email" {...register('email')} />
        <input className="input" placeholder="Tags separadas por vírgula" {...register('tags')} />
        {mutation.isError && (
          <p className="text-sm text-red-400">{(mutation.error as any)?.response?.data?.message ?? 'Erro ao atualizar.'}</p>
        )}
        <div className="flex justify-end">
          <button className="btn btn-primary" type="submit" disabled={mutation.isLoading || !client}>
            {mutation.isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
