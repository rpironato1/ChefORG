CRIE UMA APLICAÇÃO VOLTADA PARA SISTEMA DE BARES E RESTAURANTES

ESCOPO OPERACIONAL 

0 ORIENTACAO GERAL
0.1 Crie toda a interface visual completa antes de implementar a logica.
0.2 Depois de pronta a interface implemente as funcoes de negocio.
0.3 Em seguida modele e popule o banco de dados.
0.4 Por ultimo exponha APIs internas e integre testes automatizados.

1 INTERFACE VISUAL
1.1 Paginas publicas
1.1.1 Home exibindo apresentacao do restaurante e botao Reservar Mesa.
1.1.2 Pagina Menu publico listando categorias e itens.
1.1.3 Formulario Reserva Online com campos nome cpf telefone data hora quantidade restricao.
1.2 Paginas fluxo de chegada
1.2.1 Tela Leitura QR Checkin.
1.2.2 Tela Formulario Chegada Sem Reserva.
1.2.3 Tela Aguardando Mesa mostrando posicao na fila.
1.3 Paginas cliente na mesa
1.3.1 Tela PIN para desbloqueio da mesa.
1.3.2 Tela Cardapio Interativo com filtro categoria busca descricao.
1.3.3 Tela Carrinho com resumo e botao Confirmar Pedido.
1.3.4 Tela Acompanhar Pedido exibindo status e tempo estimado.
1.3.5 Tela Pagamento com botoes Pix ApplePay GooglePay SamsungPay Gerar Codigo Caixa.
1.3.6 Tela Feedback com estrelas e campo comentario.
1.4 Paginas staff
1.4.1 Painel Recepcao com fila reservas mesas status.
1.4.2 Painel Garcom listando mesas abertas e pedidos pendentes.
1.4.3 Painel Cozinha mostrando pedidos por categoria com botoes Em Preparo e Pronto.
1.4.4 Painel Caixa busca mesa processa pagamento registra pagamento manual.
1.4.5 Painel Gerente com dashboards reservas vendas estoque fidelidade.
1.5 Componentes reutilizaveis
1.5.1 Modal Confirmacao Generica.
1.5.2 Card Item de Menu.
1.5.3 Tabela Responsiva.
1.5.4 Toast Notificacao.

2 NAVEGACAO E ROTAS
2.1 Defina rotas para todas as paginas listadas.
2.2 Proteja rotas de staff com login e papel.
2.3 Redirecione cliente apos validar PIN para Tela Cardapio.
2.4 Use rotas dinamicas contendo o numero da mesa quando aplicavel.

3 FLUXOS DE USO
3.1 Fluxo reserva online
3.1.1 Cliente envia formulario.
3.1.2 Sistema cria reserva status pendente.
3.1.3 Sistema exibe QR de reserva e envia link por WhatsApp.
3.2 Fluxo chegada com reserva
3.2.1 Cliente escaneia QR de reserva.
3.2.2 Sistema valida reserva.
3.2.3 Sistema gera PIN exclusivo e bloqueia a mesa.
3.2.4 Sistema orienta cliente a sentar na mesa designada.
3.3 Fluxo chegada sem reserva
3.3.1 Cliente escaneia QR geral.
3.3.2 Se nao houver mesa livre mostrar Formulario Chegada.
3.3.3 Sistema cria entrada em fila virtual.
3.3.4 Sistema avisa via WhatsApp quando mesa estiver disponivel.
3.3.5 Sistema gera PIN e direciona o cliente a mesa.
3.4 Fluxo pedido na mesa
3.4.1 Cliente escaneia QR da mesa.
3.4.2 Sistema solicita PIN.
3.4.3 Sistema valida PIN e exibe Cardapio.
3.4.4 Cliente adiciona itens e confirma pedido.
3.4.5 Sistema cria pedido status aguardando.
3.4.6 Sistema envia itens ao Painel Cozinha.

3.5 Fluxo cozinha
3.5.1 Chef altera status para Em Preparo.
3.5.2 Chef altera status para Pronto.
3.5.3 Sistema notifica garcom e cliente.
3.6 Fluxo entrega garcom
3.6.1 Garcom seleciona pedido pronto.
3.6.2 Garcom marca Entregue.
3.6.3 Sistema atualiza status do pedido.
3.7 Fluxo pagamento digital
3.7.1 Cliente revisa comanda.
3.7.2 Cliente escolhe metodo digital.
3.7.3 Sistema gera requisicao de pagamento.
3.7.4 Sistema recebe confirmacao webhook.
3.7.5 Sistema marca pedido como pago.
3.7.6 Sistema emite QR de saida liberado.
3.8 Fluxo pagamento caixa
3.8.1 Cliente solicita Pagar no Caixa.
3.8.2 Sistema gera codigo da mesa.
3.8.3 Caixa localiza mesa e registra pagamento manual.
3.8.4 Sistema marca pedido como pago e libera saida.
3.9 Fluxo feedback e fidelidade
3.9.1 Apos pagamento exibir Tela Feedback.
3.9.2 Salvar estrelas e comentario.
3.9.3 Se cliente aceitar cadastrarse gerar pontos fidelidade.

4 FUNCOES DE NEGOCIO
4.1 Validar disponibilidade de mesa.
4.2 Gerar PIN unico com expiracao.
4.3 CRUD de reservas.
4.4 CRUD de mesas com status livre reservada ocupada bloqueada.
4.5 CRUD de itens e categorias de menu.
4.6 Criar pedido e permitir alterar ou cancelar enquanto em aguardando.
4.7 Atualizar status pedido ao longo do fluxo.
4.8 Notificar tempo estimado para cliente.
4.9 Processar pagamento digital via webhook.
4.10 Registrar pagamento manual no caixa.
4.11 Gerar relatorios de vendas reservas fila tempo medio.
4.12 Gerenciar estoque consumo descarte perdas.
4.13 Calcular pontos fidelidade e gerar cupons.

5 MODELO DE DADOS
5.1 users id nome telefone cpf role.
5.2 tables id numero lugares status pin.
5.3 reservations id userId tableId dataHora pessoas status pin qrcode.
5.4 menuCategories id nome.
5.5 menuItems id categoryId nome descricao preco alergenos.
5.6 orders id tableId reservationId status total createdAt closedAt.
5.7 orderItems id orderId menuItemId quantidade observacao.
5.8 payments id orderId metodo valor status transacaoId createdAt.
5.9 stock id nome unidade custo preco quantidade validade.
5.10 feedback id userId orderId estrelasEstab estrelasServico estrelasPagamento comentario createdAt.
5.11 loyalty id userId pontos tier updatedAt.

6 ENDPOINTS PRINCIPAIS
6.1 POST reservations.
6.2 GET reservations qr.
6.3 POST tables id pin.
6.4 POST orders.
6.5 PATCH orders id status.
6.6 POST payments.
6.7 POST webhooks pagamento.
6.8 GET menu.
6.9 POST feedback.
6.10 GET reports vendas.

7 INTEGRACOES EXTERNAS
7.1 WhatsApp enviar confirmacao reserva e alerta mesa pronta.
7.2 SMS fallback para fila virtual.
7.3 Provedor de pagamento digital para Pix e wallets.
7.4 Impressora fiscal opcional.

8 TESTES AUTOMATIZADOS
8.1 Testes de unidade para funcoes pin e fidelidade.
8.2 Testes de integracao reservas pedido pagamento.
8.3 Testes end to end cobrindo fluxo completo.

9 DOCUMENTACAO
9.1 Gerar arquivo openapi com todos endpoints.
9.2 Documentar modelos de dados e relacionamentos.
9.3 Incluir guia de deploy local e producao.

10 ENCERRAMENTO
10.1 Executar todos testes e garantir sucesso.
10.2 Publicar build producao.
10.3 Entregar link da aplicacao e credenciais para administradores.
