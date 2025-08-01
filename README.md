# Conversor de Moedas - 150 Moedas

Um conversor de moedas moderno e completo que suporta 150 moedas diferentes com atualizações em tempo real.

## Funcionalidades

- **150 Moedas**: Suporte completo para 150 moedas diferentes
- **Tempo Real**: Atualizações automáticas a cada 5 minutos
- **Interface Moderna**: Design responsivo e intuitivo
- **Conversão Universal**: Qualquer moeda pode converter para qualquer outra
- **Busca Inteligente**: Filtro de moedas para facilitar a seleção
- **Moedas Populares**: Acesso rápido às moedas mais utilizadas
- **Histórico de Taxas**: Informações detalhadas sobre taxas de câmbio

## Moedas Suportadas

O sistema inclui as principais moedas do mundo:

### Moedas Principais
- USD (Dólar Americano)
- EUR (Euro)
- BRL (Real Brasileiro)
- GBP (Libra Esterlina)
- JPY (Iene Japonês)
- CAD (Dólar Canadense)
- AUD (Dólar Australiano)
- CHF (Franco Suíço)
- CNY (Yuan Chinês)
- INR (Rúpia Indiana)

### E muitas outras moedas de diferentes países e regiões!

## Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **API**: AwesomeAPI (economia.awesomeapi.com.br)
- **Atualizações**: Node-cron para atualizações automáticas
- **Design**: CSS Grid, Flexbox, Gradientes modernos

## Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/seu-usuario/conversor-moedas.git
cd conversor-moedas
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Inicie o servidor**:
```bash
npm start
```

4. **Acesse a aplicação**:
Abra seu navegador e acesse: `http://localhost:3000`

## Desenvolvimento

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

## API Endpoints

### GET `/api/rates`
Retorna todas as taxas de câmbio atuais.

**Resposta:**
```json
{
  "rates": {
    "USD": 5.5979,
    "EUR": 6.39386,
    "BRL": 1,
    // ... outras moedas
  },
  "lastUpdate": "2025-08-01T04:10:00.000Z",
  "currencies": ["USD", "EUR", "BRL", ...]
}
```

### GET `/api/convert`
Converte um valor de uma moeda para outra.

**Parâmetros:**
- `from`: Moeda de origem
- `to`: Moeda de destino
- `amount`: Valor a ser convertido

**Exemplo:**
```
GET /api/convert?from=USD&to=BRL&amount=100
```

**Resposta:**
```json
{
  "from": "USD",
  "to": "BRL",
  "amount": 100,
  "convertedAmount": "559.79",
  "rate": "5.597900"
}
```

### GET `/api/currencies`
Retorna a lista de todas as moedas suportadas.

**Resposta:**
```json
{
  "currencies": ["USD", "EUR", "BRL", ...]
}
```

## Interface

### Características do Design
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Moderno**: Gradientes, sombras e animações suaves
- **Intuitivo**: Interface clara e fácil de usar
- **Acessível**: Contraste adequado e navegação por teclado

### Funcionalidades da Interface
- **Seleção de Moedas**: Dropdowns com todas as 150 moedas
- **Botão de Troca**: Troca rápida entre moedas de origem e destino
- **Conversão Automática**: Resultado atualizado em tempo real
- **Moedas Populares**: Grid com as moedas mais utilizadas
- **Busca**: Campo de busca para filtrar moedas
- **Status Online**: Indicador de conectividade com a API

## Atualizações em Tempo Real

O sistema atualiza automaticamente as taxas de câmbio:

- **Frequência**: A cada 5 minutos
- **Fonte**: API AwesomeAPI
- **Cache**: Dados armazenados em memória para performance
- **Fallback**: Taxas simuladas para moedas não disponíveis na API

## API Externa

O sistema utiliza a API [AwesomeAPI](https://economia.awesomeapi.com.br/) para obter taxas de câmbio em tempo real.

**Endpoint utilizado:**
```
https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL,GBP-BRL,JPY-BRL
```

## Responsividade

O design é totalmente responsivo e funciona em:

- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Layout otimizado para telas pequenas

## Deploy

### Heroku
```bash
heroku create seu-conversor-moedas
git push heroku main
```

### Vercel
```bash
vercel --prod
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Suporte

Se você encontrar algum problema ou tiver sugestões, por favor abra uma issue no GitHub.

## Agradecimentos

- [AwesomeAPI](https://economia.awesomeapi.com.br/) pela API de taxas de câmbio
- [Font Awesome](https://fontawesome.com/) pelos ícones
- [Google Fonts](https://fonts.google.com/) pela fonte Inter

---

**Desenvolvido com amor para facilitar conversões de moedas em tempo real!** 