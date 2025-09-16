```markdown
# 🏭 Content Zavod - Backend API

Профессиональная платформа для автоматизации создания и публикации контента в социальных сетях. Полный цикл от генерации идей до аналитики эффективности.

## 🚀 Технологический стек

### Core Framework

- **Express.js** (v4.18.2) - Минималистичный веб-фреймворк для Node.js
- **TypeScript** (v5.2.2) - Статическая типизация для JavaScript
- **tsx** (v4.6.2) - TypeScript runtime и REPL

### База данных & Auth

- **Supabase** (v2.38.0) - Open-source Firebase альтернатива
  - PostgreSQL с реальным временем
  - Авторизация и аутентификация
  - Row Level Security
- **@supabase/supabase-js** - Клиентская библиотека

### Валидация & Безопасность

- **Zod** (v3.22.4) - Schema validation с TypeScript inference
- **Helmet** (v7.1.0) - Защита HTTP headers
- **express-rate-limit** (v7.1.5) - Rate limiting middleware
- **bcryptjs** (v2.4.3) - Хеширование паролей
- **jsonwebtoken** (v9.0.2) - JWT tokens

### Логирование & Мониторинг

- **Pino** (v8.17.4) - Высокопроизводительный логгер
- **Pino-pretty** (v10.3.1) - Pretty printing для Pino

### HTTP Клиенты

- **Axios** (v1.6.2) - HTTP client для API запросов
- **CORS** (v2.8.5) - Cross-Origin Resource Sharing

### Утилиты

- **Dotenv** (v16.3.1) - Загрузка переменных окружения

## 📁 Архитектура проекта
```

backend/
├── src/
│ ├── types/ # TypeScript type definitions
│ │ ├── express.d.ts # Express type extensions
│ │ └── index.ts # Main application types
│ ├── config/ # Configuration management
│ │ └── index.ts # Environment configuration
│ ├── controllers/ # Request handlers
│ │ ├── auth.controller.ts # Authentication logic
│ │ ├── content.controller.ts # Content management
│ │ ├── analytics.controller.ts # Analytics processing
│ │ └── profile.controller.ts # User profile operations
│ ├── routes/ # API route definitions
│ │ ├── auth.routes.ts # Authentication routes
│ │ ├── content.routes.ts # Content routes
│ │ ├── analytics.routes.ts # Analytics routes
│ │ ├── profile.routes.ts # Profile routes
│ │ └── index.ts # Routes aggregation
│ ├── services/ # Business logic services
│ │ ├── n8n.service.ts # n8n automation integration
│ │ ├── supabase.service.ts # Database operations
│ │ ├── ai.service.ts # AI content generation
│ │ └── social.service.ts # Social media integration
│ ├── middleware/ # Express middleware
│ │ ├── auth.middleware.ts # Authentication middleware
│ │ ├── validation.middleware.ts # Request validation
│ │ ├── error.middleware.ts # Error handling
│ │ ├── rateLimit.middleware.ts # Rate limiting
│ │ └── index.ts # Middleware exports
│ ├── models/ # Data models
│ │ ├── User.ts # User model
│ │ ├── Content.ts # Content model
│ │ └── Analytics.ts # Analytics model
│ ├── dtos/ # Data Transfer Objects
│ │ ├── auth.dto.ts # Auth validation schemas
│ │ ├── content.dto.ts # Content validation
│ │ └── analytics.dto.ts # Analytics validation
│ ├── utils/ # Utility functions
│ │ ├── logger.ts # Logging configuration
│ │ ├── helpers.ts # Helper functions
│ │ └── constants.ts # Application constants
│ ├── exceptions/ # Custom exceptions
│ │ └── AppError.ts # Application error class
│ └── index.ts # Application entry point
├── n8n-workflows/ # n8n workflow configurations
├── supabase/ # Database migrations
│ └── migrations/
│ └── 001_init_schema.sql # Initial database schema
├── .env.example # Environment variables template
├── .gitignore # Git ignore rules
├── tsconfig.json # TypeScript configuration
├── package.json # Dependencies and scripts
└── Dockerfile # Container configuration

````

## 🏗️ Структура базы данных

### Таблицы Supabase

```sql
-- Пользователи
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    company TEXT,
    expertise TEXT,
    phone TEXT,
    website TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Контент
CREATE TABLE content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    niche TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('video', 'text', 'combination')),
    generated_content JSONB,
    platforms TEXT[] NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Аналитика
CREATE TABLE content_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES content(id),
    platform TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Социальные аккаунты
CREATE TABLE social_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    platform TEXT NOT NULL,
    username TEXT NOT NULL,
    credentials JSONB,
    followers INTEGER DEFAULT 0,
    last_sync TIMESTAMPTZ,
    is_connected BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
````

## 🔐 API Endpoints

### Аутентификация (`/api/auth`)

- `POST /register` - Регистрация пользователя
- `POST /login` - Вход в систему
- `POST /logout` - Выход из системы
- `GET /profile` - Получение профиля пользователя

### Контент (`/api/content`)

- `POST /generate` - Генерация контента через AI
- `POST /publish` - Публикация контента
- `GET /list` - Список контента пользователя
- `PUT /:id` - Обновление контента

### Аналитика (`/api/analytics`)

- `GET /content/:contentId` - Аналитика по конкретному контенту
- `GET /user` - Общая аналитика пользователя

### Профиль (`/api/profile`)

- `PUT /` - Обновление профиля
- `POST /social/connect` - Подключение соц. аккаунта
- `POST /social/disconnect` - Отключение соц. аккаунта

## 🛠️ Установка и запуск

### Предварительные требования

- Node.js 18+
- PostgreSQL 12+
- Supabase account
- n8n instance

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/content-zavod-backend.git
cd content-zavod-backend
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка окружения

```bash
cp .env.example .env
```

Заполните `.env` файл:

```env
PORT=3000
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

N8N_URL=https://your-n8n-instance.com
N8N_API_KEY=your_n8n_api_key

JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

### 4. Запуск миграций

```bash
# Выполните миграции в Supabase SQL editor
psql -h your-supabase-url -U postgres -f supabase/migrations/001_init_schema.sql
```

### 5. Запуск приложения

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run type-check
```

## 🐳 Docker deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

USER node

CMD ["node", "dist/index.js"]
```

### Docker Compose

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
      - N8N_URL=${N8N_URL}
      - N8N_API_KEY=${N8N_API_KEY}
    depends_on:
      - redis

  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=false
    volumes:
      - n8n_data:/home/node/.n8n

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  n8n_data:
```

## 📊 Интеграция с n8n

### Workflow конфигурации

```json
{
  "workflows": {
    "ai-content-generation": {
      "trigger": "webhook",
      "operations": [
        {
          "type": "openai",
          "params": {
            "model": "gpt-4",
            "prompt": "Generate content about {{ $json.topic }}"
          }
        },
        {
          "type": "format",
          "params": {
            "template": "Generated content: {{ $json.choices[0].message.content }}"
          }
        }
      ]
    },
    "content-publishing": {
      "trigger": "schedule",
      "operations": [
        {
          "type": "social-media",
          "params": {
            "platform": "{{ $json.platform }}",
            "content": "{{ $json.content }}"
          }
        }
      ]
    }
  }
}
```

## 🔧 Конфигурация

### TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  }
}
```

### Environment Variables Validation

```typescript
const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string(),
  N8N_URL: z.string().url(),
  N8N_API_KEY: z.string(),
  JWT_SECRET: z.string(),
});
```

## 🧪 Тестирование

### Запуск тестов

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Test coverage
npm run test:coverage
```

### Пример теста

```typescript
import request from "supertest";
import { app } from "../src/index";

describe("Auth Controller", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data.user");
  });
});
```

## 📈 Мониторинг и логирование

### Логирование с Pino

```typescript
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});
```

### Health Check Endpoint

```http
GET /health
Response:
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 12345.67
}
```

## 🔒 Безопасность

### Security Headers (Helmet)

```typescript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);
```

### Rate Limiting

```typescript
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP",
  standardHeaders: true,
});
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - смотрите файл [LICENSE](LICENSE) для деталей.

## 🆘 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте [документацию](https://docs.content-zavod.com)
2. Создайте [issue](https://github.com/your-username/content-zavod-backend/issues)
3. Напишите на support@content-zavod.com

---

**Разработано с ❤️ для контент-креаторов**
