import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Mesa, Reserva, Cliente } from '../types';
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
  AuthUser,
  ApiResponse,
} from '../lib/api/auth';

// --- STATE AND REDUCER ---

interface AppState {
  usuario: AuthUser | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  mesaAtual: {
    mesa?: Mesa;
    cliente?: Cliente;
    reserva?: Reserva;
    pin?: string;
    isAutorizado: boolean;
  };
}

type AppAction =
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_LOADING_AUTH'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'SET_MESA_ATUAL'; payload: { mesa: Mesa; cliente?: Cliente; reserva?: Reserva } }
  | { type: 'AUTORIZAR_MESA'; payload: { pin: string } }
  | { type: 'LIMPAR_MESA' };

const initialState: AppState = {
  usuario: null,
  isAuthenticated: false,
  isLoadingAuth: true,
  mesaAtual: { isAutorizado: false },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING_AUTH':
      return { ...state, isLoadingAuth: action.payload };
    case 'SET_USER':
      return {
        ...state,
        usuario: action.payload,
        isAuthenticated: !!action.payload,
        isLoadingAuth: false,
      };
    case 'LOGOUT':
      return { ...state, usuario: null, isAuthenticated: false };
    case 'SET_MESA_ATUAL':
      return {
        ...state,
        mesaAtual: {
          ...state.mesaAtual,
          mesa: action.payload.mesa,
          cliente: action.payload.cliente,
          reserva: action.payload.reserva,
          isAutorizado: false,
        },
      };
    case 'AUTORIZAR_MESA':
      return {
        ...state,
        mesaAtual: { ...state.mesaAtual, pin: action.payload.pin, isAutorizado: true },
      };
    case 'LIMPAR_MESA':
      return { ...state, mesaAtual: { isAutorizado: false } };
    default:
      return state;
  }
}

// --- CONTEXT AND PROVIDER ---

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => Promise<ApiResponse<AuthUser>>;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<ApiResponse<AuthUser>>;
  selecionarMesa: (mesa: Mesa, cliente?: Cliente, reserva?: Reserva) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const checkSession = async () => {
      const result = await getCurrentUser();
      dispatch({ type: 'SET_USER', payload: result.data || null });
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    if (result.success && result.data) {
      dispatch({ type: 'SET_USER', payload: result.data });
    }
    return result;
  };

  const logout = async () => {
    await apiLogout();
    dispatch({ type: 'LOGOUT' });
  };

  // Alias for login (expected by tests)
  const signIn = login;

  // Method to select a table
  const selecionarMesa = (mesa: Mesa, cliente?: Cliente, reserva?: Reserva) => {
    dispatch({ type: 'SET_MESA_ATUAL', payload: { mesa, cliente, reserva } });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout, signIn, selecionarMesa }}>
      {children}
    </AppContext.Provider>
  );
}

// --- CUSTOM HOOKS ---

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
}

export function useAuth() {
  const { state, login, logout, signIn } = useApp();
  return {
    usuario: state.usuario,
    user: state.usuario, // Add alias for tests
    isAuthenticated: state.isAuthenticated,
    isLoadingAuth: state.isLoadingAuth,
    loading: state.isLoadingAuth, // Add alias for tests
    login,
    logout,
    signIn,
    signOut: logout, // Add alias for tests
  };
}

export function useMesa() {
  const { state, dispatch, selecionarMesa } = useApp();

  const setMesaAtual = (mesa: Mesa, cliente?: Cliente, reserva?: Reserva) => {
    dispatch({ type: 'SET_MESA_ATUAL', payload: { mesa, cliente, reserva } });
  };

  const autorizarMesa = (pin: string) => {
    dispatch({ type: 'AUTORIZAR_MESA', payload: { pin } });
  };

  const limparMesa = () => {
    dispatch({ type: 'LIMPAR_MESA' });
  };

  // Create a flattened mesaAtual for tests that combines mesa properties with mesaAtual properties
  const mesaAtual = state.mesaAtual.mesa ? {
    ...state.mesaAtual,
    ...state.mesaAtual.mesa, // Flatten mesa properties to top level
  } : state.mesaAtual;

  return {
    mesaAtual,
    setMesaAtual,
    autorizarMesa,
    limparMesa,
    liberarMesa: limparMesa, // Add alias for tests
    selecionarMesa,
  };
}
