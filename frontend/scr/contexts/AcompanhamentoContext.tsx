import React, { createContext, useContext, useMemo, useState } from 'react';

type Registro = {
  id: string;
  data: string;
  fotoUri?: string;
  dor: number;
  temSecrecao: boolean;
  temOdor: boolean;
  vermelhidao: 'leve' | 'moderada' | 'intensa';
};

type Acompanhamento = {
  id: string;
  titulo: string;
  local: string;
  status: 'ativo' | 'finalizado';
  precisaAtencao: boolean;
  proximoRetorno?: string;
  registros: Registro[];
};

type AcompanhamentoContextData = {
  acompanhamentos: Acompanhamento[];
  totalAtivos: number;
  ultimoRegistro?: Registro;
  totalComAtencao: number;
  proximoRetorno?: string;
};

const AcompanhamentoContext = createContext<AcompanhamentoContextData | undefined>(undefined);

export function AcompanhamentoProvider({ children }: { children: React.ReactNode }) {
  const [acompanhamentos] = useState<Acompanhamento[]>([
    {
      id: '1',
      titulo: 'Ferida no pe esquerdo',
      local: 'Pe esquerdo',
      status: 'ativo',
      precisaAtencao: true,
      proximoRetorno: '2026-07-14',
      registros: [
        {
          id: 'r1',
          data: '2026-06-09',
          dor: 6,
          temSecrecao: false,
          temOdor: false,
          vermelhidao: 'moderada',
        },
      ],
    },
    {
      id: '2',
      titulo: 'Pos-operatorio',
      local: 'Abdomen',
      status: 'ativo',
      precisaAtencao: false,
      proximoRetorno: '2026-07-20',
      registros: [
        {
          id: 'r2',
          data: '2026-06-07',
          dor: 3,
          temSecrecao: false,
          temOdor: false,
          vermelhidao: 'leve',
        },
      ],
    },
  ]);

  const totalAtivos = acompanhamentos.filter((item) => item.status === 'ativo').length;
  const totalComAtencao = acompanhamentos.filter((item) => item.precisaAtencao).length;

  const ultimoRegistro = useMemo(() => {
    const todosRegistros = acompanhamentos.flatMap((item) => item.registros);

    return [...todosRegistros].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )[0];
  }, [acompanhamentos]);

  const proximoRetorno = useMemo(() => {
    const retornos = acompanhamentos
      .map((item) => item.proximoRetorno)
      .filter(Boolean) as string[];

    return [...retornos].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];
  }, [acompanhamentos]);

  return (
    <AcompanhamentoContext.Provider
      value={{
        acompanhamentos,
        totalAtivos,
        ultimoRegistro,
        totalComAtencao,
        proximoRetorno,
      }}>
      {children}
    </AcompanhamentoContext.Provider>
  );
}

export function useAcompanhamentos() {
  const context = useContext(AcompanhamentoContext);

  if (!context) {
    throw new Error('useAcompanhamentos deve ser usado dentro de AcompanhamentoProvider');
  }

  return context;
}
