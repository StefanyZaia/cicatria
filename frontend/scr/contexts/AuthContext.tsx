import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

export type User = {
  id: string;
  nome: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  registrar: (nome: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function validarEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function criarSessao(email: string, nome = 'Paciente') {
  return {
    user: {
      id: 'demo-user',
      nome,
      email,
    },
    token: 'demo-token',
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!validarEmail(normalizedEmail)) {
        throw new Error('Informe um e-mail válido.');
      }

      if (password.trim().length < 4) {
        throw new Error('A senha precisa ter pelo menos 4 caracteres.');
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const session = criarSessao(normalizedEmail);
      setUser(session.user);
      setToken(session.token);
    } finally {
      setIsLoading(false);
    }
  };

  const registrar = async (nome: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      const normalizedName = nome.trim();
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedName) {
        throw new Error('Informe seu nome completo.');
      }

      if (!validarEmail(normalizedEmail)) {
        throw new Error('Informe um e-mail válido.');
      }

      if (password.trim().length < 4) {
        throw new Error('A senha precisa ter pelo menos 4 caracteres.');
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const session = criarSessao(normalizedEmail, normalizedName);
      setUser(session.user);
      setToken(session.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUser(null);
    setToken(null);
    setIsLoading(false);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      isBootstrapping: false,
      isAuthenticated: !!token,
      login,
      registrar,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
