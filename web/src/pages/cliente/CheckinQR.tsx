import { useState } from 'react';
import { QrCode, Camera, AlertCircle, CheckCircle, Utensils, Users, Clock } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

function CheckinQR() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [mesaInfo, setMesaInfo] = useState<any>(null);
  const { showSuccess, ToastContainer } = useToast();

  const handleScanSuccess = (result: string) => {
    setScanResult(result);
    setIsScanning(false);

    // Simular busca de informações da mesa
    setTimeout(() => {
      // Mock da informação da mesa
      const mockMesaInfo = {
        numero: '05',
        reserva: {
          nome: 'Maria Silva',
          pessoas: 4,
          horario: '19:30',
          id: 'RES-001',
        },
        status: 'confirmada',
      };

      setMesaInfo(mockMesaInfo);
      showSuccess('QR Code lido com sucesso!', 'Dados da reserva carregados');
    }, 1000);
  };

  const handleConfirmCheckin = () => {
    // Simular processo de check-in
    setTimeout(() => {
      showSuccess('Check-in realizado!', 'Bem-vindos ao ChefORG');
      // Aqui redirecionaria para a tela da mesa
    }, 1500);
  };

  const mockScanQR = () => {
    setIsScanning(true);
    setTimeout(() => {
      handleScanSuccess('CHEFORG_MESA_05_RES_001');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">ChefORG</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mb-6">
              <QrCode className="h-16 w-16 text-primary-600 mx-auto" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check-in na Mesa</h1>
            <p className="text-gray-600 mb-8">
              Escaneie o QR Code da sua mesa para fazer o check-in
            </p>
          </div>

          {/* Scanner Interface */}
          {!scanResult && (
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                {isScanning ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <Camera className="h-12 w-12 text-primary-600 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-600">Escaneando QR Code...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full animate-pulse w-3/4"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <QrCode className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      Posicione o QR Code da mesa dentro do quadro
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={mockScanQR}
                disabled={isScanning}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isScanning
                    ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isScanning ? 'Escaneando...' : 'Iniciar Scanner'}
              </button>
            </div>
          )}

          {/* Resultado do Scan */}
          {scanResult && mesaInfo && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Mesa Identificada!</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Mesa:</span>
                    <span className="text-lg font-bold text-primary-600">#{mesaInfo.numero}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Nome:</span>
                    <span className="font-medium text-gray-900">{mesaInfo.reserva.nome}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Pessoas:</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{mesaInfo.reserva.pessoas}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Horário:</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{mesaInfo.reserva.horario}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Reserva:</span>
                    <span className="font-medium text-gray-900">{mesaInfo.reserva.id}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Reserva confirmada - Pronto para check-in
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handleConfirmCheckin} className="w-full btn-primary">
                  Confirmar Check-in
                </button>

                <button
                  onClick={() => {
                    setScanResult(null);
                    setMesaInfo(null);
                  }}
                  className="w-full btn-secondary"
                >
                  Escanear Novamente
                </button>
              </div>
            </div>
          )}

          {/* Informações de Ajuda */}
          {!scanResult && (
            <div className="mt-8 text-center">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Precisa de ajuda?</h3>
              <p className="text-xs text-gray-600 mb-4">
                O QR Code está localizado na mesa. Se não conseguir encontrar, peça ajuda ao garçom.
              </p>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Sem reserva?</span>
                </div>
                <button className="text-primary-600 hover:text-primary-700 underline">
                  Fale com a recepção
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckinQR;
