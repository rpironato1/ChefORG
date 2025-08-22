import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, Phone, User, FileText, Utensils, CheckCircle } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { createReservation } from '../../lib/api/reservations';
import { sendNotification } from '../../lib/api/notifications';

interface FormData {
  nome: string;
  cpf: string;
  telefone: string;
  data: string;
  hora: string;
  quantidade: number;
  restricoes: string;
}

const horariosDisponiveis = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

function ReservaOnline() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cpf: '',
    telefone: '',
    data: '',
    hora: '',
    quantidade: 2,
    restricoes: ''
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showSuccess, showError, ToastContainer } = useToast();

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const validateStep1 = () => {
    const { nome, cpf, telefone } = formData;
    
    if (!nome.trim()) {
      showError('Erro', 'Nome é obrigatório');
      return false;
    }
    
    if (!cpf.trim() || cpf.replace(/\D/g, '').length !== 11) {
      showError('Erro', 'CPF deve ter 11 dígitos');
      return false;
    }
    
    if (!telefone.trim() || telefone.replace(/\D/g, '').length < 10) {
      showError('Erro', 'Telefone inválido');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    const { data, hora, quantidade } = formData;
    
    if (!data) {
      showError('Erro', 'Data é obrigatória');
      return false;
    }
    
    const dataReserva = new Date(data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataReserva < hoje) {
      showError('Erro', 'Data não pode ser anterior a hoje');
      return false;
    }
    
    if (!hora) {
      showError('Erro', 'Horário é obrigatório');
      return false;
    }
    
    if (quantidade < 1 || quantidade > 20) {
      showError('Erro', 'Quantidade deve ser entre 1 e 20 pessoas');
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    
    setIsSubmitting(true);

    // Combina data e hora para o formato ISO que o Supabase espera
    const dataHora = new Date(`${formData.data}T${formData.hora}:00`);

    try {
      const result = await createReservation({
        cliente_nome: formData.nome,
        cliente_cpf: formData.cpf.replace(/\D/g, ''),
        cliente_telefone: formData.telefone.replace(/\D/g, ''),
        data_hora: dataHora.toISOString(),
        numero_convidados: formData.quantidade,
        restricoes: formData.restricoes,
      });

      if (result.success && result.data) {
        setIsSubmitted(true);
        showSuccess('Sucesso!', result.message || 'Reserva realizada com sucesso!');
        
        // Envia notificação de confirmação
        const reservationDetails = result.data;
        const messageBody = `Olá ${reservationDetails.cliente_nome}, sua reserva no ChefORG para ${reservationDetails.numero_convidados} pessoa(s) no dia ${new Date(reservationDetails.data_hora).toLocaleDateString('pt-BR')} às ${new Date(reservationDetails.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} foi confirmada!`;
        
        await sendNotification(formData.telefone.replace(/\D/g, ''), messageBody);

      } else {
        showError('Erro', result.error || 'Falha ao processar reserva. Tente novamente.');
      }
    } catch (error) {
      console.error(error);
      showError('Erro Inesperado', 'Ocorreu um problema de conexão. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (isSubmitted) {
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

        {/* Success Message */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Reserva Confirmada!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Sua reserva foi realizada com sucesso. Você receberá uma confirmação por WhatsApp.
            </p>

            {/* Resumo da Reserva */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Detalhes da Reserva</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome:</span>
                  <span className="font-medium">{formData.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">{new Date(formData.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-medium">{formData.hora}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pessoas:</span>
                  <span className="font-medium">{formData.quantidade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Telefone:</span>
                  <span className="font-medium">{formData.telefone}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-primary">
                Voltar ao Início
              </Link>
              <Link to="/menu" className="btn-secondary">
                Ver Cardápio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <div className="flex items-center">
                <Utensils className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">ChefORG</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= stepNumber ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-primary-600' : 'text-gray-500'}>Dados Pessoais</span>
            <span className={step >= 2 ? 'text-primary-600' : 'text-gray-500'}>Data e Horário</span>
            <span className={step >= 3 ? 'text-primary-600' : 'text-gray-500'}>Confirmação</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Reservar Mesa
          </h1>

          {/* Step 1: Dados Pessoais */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Seus Dados Pessoais
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-2" />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="input-field"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-2" />
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                    className="input-field"
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Telefone/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', formatTelefone(e.target.value))}
                    className="input-field"
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handleNextStep} className="btn-primary">
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Data e Horário */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Data e Horário
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Data da Reserva *
                  </label>
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => handleInputChange('data', e.target.value)}
                    className="input-field"
                    min={getTodayDate()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-2" />
                    Horário *
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {horariosDisponiveis.map(horario => (
                      <button
                        key={horario}
                        type="button"
                        onClick={() => handleInputChange('hora', horario)}
                        className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                          formData.hora === horario
                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {horario}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-2" />
                    Número de Pessoas *
                  </label>
                  <select
                    value={formData.quantidade}
                    onChange={(e) => handleInputChange('quantidade', parseInt(e.target.value))}
                    className="input-field"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'pessoa' : 'pessoas'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restrições Alimentares ou Observações
                  </label>
                  <textarea
                    value={formData.restricoes}
                    onChange={(e) => handleInputChange('restricoes', e.target.value)}
                    className="input-field h-24 resize-none"
                    placeholder="Ex: vegetariano, alergia a frutos do mar, cadeirante, etc."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="btn-secondary">
                  Voltar
                </button>
                <button onClick={handleNextStep} className="btn-primary">
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmação */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Confirme seus Dados
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Nome:</span>
                    <p className="font-medium">{formData.nome}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">CPF:</span>
                    <p className="font-medium">{formData.cpf}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Telefone:</span>
                    <p className="font-medium">{formData.telefone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Data:</span>
                    <p className="font-medium">{new Date(formData.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Horário:</span>
                    <p className="font-medium">{formData.hora}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Pessoas:</span>
                    <p className="font-medium">{formData.quantidade}</p>
                  </div>
                  {formData.restricoes && (
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-600">Observações:</span>
                      <p className="font-medium">{formData.restricoes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Sua reserva será confirmada por WhatsApp. 
                  Mantenha seu telefone ligado para receber a confirmação.
                </p>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="btn-secondary">
                  Voltar
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Processando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservaOnline; 