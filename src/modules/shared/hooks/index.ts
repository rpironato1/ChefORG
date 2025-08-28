// Exports for modular business logic hooks - Sprint 3 implementation

// Authentication
export { useAuth } from './useAuth';

// Core business entities
export { useValidarDisponibilidadeMesa, useGeradorPIN, useReservas } from './useReservations';

export { useTables } from './useTables';
export { useMenu } from './useMenu';

export { useOrders, useOrderStatus, useEstimatedTime } from './useOrders';

export { useDigitalPayments, useCashPayments, usePayments } from './usePayments';

// Management & Analytics
export { useReports } from './useReports';
export { useStock } from './useStock';
export { useLoyalty } from './useLoyalty';

// Backward compatibility aliases
export { useTables as useMesas } from './useTables';
export { useOrders as usePedidos } from './useOrders';
export { useOrderStatus as useStatusPedido } from './useOrders';
export { useEstimatedTime as useTempoEstimado } from './useOrders';
export { useDigitalPayments as usePagamentoDigital } from './usePayments';
export { useCashPayments as usePagamentoCaixa } from './usePayments';
export { useReports as useRelatorios } from './useReports';
export { useStock as useEstoque } from './useStock';
export { useLoyalty as useFidelidade } from './useLoyalty';
