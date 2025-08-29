import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Utensils, Shield, AlertCircle } from 'lucide-react';
import { useMesa } from '../../contexts/AppContext';
import { useToast } from '../../components/ui/Toast';

function PinMesa() {
  const { numeroMesa } = useParams<{ numeroMesa: string }>();
  const [pin, setPin] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const { mesaAtual, autorizarMesa } = useMesa();
  const { showSuccess, showError, showWarning, ToastContainer } = useToast();
  const navigate = useNavigate();

  // PINs estão configurados no sistema de mesas

  useEffect(() => {
    // Se não há número da mesa na URL, redireciona
    if (!numeroMesa) {
      navigate('/checkin');
      return;
    }

    // Se a mesa já está autorizada, redireciona para cardápio
    if (mesaAtual.isAutorizado && mesaAtual.mesa?.numero.toString() === numeroMesa) {
      navigate(`/mesa/${numeroMesa}/cardapio`);
    }
  }, [numeroMesa, mesaAtual.isAutorizado, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.length !== 4) {
      showError('PIN Inválido', 'O PIN deve ter 4 dígitos');
      return;
    }

    if (attempts >= maxAttempts) {
      showError('Bloqueado', 'Muitas tentativas. Chame um garçom.');
      return;
    }

    setIsValidating(true);

    try {
      // A API espera um número para o ID da mesa
      const tableId = parseInt(numeroMesa!, 10);
      if (isNaN(tableId)) {
        showError('Erro', 'Número da mesa inválido.');
        setIsValidating(false);
        return;
      }

      // Simulate PIN validation for development
      const result = await new Promise<{ success: boolean; data?: { valid: boolean } }>(resolve => {
        setTimeout(() => {
          // Simple validation - PIN should be 4 digits for now
          const isValid = pin.length === 4 && /^\d{4}$/.test(pin);
          resolve({ success: true, data: { valid: isValid } });
        }, 1000);
      });

      if (result.success && result.data?.valid) {
        // PIN correto - autorizar mesa
        autorizarMesa(pin); // O contexto pode precisar do objeto da mesa, não apenas do PIN
        showSuccess('Acesso Liberado!', 'Bem-vindo(a)!');

        // Redirecionar para cardápio após 1 segundo
        setTimeout(() => {
          navigate(`/mesa/${numeroMesa}/cardapio`);
        }, 1000);
      } else {
        // PIN incorreto ou outro erro da API
        const tentativasRestantes = maxAttempts - attempts - 1;
        setAttempts(prev => prev + 1);

        if (tentativasRestantes > 0) {
          showWarning(
            'PIN Incorreto',
            `Restam ${tentativasRestantes} tentativa(s)`
          );
        } else {
          showError('Mesa Bloqueada', 'Muitas tentativas incorretas. Solicite ajuda ao garçom.');
        }
        setPin('');
      }
    } catch (error) {
      showError('Erro de Conexão', 'Falha na validação. Tente novamente.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleNumberClick = (number: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + number);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const isBlocked = attempts >= maxAttempts;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/checkin"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <div className="flex items-center">
                <Utensils className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">ChefORG</span>
              </div>
            </div>
            <div className="text-lg font-semibold text-primary-600">Mesa {numeroMesa}</div>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mb-6">
              <div
                className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center ${
                  isBlocked ? 'bg-red-100' : 'bg-primary-100'
                }`}
              >
                {isBlocked ? (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                ) : (
                  <Shield className="h-8 w-8 text-primary-600" />
                )}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isBlocked ? 'Mesa Bloqueada' : 'Digite o PIN da Mesa'}
            </h1>
            <p className="text-gray-600 mb-8">
              {isBlocked
                ? 'Muitas tentativas incorretas. Solicite ajuda ao garçom.'
                : `Mesa ${numeroMesa} - Digite o PIN de 4 dígitos para continuar`}
            </p>
          </div>

          {!isBlocked && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Display do PIN */}
              <div className="flex justify-center space-x-3 mb-8">
                {[0, 1, 2, 3].map(index => (
                  <div
                    key={index}
                    className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold ${
                      pin.length > index
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-500 bg-gray-50'
                    }`}
                  >
                    {pin.length > index ? '●' : ''}
                  </div>
                ))}
              </div>

              {/* Teclado Numérico */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => handleNumberClick(number.toString())}
                    disabled={pin.length >= 4}
                    className="h-12 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-colors"
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleClear}
                  className="h-12 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Limpar
                </button>

                <button
                  type="button"
                  onClick={() => handleNumberClick('0')}
                  disabled={pin.length >= 4}
                  className="h-12 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-colors"
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={handleBackspace}
                  className="h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                >
                  ⌫
                </button>
              </div>

              {/* Botão de Confirmar */}
              <button
                type="submit"
                disabled={pin.length !== 4 || isValidating}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  pin.length === 4 && !isValidating
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-400 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isValidating ? 'Validando...' : 'Confirmar PIN'}
              </button>

              {/* Tentativas */}
              {attempts > 0 && (
                <div className="text-center text-sm text-orange-600">
                  {attempts}/{maxAttempts} tentativas utilizadas
                </div>
              )}
            </form>
          )}

          {/* Informações de Ajuda */}
          <div className="mt-8 text-center">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Precisa de ajuda?</h3>
            <p className="text-xs text-gray-600 mb-4">
              O PIN é fornecido pela recepção ou enviado por WhatsApp. Se não recebeu, chame um
              garçom.
            </p>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <button className="text-primary-600 hover:text-primary-700 underline">
                Chamar Garçom
              </button>
              <span>•</span>
              <button className="text-primary-600 hover:text-primary-700 underline">
                Falar com Recepção
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PinMesa;
