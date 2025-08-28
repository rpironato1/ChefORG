import { useState } from 'react';
import { Save, Bell, Shield, Database, Globe, Printer } from 'lucide-react';

function Configuracoes() {
  const [activeTab, setActiveTab] = useState('geral');
  const [settings, setSettings] = useState({
    // Configurações Gerais
    nomeRestaurante: 'ChefORG Restaurant',
    endereco: 'Rua das Flores, 123 - Centro',
    telefone: '(11) 3333-4444',
    email: 'contato@cheforg.com',
    cnpj: '12.345.678/0001-90',

    // Notificações
    notificacoesPedidos: true,
    notificacoesReservas: true,
    notificacoesEstoque: false,
    emailNotificacoes: true,
    smsNotificacoes: false,

    // Sistema
    moeda: 'BRL',
    idioma: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    taxaServico: 10,

    // Impressão
    impressoraPedidos: 'Impressora Cozinha',
    impressoraContas: 'Impressora Balcão',
    formatoPapel: 'A4',

    // Backup
    backupAutomatico: true,
    frequenciaBackup: 'diario',
    manterBackups: 30,
  });

  const tabs = [
    { id: 'geral', label: 'Geral', icon: Globe },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'sistema', label: 'Sistema', icon: Database },
    { id: 'impressao', label: 'Impressão', icon: Printer },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
  ];

  const handleSave = () => {
    // Save configuration to local storage or API
    try {
      localStorage.setItem('cheforg-settings', JSON.stringify(settings));
      // Show success feedback to user
      // showSuccess('Configurações salvas com sucesso!');
    } catch (error) {
      // Handle save error
      // showError('Erro ao salvar configurações');
    }
  };

  const renderGeralTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Informações do Restaurante</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Restaurante
          </label>
          <input
            type="text"
            value={settings.nomeRestaurante}
            onChange={e => setSettings({ ...settings, nomeRestaurante: e.target.value })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
          <input
            type="text"
            value={settings.cnpj}
            onChange={e => setSettings({ ...settings, cnpj: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
          <input
            type="text"
            value={settings.endereco}
            onChange={e => setSettings({ ...settings, endereco: e.target.value })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input
            type="tel"
            value={settings.telefone}
            onChange={e => setSettings({ ...settings, telefone: e.target.value })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={settings.email}
            onChange={e => setSettings({ ...settings, email: e.target.value })}
            className="input-field"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificacoesTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Preferências de Notificação</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Notificações de Pedidos</h4>
            <p className="text-sm text-gray-600">Receber alertas quando novos pedidos chegarem</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notificacoesPedidos}
              onChange={e => setSettings({ ...settings, notificacoesPedidos: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Notificações de Reservas</h4>
            <p className="text-sm text-gray-600">Alertas para novas reservas e cancelamentos</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notificacoesReservas}
              onChange={e => setSettings({ ...settings, notificacoesReservas: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Alertas de Estoque</h4>
            <p className="text-sm text-gray-600">
              Notificar quando ingredientes estiverem em baixa
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notificacoesEstoque}
              onChange={e => setSettings({ ...settings, notificacoesEstoque: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Métodos de Notificação</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.emailNotificacoes}
              onChange={e => setSettings({ ...settings, emailNotificacoes: e.target.checked })}
              className="rounded border-gray-500 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Email</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.smsNotificacoes}
              onChange={e => setSettings({ ...settings, smsNotificacoes: e.target.checked })}
              className="rounded border-gray-500 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">SMS</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSistemaTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Configurações do Sistema</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Moeda</label>
          <select
            value={settings.moeda}
            onChange={e => setSettings({ ...settings, moeda: e.target.value })}
            className="input-field"
          >
            <option value="BRL">Real Brasileiro (R$)</option>
            <option value="USD">Dólar Americano ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
          <select
            value={settings.idioma}
            onChange={e => setSettings({ ...settings, idioma: e.target.value })}
            className="input-field"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fuso Horário</label>
          <select
            value={settings.timezone}
            onChange={e => setSettings({ ...settings, timezone: e.target.value })}
            className="input-field"
          >
            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
            <option value="America/New_York">New York (GMT-5)</option>
            <option value="Europe/London">London (GMT+0)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Taxa de Serviço (%)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            value={settings.taxaServico}
            onChange={e => setSettings({ ...settings, taxaServico: parseInt(e.target.value) })}
            className="input-field"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Backup Automático</h4>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.backupAutomatico}
              onChange={e => setSettings({ ...settings, backupAutomatico: e.target.checked })}
              className="rounded border-gray-500 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Ativar backup automático</span>
          </label>

          {settings.backupAutomatico && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
                <select
                  value={settings.frequenciaBackup}
                  onChange={e => setSettings({ ...settings, frequenciaBackup: e.target.value })}
                  className="input-field"
                >
                  <option value="diario">Diário</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manter backups por (dias)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.manterBackups}
                  onChange={e =>
                    setSettings({ ...settings, manterBackups: parseInt(e.target.value) })
                  }
                  className="input-field"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderImpressaoTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Configurações de Impressão</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Impressora para Pedidos (Cozinha)
          </label>
          <select
            value={settings.impressoraPedidos}
            onChange={e => setSettings({ ...settings, impressoraPedidos: e.target.value })}
            className="input-field"
          >
            <option value="Impressora Cozinha">Impressora Cozinha</option>
            <option value="Impressora Principal">Impressora Principal</option>
            <option value="Nenhuma">Nenhuma</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Impressora para Contas
          </label>
          <select
            value={settings.impressoraContas}
            onChange={e => setSettings({ ...settings, impressoraContas: e.target.value })}
            className="input-field"
          >
            <option value="Impressora Balcão">Impressora Balcão</option>
            <option value="Impressora Principal">Impressora Principal</option>
            <option value="Nenhuma">Nenhuma</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Formato do Papel</label>
          <select
            value={settings.formatoPapel}
            onChange={e => setSettings({ ...settings, formatoPapel: e.target.value })}
            className="input-field"
          >
            <option value="A4">A4</option>
            <option value="80mm">80mm (Térmica)</option>
            <option value="58mm">58mm (Térmica)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSegurancaTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Configurações de Segurança</h3>

      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Alterar Senha</h4>
          <p className="text-sm text-yellow-700 mb-3">
            Recomendamos alterar sua senha regularmente para manter a segurança.
          </p>
          <button className="btn-secondary text-sm">Alterar Senha</button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Autenticação de Dois Fatores</h4>
          <p className="text-sm text-blue-700 mb-3">
            Adicione uma camada extra de segurança à sua conta.
          </p>
          <button className="btn-secondary text-sm">Configurar 2FA</button>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2">Sessões Ativas</h4>
          <p className="text-sm text-green-700 mb-3">
            Gerencie os dispositivos conectados à sua conta.
          </p>
          <button className="btn-secondary text-sm">Ver Sessões</button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'geral':
        return renderGeralTab();
      case 'notificacoes':
        return renderNotificacoesTab();
      case 'sistema':
        return renderSistemaTab();
      case 'impressao':
        return renderImpressaoTab();
      case 'seguranca':
        return renderSegurancaTab();
      default:
        return renderGeralTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">Personalize as configurações do sistema</p>
        </div>
        <button onClick={handleSave} className="btn-primary">
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with tabs */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="card">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;
