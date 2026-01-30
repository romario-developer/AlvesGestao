import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
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
  const { register, handleSubmit, reset } = useForm<VehiclePayload>({
    defaultValues: {
      clientId,
      placa: '',
      tipo: '',
      marca: '',
      modelo: '',
    },
  });

  const submit = handleSubmit(async (values) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await api.post('/vehicles', {
        clientId,
        ...values,
        ano: values.ano ? Number(values.ano) : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      reset({
        clientId,
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
              onClose();
            }}
          >
            Fechar
          </button>
        </header>
        <form className="space-y-3" onSubmit={submit}>
          <input className="input" placeholder="Placa" {...register('placa', { required: true })} />
          <input className="input" placeholder="Tipo (carro/moto)" {...register('tipo', { required: true })} />
          <input className="input" placeholder="Marca" {...register('marca', { required: true })} />
          <input className="input" placeholder="Modelo" {...register('modelo', { required: true })} />
          <input className="input" placeholder="Ano" type="number" {...register('ano')} />
          <input className="input" placeholder="Cor" {...register('cor')} />
          {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
          <div className="flex justify-end">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar veículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
