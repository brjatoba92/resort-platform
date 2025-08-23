# Resort Platform Frontend

Frontend da plataforma de gerenciamento de resort, desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades Implementadas

### 🔐 Autenticação e Autorização
- Sistema de login e registro
- Proteção de rotas
- Gerenciamento de tokens JWT
- Refresh token automático

### 📱 Layout e Componentes
- Layout responsivo com header e footer
- Páginas com lazy loading
- Componentes modulares com CSS Modules
- Design system consistente

#### Componentes da Landing Page
- **Hero Section**: Banner principal com chamadas para ação
- **Features Section**: Recursos do resort com ícones e animações
- **Room Showcase**: Exibição dos tipos de quartos disponíveis
- **Testimonials Section**: Depoimentos de hóspedes

### 🎣 Hooks Personalizados
- `useAuth`: Gerenciamento de autenticação
- `useApi`: Cliente HTTP com interceptors
- `useWebSocket`: Conexão WebSocket com reconexão automática
- `useEventNotifications`: Notificações em tempo real
- `useRealTimeData`: Dados em tempo real
- `useLocalStorage`: Persistência local
- `useTheme`: Gerenciamento de tema
- `useLanguage`: Internacionalização
- `useNotification`: Sistema de notificações
- `useReservations`: Gerenciamento de reservas

### 🔄 Serviços
#### API Services
- Autenticação
- Dashboard
- Funcionários
- Hóspedes
- Pagamentos
- Reservas
- Quartos
- Previsão do tempo

#### Storage Services
- LocalStorage
- SessionStorage
- Gerenciamento de expiração
- Tipagem forte

#### WebSocket Services
- Conexão em tempo real
- Sistema pub/sub
- Reconexão automática
- Heartbeat
- Atualizações de quartos

### 🌍 Contextos
- `AuthContext`: Contexto de autenticação
- `NotificationContext`: Sistema de notificações
- `ThemeContext`: Gerenciamento de tema
- `LanguageContext`: Internacionalização
- `AppProviders`: Composição de providers

### 📄 Páginas
- Home (Landing)
- Login
- Registro
- Dashboard
- Quartos
- Detalhes do Quarto
- Reservas
- Nova Reserva
- Serviços
- Contato
- 404

## 🛠️ Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- CSS Modules

## 📦 Estrutura de Diretórios

```
src/
├── components/
│   ├── landing/
│   │   ├── FeaturesSection/
│   │   ├── HeroSection/
│   │   ├── RoomShowcase/
│   │   └── TestimonialsSection/
│   └── layout/
│       ├── Footer/
│       ├── Header/
│       └── Layout/
├── context/
│   ├── AuthContext.tsx
│   ├── NotificationContext.tsx
│   ├── ThemeContext.tsx
│   ├── LanguageContext.tsx
│   └── AppProviders.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useWebSocket.ts
│   ├── useEventNotifications.ts
│   ├── useRealTimeData.ts
│   ├── useLocalStorage.ts
│   ├── useTheme.ts
│   ├── useLanguage.ts
│   ├── useNotification.ts
│   └── useReservations.ts
├── pages/
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   ├── Dashboard/
│   ├── Rooms/
│   ├── RoomDetails/
│   ├── Reservations/
│   ├── NewReservation/
│   ├── Services/
│   ├── Contact/
│   └── NotFound/
├── services/
│   ├── api/
│   ├── storage/
│   └── websocket/
└── types/
```

## 🚀 Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto:
```bash
npm start
```

O projeto estará disponível em `http://localhost:3000`

## 📝 Notas de Desenvolvimento

- Utilização de CSS Modules para evitar conflitos de estilo
- Implementação de lazy loading para melhor performance
- Sistema de rotas protegidas
- Gerenciamento de estado com Context API
- Tipagem forte com TypeScript
- Design responsivo e mobile-first
- Componentização para reusabilidade
- Integração com WebSocket para dados em tempo real
- Sistema robusto de autenticação e autorização

## 🔜 Próximos Passos

- [ ] Implementar testes unitários
- [ ] Adicionar Storybook para documentação de componentes
- [ ] Melhorar acessibilidade
- [ ] Implementar PWA
- [ ] Adicionar animações com Framer Motion
- [ ] Implementar sistema de busca
- [ ] Adicionar filtros avançados
- [ ] Implementar sistema de reviews
- [ ] Adicionar suporte a múltiplos idiomas
- [ ] Implementar modo offline