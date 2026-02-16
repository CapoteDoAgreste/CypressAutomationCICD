FROM node:22-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código da aplicação
COPY . .

# Expor porta do Vite
EXPOSE 3000

# Executar aplicação em modo desenvolvimento
CMD ["npm", "run", "dev"]

