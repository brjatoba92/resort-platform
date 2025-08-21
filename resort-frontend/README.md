# Resort Platform Frontend

Este projeto é o frontend do sistema de gerenciamento de resort, construído com React, TypeScript e Tailwind CSS.

## Tecnologias Implementadas

- React com TypeScript
- Tailwind CSS para estilização
- Sistema de tema claro/escuro
- Plugins do Tailwind:
  - @tailwindcss/forms
  - @tailwindcss/typography
  - @tailwindcss/aspect-ratio

## Configurações de Tema

### Cores Personalizadas
- **Primary**: Escala de azuis (50-900)
- **Secondary**: Escala de ciano/turquesa (50-900)
- **Resort**:
  - sand: '#f4f1ea'
  - ocean: '#0891b2'
  - sunset: '#f59e0b'
  - palm: '#059669'
- **Estados dos Quartos**:
  - occupied: Vermelho
  - reserved: Amarelo/Laranja
  - available: Verde
  - maintenance: Cinza

### Tipografia
- Sans: Inter
- Heading: Poppins

### Animações Personalizadas
- fade-in
- slide-up
- bounce-soft

### Utilitários Adicionais
- Espaçamentos customizados (18, 88)
- Border radius estendido (xl, 2xl, 3xl)
- Sombras personalizadas (soft, medium, strong)

## Scripts Disponíveis

### `npm start`

Executa o aplicativo no modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para visualizar no navegador.

A página será recarregada se você fizer edições.\
Você também verá quaisquer erros de lint no console.

### `npm test`

Inicia o executor de teste no modo de observação interativo.\
Consulte a seção sobre [execução de testes](https://facebook.github.io/create-react-app/docs/running-tests) para mais informações.

### `npm run build`

Compila o aplicativo para produção na pasta `build`.\
Ele agrupa corretamente o React no modo de produção e otimiza a compilação para obter o melhor desempenho.

A compilação é minificada e os nomes dos arquivos incluem os hashes.\
Seu aplicativo está pronto para ser implantado!

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes React reutilizáveis
  ├── services/      # Serviços de API, WebSocket e Storage
  ├── store/         # Gerenciamento de estado
  ├── types/         # Definições de tipos TypeScript
  └── utils/         # Utilitários e helpers
```

## Configuração de Desenvolvimento

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

## Contribuindo

Por favor, certifique-se de que todas as alterações seguem os padrões de código estabelecidos e incluem testes apropriados.