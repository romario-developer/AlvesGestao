import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../lib/api';

type VehicleCreateModalProps = {
  open: boolean;
  clientId: string;
  clientName?: string;
  onSuccess?: () => void;
  onClose: () => void;
};

type VehiclePayload = {
  clientId: string;
  placa: string;
  tipo: string;
  marca: string;
  modelo: string;
  ano?: number;
  cor?: string;
};

export function VehicleCreateModal({ open, clientId, clientName, onSuccess, onClose }: VehicleCreateModalProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VehiclePayload>({
    defaultValues: {
      clientId: clientId ?? '',
      placa: '',
      tipo: '',
      marca: '',
      modelo: '',
    },
  });
  const watchedClientId = watch('clientId');

  useEffect(() => {
    setValue('clientId', clientId ?? '');
  }, [clientId, setValue]);

  const submit = handleSubmit(async (values) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      if (!values.clientId) {
        setErrorMessage('Selecione um cliente antes de salvar o veículo.');
        setLoading(false);
        return;
      }
      await api.post('/vehicles', {
        ...values,
        ano: values.ano ? Number(values.ano) : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      reset({
        clientId: clientId ?? '',
        placa: '',
        tipo: '',
        marca: '',
        modelo: '',
        ano: undefined,
        cor: '',
      });
      onSuccess?.();
    } catch (error: any) {
      console.error('vehicle create error', error?.response?.data ?? error);
      const apiMessage = error?.response?.data?.message;
      setErrorMessage(
        Array.isArray(apiMessage)
          ? apiMessage.join('. ')
          : apiMessage ?? 'Erro ao salvar veículo.',
      );
    } finally {
      setLoading(false);
    }
  });

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Novo veículo</p>
            <h3 className="text-lg font-semibold text-white">
              Para: {clientName ?? 'Cliente selecionado'}
            </h3>
          </div>
          <button
            className="text-slate-400 hover:text-white text-sm"
            onClick={() => {
              setErrorMessage(null);
              reset({
                clientId: clientId ?? '',
                placa: '',
                tipo: '',
                marca: '',
                modelo: '',
                ano: undefined,
                cor: '',
              });
              onClose();
            }}
          >
            Fechar
          </button>
        </header>
        <form className="space-y-3" onSubmit={submit}>
          <input type="hidden" {...register('clientId', { required: true })} />
          <input className="input" placeholder="Placa" {...register('placa', { required: true })} />
          <input className="input" placeholder="Tipo (carro/moto)" {...register('tipo', { required: true })} />
          <input className="input" placeholder="Marca" {...register('marca', { required: true })} />
          <input className="input" placeholder="Modelo" {...register('modelo', { required: true })} />
          <input className="input" placeholder="Ano" type="number" {...register('ano')} />
          <input className="input" placeholder="Cor" {...register('cor')} />
          {errors.clientId && (
            <p className="text-sm text-red-400">Selecione um cliente antes de salvar o veículo.</p>
          )}
          {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
          <div className="flex justify-end">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || !watchedClientId}
            >
              {loading ? 'Salvando...' : 'Salvar veículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
