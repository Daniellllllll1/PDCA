# PDCA da Fábrica

Site e aplicativo PWA (com suporte offline) para registrar e acompanhar ciclos PDCA, compartilhado entre computadores e celulares.

## Variáveis de ambiente
- `DATABASE_URL`: endereço de um banco Postgres (obrigatório em produção, senão os dados somem quando o servidor reinicia)
- `ACCESS_PASSWORD`: senha de acesso ao site (opcional, mas recomendada)

## Rodar no seu PC
    npm install
    npm start
Abra http://localhost:3000 (sem `DATABASE_URL`, salva em `data.json`).

## Gerar APK Android (sem instalar nada no PC)
1. Suba estes arquivos para o GitHub e publique no Render.
2. Acesse `https://www.pwabuilder.com`, cole o link `https://SEU-APP.onrender.com` e baixe o pacote Android (`.apk`).
