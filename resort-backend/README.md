# 🏖️ Resort Platform - Backend

Backend completo para plataforma de gerenciamento de resort, desenvolvido em Node.js com TypeScript, Express e PostgreSQL.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração e Instalação](#configuração-e-instalação)
- [Banco de Dados](#banco-de-dados)
- [API Endpoints](#api-endpoints)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Segurança](#segurança)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Status do Projeto](#status-do-projeto)

## 🎯 Visão Geral

Este backend fornece uma API REST completa para gerenciamento de resort, incluindo:

- **Sistema de Autenticação**: Login, refresh token, controle de acesso por roles
- **Gestão de Usuários**: Administradores e funcionários
- **Gestão de Hóspedes**: Cadastro e informações dos clientes
- **Gestão de Quartos**: Disponibilidade, tipos, preços e status
- **Sistema de Reservas**: Criação, consulta e gerenciamento de reservas
- **Dashboard**: Estatísticas e visão geral do resort
- **Dados Meteorológicos**: Integração com API de clima
- **Minibar**: Controle de consumo e itens
- **Pagamentos**: Gestão de pagamentos e status
- **Notificações**: Sistema de notificações automáticas

## 🛠️ Tecnologias Utilizadas

### Core
- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação tipada
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional

### Autenticação e Segurança
- **JWT** - JSON Web Tokens para autenticação
- **bcryptjs** - Hash de senhas
- **helmet** - Middleware de segurança
- **express-rate-limit** - Rate limiting

### Validação e Utilitários
- **Joi** - Validação de dados
- **morgan** - Logging de requisições
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente
- **axios** - Cliente HTTP para APIs externas

### Desenvolvimento
- **nodemon** - Auto-reload em desenvolvimento
- **ts-node** - Execução de TypeScript
- **tsconfig-paths** - Resolução de paths

## 📁 Estrutura do Projeto

```
resort-backend/
├── src/
│   ├── controllers/          # Controladores da API
│   │   ├── authController.ts
│   │   ├── dashboardController.ts
│   │   ├── guestController.ts
│   │   ├── reservationController.ts
│   │   └── roomController.ts
│   ├── services/             # Lógica de negócio
│   │   ├── authService.ts
│   │   ├── dashboardService.ts
│   │   ├── guestService.ts
│   │   ├── reservationService.ts
│   │   └── roomService.ts
│   ├── routes/               # Definição de rotas
│   │   ├── auth.ts
│   │   ├── dashboard.ts
│   │   ├── guests.ts
│   │   ├── reservations.ts
│   │   └── rooms.ts
│   ├── middleware/           # Middlewares customizados
│   │   └── auth.ts
│   ├── database/             # Configuração e migrações do banco
│   │   ├── connection.ts
│   │   ├── migrate.ts
│   │   ├── migrations/
│   │   │   └── 001_create_tables.sql
│   │   └── seeds/
│   │       └── 001_create_admin.ts
│   ├── types/                # Definições de tipos TypeScript
│   │   └── index.ts
│   ├── utils/                # Utilitários e helpers
│   │   ├── responses.ts
│   │   └── validators.ts
│   └── server.ts             # Arquivo principal do servidor
├── dist/                     # Código compilado
├── package.json
├── tsconfig.json
├── nodemon.json
├── .env
└── README.md
```

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

### Passos para Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd resort-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo .env.example (se existir) ou crie um novo
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados**
```bash
# Execute as migrações
npm run migrate

# Crie o usuário administrador inicial
npm run seed
```

5. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🗄️ Banco de Dados

### Estrutura das Tabelas

#### Users
- Gestão de usuários do sistema (admin/employee)
- Autenticação e autorização
- Campos: id, name, email, password, role, created_at, updated_at, last_login

#### Guests
- Cadastro de hóspedes
- Informações pessoais e preferências
- Campos: id, name, email, phone, document, address, created_at, updated_at

#### Rooms
- Gestão de quartos
- Tipos, capacidades, preços e status
- Campos: id, number, type, capacity, price_per_night, status, created_at, updated_at

#### Reservations
- Sistema de reservas
- Relacionamento com hóspedes e quartos
- Campos: id, guest_id, room_id, check_in_date, check_out_date, total_amount, status, created_at, updated_at

#### Minibar Items & Consumption
- Catálogo de itens do minibar
- Controle de consumo por reserva

#### Payments
- Gestão de pagamentos
- Status e métodos de pagamento

#### Notifications
- Sistema de notificações automáticas
- Lembretes de check-in/check-out

### Índices e Performance
- Índices otimizados para consultas frequentes
- Triggers para atualização automática de timestamps
- Constraints de integridade referencial

## 🔌 API Endpoints

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/login` | Login de usuário | Público |
| POST | `/refresh` | Renovar token de acesso | Público |
| GET | `/profile` | Obter perfil do usuário | Autenticado |
| GET | `/logout` | Logout do usuário | Autenticado |
| POST | `/users` | Criar novo usuário | Admin |
| GET | `/users` | Listar usuários | Admin |

### Dashboard (`/api/dashboard`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/overview` | Visão geral do dashboard | Autenticado |
| GET | `/weather` | Dados meteorológicos | Autenticado |
| GET | `/occupancy` | Gráficos de ocupação | Autenticado |

### Hóspedes (`/api/guests`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/` | Listar hóspedes | Autenticado |
| GET | `/:id` | Obter hóspede por ID | Autenticado |
| POST | `/` | Criar novo hóspede | Autenticado |
| PUT | `/:id` | Atualizar hóspede | Autenticado |
| DELETE | `/:id` | Deletar hóspede | Autenticado |

### Quartos (`/api/rooms`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/` | Listar quartos | Autenticado |
| GET | `/:id` | Obter quarto por ID | Autenticado |
| POST | `/` | Criar novo quarto | Admin |
| PUT | `/:id` | Atualizar quarto | Admin |
| DELETE | `/:id` | Deletar quarto | Admin |
| GET | `/availability` | Verificar disponibilidade | Autenticado |

### Reservas (`/api/reservations`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/` | Listar reservas | Autenticado |
| GET | `/:id` | Obter reserva por ID | Autenticado |
| POST | `/` | Criar nova reserva | Autenticado |
| PUT | `/:id` | Atualizar reserva | Autenticado |
| DELETE | `/:id` | Cancelar reserva | Autenticado |
| POST | `/:id/checkin` | Realizar check-in | Autenticado |
| POST | `/:id/checkout` | Realizar check-out | Autenticado |
| GET | `/today/checkouts` | Check-outs de hoje | Autenticado |
| GET | `/today/checkins` | Check-ins de hoje | Autenticado |

### Minibar (`/api/minibar`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/items` | Listar todos os itens | Autenticado |
| GET | `/items/:id` | Obter item por ID | Autenticado |
| POST | `/items` | Criar novo item | Admin |
| PUT | `/items/:id` | Atualizar item | Admin |
| DELETE | `/items/:id` | Deletar item | Admin |
| GET | `/items/category/:category` | Itens por categoria | Autenticado |
| GET | `/categories` | Listar categorias | Autenticado |
| POST | `/consumption` | Registrar consumo | Autenticado |
| GET | `/consumption/reservation/:reservationId` | Consumo por reserva | Autenticado |
| GET | `/consumption/period` | Consumo por período | Autenticado |
| GET | `/consumption/total/:reservationId` | Total de consumo por reserva | Autenticado |
| GET | `/consumption/stats` | Estatísticas de consumo | Autenticado |
| GET | `/consumption/item/:itemId` | Consumo por item | Autenticado |

### Pagamentos (`/api/payments`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/` | Listar todos os pagamentos | Autenticado |
| GET | `/:id` | Obter pagamento por ID | Autenticado |
| POST | `/` | Criar novo pagamento | Autenticado |
| PUT | `/:id` | Atualizar pagamento | Autenticado |
| DELETE | `/:id` | Deletar pagamento | Autenticado |
| GET | `/reservation/:reservationId` | Pagamentos por reserva | Autenticado |
| GET | `/reservation/:reservationId/total` | Total pago por reserva | Autenticado |
| GET | `/reservation/:reservationId/balance` | Saldo pendente por reserva | Autenticado |
| POST | `/process` | Processar pagamento | Autenticado |
| POST | `/:id/refund` | Reembolsar pagamento | Autenticado |
| GET | `/stats/overview` | Estatísticas de pagamentos | Autenticado |
| GET | `/stats/period` | Pagamentos por período | Autenticado |
| GET | `/stats/method/:method` | Pagamentos por método | Autenticado |
| GET | `/methods/available` | Métodos de pagamento disponíveis | Autenticado |

### Notificações (`/api/notifications`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/` | Listar todas as notificações | Autenticado |
| GET | `/:id` | Obter notificação por ID | Autenticado |
| POST | `/` | Criar nova notificação | Autenticado |
| PUT | `/:id` | Atualizar notificação | Autenticado |
| DELETE | `/:id` | Deletar notificação | Autenticado |
| GET | `/reservation/:reservationId` | Notificações por reserva | Autenticado |
| GET | `/type/:type` | Notificações por tipo | Autenticado |
| POST | `/send` | Enviar notificação | Autenticado |
| POST | `/checkout/1h/:reservationId` | Criar notificação check-out 1h | Autenticado |
| POST | `/checkout/30min/:reservationId` | Criar notificação check-out 30min | Autenticado |
| POST | `/checkin/:reservationId` | Criar notificação check-in | Autenticado |
| POST | `/payment/:reservationId` | Criar notificação pagamento | Autenticado |
| POST | `/minibar/:reservationId` | Criar notificação minibar | Autenticado |
| POST | `/system/alert` | Criar alerta do sistema | Autenticado |
| POST | `/process/pending` | Processar notificações pendentes | Autenticado |
| POST | `/process/automatic` | Verificar notificações automáticas | Autenticado |
| GET | `/stats/overview` | Estatísticas de notificações | Autenticado |
| GET | `/stats/period` | Notificações por período | Autenticado |
| GET | `/types/available` | Tipos de notificação disponíveis | Autenticado |

### Upload de Arquivos (`/api/upload`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/` | Listar todos os arquivos | Autenticado |
| GET | `/:id` | Obter arquivo por ID | Autenticado |
| POST | `/` | Upload de arquivo genérico | Autenticado |
| PUT | `/:id` | Atualizar arquivo | Autenticado |
| DELETE | `/:id` | Deletar arquivo | Autenticado |
| GET | `/entity/:entityType/:entityId` | Arquivos por entidade | Autenticado |
| GET | `/category/:category` | Arquivos por categoria | Autenticado |
| GET | `/download/:id` | Download de arquivo | Autenticado |
| GET | `/view/:id` | Visualizar arquivo (imagens) | Autenticado |
| POST | `/room/:roomId/image` | Upload imagem de quarto | Autenticado |
| POST | `/guest/:guestId/document` | Upload documento de hóspede | Autenticado |
| POST | `/payment/:paymentId/receipt` | Upload comprovante de pagamento | Autenticado |
| POST | `/maintenance/cleanup` | Limpar arquivos órfãos | Autenticado |
| GET | `/stats/overview` | Estatísticas de upload | Autenticado |
| GET | `/config/:category` | Configurações de upload | Autenticado |
| GET | `/categories/available` | Categorias disponíveis | Autenticado |

### Relatórios (`/api/reports`)

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/generate` | Gerar relatório genérico | Autenticado |
| GET | `/financial` | Relatório financeiro | Autenticado |
| GET | `/occupancy` | Relatório de ocupação | Autenticado |
| GET | `/minibar` | Relatório de minibar | Autenticado |
| GET | `/notifications` | Relatório de notificações | Autenticado |
| POST | `/custom` | Relatório personalizado | Autenticado |
| GET | `/types/available` | Tipos de relatório disponíveis | Autenticado |
| GET | `/formats/available` | Formatos de exportação disponíveis | Autenticado |
| GET | `/stats/overview` | Estatísticas de relatórios | Autenticado |
| GET | `/quick/dashboard` | Relatório rápido de dashboard | Autenticado |

### Health Check
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status do servidor |

## 🔐 Autenticação e Autorização

### Sistema de Tokens
- **Access Token**: JWT com duração de 15 minutos
- **Refresh Token**: JWT com duração de 7 dias
- Renovação automática de tokens

### Roles e Permissões
- **Admin**: Acesso completo ao sistema
- **Employee**: Acesso limitado às funcionalidades operacionais

### Middleware de Segurança
- Autenticação obrigatória para rotas protegidas
- Autorização baseada em roles
- Rate limiting para prevenir ataques

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- [x] Login com email e senha
- [x] Refresh token automático
- [x] Controle de acesso por roles
- [x] Logout seguro
- [x] Validação de dados de entrada

### ✅ Gestão de Usuários
- [x] Criação de usuários (admin)
- [x] Listagem de usuários
- [x] Perfis de usuário
- [x] Senhas criptografadas

### ✅ Dashboard e Estatísticas
- [x] Visão geral do dashboard
- [x] Estatísticas de quartos
- [x] Estatísticas de reservas
- [x] Estatísticas de hoje
- [x] Estatísticas de receita
- [x] Gráficos de ocupação por mês
- [x] Integração com API de clima

### ✅ Gestão de Hóspedes
- [x] CRUD completo de hóspedes
- [x] Validação de dados
- [x] Busca por ID

### ✅ Gestão de Quartos
- [x] CRUD completo de quartos
- [x] Verificação de disponibilidade
- [x] Controle de status (available, occupied, cleaning, maintenance)
- [x] Tipos e capacidades

### ✅ Sistema de Reservas
- [x] CRUD completo de reservas
- [x] Check-in e check-out
- [x] Cálculo automático de valores
- [x] Controle de status
- [x] Relacionamento com hóspedes e quartos
- [x] Consultas de check-ins/check-outs do dia

### ✅ Sistema de Minibar
- [x] CRUD completo de itens do minibar
- [x] Categorização de itens (Bebidas, Snacks, Higiene, etc.)
- [x] Registro de consumo por reserva
- [x] Cálculo automático de valores
- [x] Estatísticas de consumo
- [x] Relatórios por período e item
- [x] Validação de reservas ativas
- [x] 37 itens pré-cadastrados

### ✅ Sistema de Pagamentos
- [x] CRUD completo de pagamentos
- [x] Múltiplos métodos de pagamento (Cartão, PIX, Dinheiro, etc.)
- [x] Processamento de pagamentos
- [x] Sistema de reembolsos
- [x] Controle de saldo por reserva
- [x] Estatísticas e relatórios financeiros
- [x] Validação de reservas ativas
- [x] Transações com rollback automático

### ✅ Sistema de Notificações
- [x] CRUD completo de notificações
- [x] Múltiplos tipos de notificação (Check-in, Check-out, Pagamento, etc.)
- [x] Notificações automáticas baseadas em eventos
- [x] Sistema de envio simulado (preparado para email/SMS)
- [x] Processamento em lote de notificações pendentes
- [x] Estatísticas e relatórios de notificações
- [x] Validação de reservas ativas
- [x] 6 tipos de notificação pré-configurados

### ✅ Sistema de Upload de Arquivos
- [x] CRUD completo de uploads de arquivos
- [x] 4 categorias de upload (Imagens de quartos, Documentos de hóspedes, Comprovantes de pagamento, Arquivos do sistema)
- [x] Validação de tipos de arquivo e tamanhos
- [x] Geração automática de nomes únicos
- [x] Download e visualização de arquivos
- [x] Uploads específicos por entidade
- [x] Limpeza automática de arquivos órfãos
- [x] Estatísticas e relatórios de upload

### ✅ Sistema de Relatórios Avançados
- [x] 4 tipos de relatórios principais (Financeiro, Ocupação, Minibar, Notificações)
- [x] 4 formatos de exportação (PDF, Excel, CSV, JSON)
- [x] Relatórios personalizados com queries SQL seguras
- [x] Relatórios rápidos de dashboard
- [x] Filtros por período e parâmetros customizados
- [x] Estatísticas detalhadas e análises
- [x] Validação de segurança para queries personalizadas

### ✅ Estrutura de Banco de Dados
- [x] Migrações SQL
- [x] Seeds para dados iniciais
- [x] Índices otimizados
- [x] Triggers automáticos

### ✅ Serviços de Negócio
- [x] AuthService - Autenticação e usuários
- [x] DashboardService - Estatísticas e dashboard
- [x] GuestService - Gestão de hóspedes
- [x] ReservationService - Gestão de reservas
- [x] RoomService - Gestão de quartos
- [x] MinibarService - Gestão de minibar e consumo
- [x] PaymentService - Gestão de pagamentos e transações
- [x] NotificationService - Gestão de notificações e alertas
- [x] UploadService - Gestão de uploads e arquivos
- [x] ReportService - Geração e exportação de relatórios

### ✅ Utilitários e Helpers
- [x] ResponseHandler - Padronização de respostas
- [x] Validators - Validação com Joi
- [x] Tipos TypeScript - Interface definitions

### ✅ Concluído
- Estrutura base do projeto
- Sistema de autenticação completo
- Configuração de banco de dados
- Middlewares de segurança
- Validação de dados
- Padronização de respostas
- Dashboard com estatísticas
- CRUD completo de hóspedes
- CRUD completo de quartos
- CRUD completo de reservas
- Sistema de check-in/check-out
- Integração com API de clima
- Verificação de disponibilidade de quartos
- Sistema completo de minibar com 37 itens
- Sistema completo de pagamentos com múltiplos métodos
- Sistema completo de notificações com 6 tipos automáticos
- Sistema completo de upload de arquivos com 4 categorias
- Sistema completo de relatórios avançados com 4 tipos e 4 formatos

### 🔄 Em Andamento
- Testes automatizados

## 🛡️ Segurança

### Implementações de Segurança
- **Helmet**: Headers de segurança HTTP
- **CORS**: Configuração de origens permitidas
- **Rate Limiting**: Proteção contra ataques de força bruta
- **JWT**: Tokens seguros para autenticação
- **bcrypt**: Hash seguro de senhas
- **Validação**: Sanitização de dados de entrada

### Boas Práticas
- Variáveis de ambiente para configurações sensíveis
- Logs de erro sem exposição de informações sensíveis
- Validação rigorosa de dados de entrada
- Controle de acesso baseado em roles

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor com nodemon
npm run build        # Compila TypeScript
npm start           # Inicia servidor em produção

# Banco de Dados
npm run migrate     # Executa migrações
npm run seed        # Cria usuário admin inicial
npm run reset-admin # Reseta senha do admin

# Testes
npm test           # Executa testes
npm run test:watch # Executa testes em modo watch
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resort_db
DB_USER=postgres
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_REFRESH_SECRET=seu_refresh_secret_super_seguro

# Frontend
FRONTEND_URL=http://localhost:3000

# API Externa
WEATHER_API_KEY=sua_chave_api_clima
```

## 👤 Usuário Administrador Padrão

Após executar `npm run seed`, o seguinte usuário será criado:

- **Email**: admin@resort.com
- **Senha**: Admin@123$
- **Role**: admin

⚠️ **Importante**: Altere a senha do administrador após o primeiro login!

## 📊 Status do Projeto

### ✅ Concluído
- Estrutura base do projeto
- Sistema de autenticação completo
- Configuração de banco de dados
- Middlewares de segurança
- Validação de dados
- Padronização de respostas
- Dashboard com estatísticas
- CRUD completo de hóspedes
- CRUD completo de quartos
- CRUD completo de reservas
- Sistema de check-in/check-out
- Integração com API de clima
- Verificação de disponibilidade de quartos
- Sistema completo de minibar com 37 itens
- Sistema completo de pagamentos com múltiplos métodos
- Sistema completo de notificações com 6 tipos automáticos
- Sistema completo de upload de arquivos com 4 categorias

### 🔄 Em Andamento
- Relatórios avançados

### 📋 Próximos Passos
- Testes automatizados
- Documentação da API (Swagger)
- Dockerização

## 🚀 Como Usar

### 1. Iniciar o Servidor
```bash
npm run dev
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@resort.com",
    "password": "Admin@123$"
  }'
```

### 3. Usar o Token
```bash
curl -X GET http://localhost:3001/api/dashboard/overview \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Bruno Jatoba**
- Email: [seu-email@exemplo.com]
- LinkedIn: [seu-linkedin]

---

**Desenvolvido com ❤️ para a plataforma de resort**
