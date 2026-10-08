# API de Usuários — NestJS + Prisma + Swagger

Projeto acadêmico baseado no passo a passo da UC de Programação Web II (Senac RJ).

## Stack

- Node.js 24 LTS
- NestJS 12.0.3
- Prisma 7.10.0
- MySQL
- JWT
- Swagger / OpenAPI

## Importante sobre o banco

O banco da disciplina **já existe**. Por isso este projeto usa introspecção (`prisma db pull`) e **não** usa `prisma migrate dev`.

## 1. Instalar dependências

```bash
npm install
```

## 2. Configurar o `.env`

Copie `.env.example` para `.env`:

```powershell
Copy-Item .env.example .env
```

Preencha a `DATABASE_URL` com os dados da página inicial da UC.

Formato:

```env
DATABASE_URL="mysql://USUARIO:SENHA@HOST:3306/NOME_DO_BANCO"
JWT_SECRET=SEU_SEGREDO_COM_PELO_MENOS_32_CARACTERES
JWT_EXPIRES_IN=1h
PORT=3000
```

Para gerar o segredo JWT:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

> Nunca envie o `.env` para o GitHub.

## 3. Conferir / ler o banco existente

O material da aula orienta rodar primeiro a introspecção:

```bash
npx prisma db pull
```

**Atenção:** `db pull` sobrescreve `prisma/schema.prisma`. Como o material pede alguns ajustes manuais após a introspecção (nomes `User`, `Address`, `Contact`, `@@map`, `@map`, defaults e `moduleFormat`), compare o schema gerado com o schema já incluído neste projeto antes de salvar alterações.

Depois gere o client:

```bash
npm run prisma:generate
```

## 4. Rodar

```bash
npm run start:dev
```

Acesse:

- API: http://localhost:3000
- Health check: http://localhost:3000/health
- Swagger: http://localhost:3000/docs

## Rotas de usuários

| Método | Rota | Acesso |
|---|---|---|
| GET | `/user` | Público |
| GET | `/user/:id` | Público |
| POST | `/user` | Público |
| PUT | `/user/:id` | Próprio usuário ou admin |
| DELETE | `/user/:id` | Somente admin |
| POST | `/login` | Público |

## Segurança implementada

- senha armazenada com bcrypt (custo 12)
- senha omitida globalmente das consultas Prisma
- `role` não existe no DTO público de cadastro
- validação global com `whitelist`, `forbidNonWhitelisted` e `transform`
- autenticação JWT global (nega por padrão)
- autorização por perfil para DELETE
- usuário comum só pode atualizar o próprio cadastro
- apenas admin pode alterar `role`
- rate limit no login
- Helmet
- erros conhecidos do Prisma traduzidos para HTTP

## Teste sem alterar o banco

Se você não quiser escrever nada no banco compartilhado, teste apenas:

1. `GET /health`
2. `GET /user`
3. `GET /user/{id}` com um ID existente

Isso valida conexão, Prisma, NestJS e Swagger sem criar/alterar/remover registros.

## Observação sobre administrador

O passo a passo da aula prevê que o primeiro admin seja criado fora da API. O `POST /user` sempre força `role: "user"`.
