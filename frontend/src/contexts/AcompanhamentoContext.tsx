import React, { createContext, useContext, useMemo, useState } from 'react';

export type Registro = {
  id: string;
  data: string;
  fotoUri?: string;
  dor: number;
  temSecrecao: boolean;
  temOdor: boolean;
  vermelhidao: 'sem' | 'leve' | 'moderada' | 'intensa';
  observacao?: string;
};

export type Acompanhamento = {
  id: string;
  titulo: string;
  local: string;
  status: 'ativo' | 'finalizado';
  precisaAtencao: boolean;
  proximoRetorno?: string;
  registros: Registro[];
};

type NovoAcompanhamentoInput = {
  fotoUri?: string;
  titulo: string;
  local: string;
  proximoRetorno?: string;
  dor: number;
  vermelhidao: Registro['vermelhidao'];
  temSecrecao: boolean;
  temOdor: boolean;
  observacao?: string;
};

type NovoRegistroInput = {
  acompanhamentoId: string;
  fotoUri?: string;
  dor: number;
  vermelhidao: Registro['vermelhidao'];
  temSecrecao: boolean;
  temOdor: boolean;
  observacao?: string;
};

type AcompanhamentoContextData = {
  acompanhamentos: Acompanhamento[];
  totalAtivos: number;
  ultimoRegistro?: Registro;
  ultimoRegistroAcompanhamentoId?: string;
  totalComAtencao: number;
  proximoRetorno?: string;
  criarAcompanhamento: (input: NovoAcompanhamentoInput) => Acompanhamento;
  adicionarRegistro: (input: NovoRegistroInput) => void;
  alternarStatus: (id: string) => void;
};

const AcompanhamentoContext = createContext<AcompanhamentoContextData | undefined>(undefined);

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

function avaliarAtencao(registro: Pick<Registro, 'dor' | 'temSecrecao' | 'temOdor' | 'vermelhidao'>) {
  return registro.dor >= 7 || registro.temSecrecao || registro.temOdor || registro.vermelhidao === 'intensa';
}

export function AcompanhamentoProvider({ children }: { children: React.ReactNode }) {
  const [acompanhamentos, setAcompanhamentos] = useState<Acompanhamento[]>([
    {
      id: '1',
      titulo: 'Ferida no pé esquerdo',
      local: 'Pé esquerdo',
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
          observacao: 'Leve sensibilidade ao caminhar.',
        },
      ],
    },
    {
      id: '2',
      titulo: 'Pós-operatório',
      local: 'Abdômen',
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
          observacao: 'Aspecto seco e bordas regulares.',
        },
      ],
    },
  ]);

  const criarAcompanhamento = (input: NovoAcompanhamentoInput) => {
    const registro: Registro = {
      id: `r-${Date.now()}`,
      data: hoje(),
      fotoUri: input.fotoUri,
      dor: input.dor,
      temSecrecao: input.temSecrecao,
      temOdor: input.temOdor,
      vermelhidao: input.vermelhidao,
      observacao: input.observacao?.trim() || undefined,
    };

    const novo: Acompanhamento = {
      id: `${Date.now()}`,
      titulo: input.titulo.trim(),
      local: input.local.trim(),
      status: 'ativo',
      precisaAtencao: avaliarAtencao(registro),
      proximoRetorno: input.proximoRetorno?.trim() || undefined,
      registros: [registro],
    };

    setAcompanhamentos((atuais) => [novo, ...atuais]);
    return novo;
  };

  const adicionarRegistro = (input: NovoRegistroInput) => {
    const registro: Registro = {
      id: `r-${Date.now()}`,
      data: hoje(),
      fotoUri: input.fotoUri,
      dor: input.dor,
      temSecrecao: input.temSecrecao,
      temOdor: input.temOdor,
      vermelhidao: input.vermelhidao,
      observacao: input.observacao?.trim() || undefined,
    };

    setAcompanhamentos((atuais) =>
      atuais.map((item) => {
        if (item.id !== input.acompanhamentoId) {
          return item;
        }

        return {
          ...item,
          precisaAtencao: item.precisaAtencao || avaliarAtencao(registro),
          registros: [registro, ...item.registros],
        };
      })
    );
  };

  const alternarStatus = (id: string) => {
    setAcompanhamentos((atuais) =>
      atuais.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'ativo' ? 'finalizado' : 'ativo' }
          : item
      )
    );
  };

  const totalAtivos = acompanhamentos.filter((item) => item.status === 'ativo').length;
  const totalComAtencao = acompanhamentos.filter((item) => item.precisaAtencao).length;

  const ultimoRegistro = useMemo(() => {
    const todosRegistros = acompanhamentos.flatMap((item) => item.registros);

    return [...todosRegistros].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )[0];
  }, [acompanhamentos]);

  const ultimoRegistroAcompanhamentoId = useMemo(() => {
    if (!ultimoRegistro) {
      return undefined;
    }

    return acompanhamentos.find((item) =>
      item.registros.some((registro) => registro.id === ultimoRegistro.id)
    )?.id;
  }, [acompanhamentos, ultimoRegistro]);

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
        ultimoRegistroAcompanhamentoId,
        totalComAtencao,
        proximoRetorno,
        criarAcompanhamento,
        adicionarRegistro,
        alternarStatus,
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
