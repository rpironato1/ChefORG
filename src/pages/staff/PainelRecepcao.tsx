import React, { useState, useEffect } from 'react';
import { TabelaResponsiva } from '../../components/ui/TabelaResponsiva';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { getAllTables } from '../../lib/api/tables';
import { getAllReservations, allocateTableToWaitingClient } from '../../lib/api/reservations';
import { sendNotification } from '../../lib/api/notifications';
import { Database } from '@/lib/supabase';

type Table = Database['public']['Tables']['tables']['Row'];
type Reservation = Database['public']['Tables']['reservations']['Row'] & { users?: { telefone: string | null } };

const PainelRecepcao: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, ToastContainer } = useToast();

  // State para o modal de alocação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isAllocating, setIsAllocating] = useState(false);

  const fetchData = async () => {
    // Não mostra o loader em atualizações automáticas
    if (!isLoading) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [tablesResult, reservationsResult] = await Promise.all([
        getAllTables(),
        getAllReservations(today)
      ]);

      if (tablesResult.success && tablesResult.data) {
        setTables(tablesResult.data);
      } else {
        throw new Error(tablesResult.error || 'Falha ao buscar mesas.');
      }

      if (reservationsResult.success && reservationsResult.data) {
        setReservations(reservationsResult.data as Reservation[]);
      } else {
        throw new Error(reservationsResult.error || 'Falha ao buscar reservas.');
      }

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro de conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleOpenAllocationModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleAllocateTable = async (tableId: number) => {
    if (!selectedReservation) return;

    setIsAllocating(true);
    try {
      const result = await allocateTableToWaitingClient(selectedReservation.id, tableId);
      
      if (result.success && result.data) {
        const pin = result.data.pin;
        const clientName = selectedReservation.nome_cliente;
        const clientPhone = selectedReservation.telefone_contato;
        const tableNumber = tables.find(t => t.id === tableId)?.numero;

        // Enviar notificação para o cliente
        if (clientPhone) {
          const message = `Olá ${clientName}, sua mesa está pronta! Dirija-se à recepção. Sua mesa é a de número ${tableNumber} e seu PIN de acesso é: ${pin}`;
          await sendNotification(clientPhone, message);
        }
        
        showSuccess('Sucesso!', `Mesa ${tableNumber} alocada para ${clientName}.`);
        setIsModalOpen(false);
        fetchData(); // Atualiza os dados
      } else {
        showError('Erro', result.error || 'Não foi possível alocar a mesa.');
      }
    } catch (err: any) {
      showError('Erro Inesperado', err.message);
    } finally {
      setIsAllocating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'livre': return 'bg-green-100 text-green-800';
      case 'ocupada': return 'bg-red-100 text-red-800';
      case 'reservada': return 'bg-blue-100 text-blue-800';
      case 'limpeza': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const filaDeEspera = reservations.filter(r => r.status === 'aguardando');
  const reservasDeHoje = reservations.filter(r => r.status !== 'aguardando');
  const mesasLivres = tables.filter(t => t.status === 'livre');

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary-600" /></div>;
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col justify-center items-center h-64 bg-red-50 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="mt-2 text-red-700 font-semibold">Erro ao carregar o painel</p>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Painel da Recepção</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle>Fila de Espera ({filaDeEspera.length})</CardTitle></CardHeader>
            <CardContent>
              <TabelaResponsiva
                headers={['Pos.', 'Nome', 'Qtd', 'Ações']}
                rows={filaDeEspera.map((item, index) => [
                  index + 1,
                  item.nome_cliente,
                  item.pessoas,
                  <button onClick={() => handleOpenAllocationModal(item)} className="btn-primary-sm">Alocar</button>
                ])}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Reservas de Hoje ({reservasDeHoje.length})</CardTitle></CardHeader>
            <CardContent>
              <TabelaResponsiva
                headers={['Nome', 'Horário', 'Status', 'Ações']}
                rows={reservasDeHoje.map(reserva => [
                  reserva.nome_cliente,
                  new Date(reserva.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                  reserva.status,
                  <button className="text-blue-600 hover:underline">Check-in</button>
                ])}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Status das Mesas</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tables.map(mesa => (
                  <div key={mesa.id} className={`p-4 rounded-lg shadow text-center ${getStatusColor(mesa.status)}`}>
                    <p className="font-bold text-xl">Mesa {mesa.numero}</p>
                    <p className="text-sm capitalize">{mesa.status}</p>
                    <p className="text-xs text-gray-600">({mesa.lugares} lugares)</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} titulo={`Alocar Mesa para ${selectedReservation?.nome_cliente}`}>
        <div className="p-4">
          <p className="mb-4">Selecione uma mesa livre para alocar para <strong>{selectedReservation?.pessoas}</strong> pessoa(s).</p>
          {isAllocating ? (
            <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {mesasLivres.length > 0 ? (
                mesasLivres.map(mesa => (
                  <button 
                    key={mesa.id}
                    onClick={() => handleAllocateTable(mesa.id)}
                    className="p-4 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    disabled={mesa.lugares < (selectedReservation?.pessoas || 0)}
                  >
                    <p className="font-bold">Mesa {mesa.numero}</p>
                    <p className="text-sm">{mesa.lugares} lugares</p>
                  </button>
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500">Nenhuma mesa livre no momento.</p>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PainelRecepcao;
