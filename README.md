# PDCA da Fábrica

Site para registrar e acompanhar ciclos PDCA, compartilhado entre todos os computadores.

## Variáveis de ambiente
- `DATABASE_URL`: endereço de um banco Postgres (obrigatório em produção, senão os dados somem quando o servidor reinicia)
- `ACCESS_PASSWORD`: senha de acesso ao site (opcional, mas recomendada)

## Rodar no seu PC
    npm install
    npm start
Abra http://localhost:3000 (sem `DATABASE_URL`, salva em `data.json`).

## Publicar (GitHub + Render)
1. Crie um repositório no GitHub e envie estes arquivos.
2. No Render: New > Web Service > escolha o repositório.
   Build Command: `npm install` | Start Command: `npm start`
3. Em Environment, adicione `ACCESS_PASSWORD` e `DATABASE_URL`.
4. Deploy. O link `https://SEU-APP.onrender.com` já funciona em qualquer computador.
