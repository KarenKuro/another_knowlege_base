# Another Knowledge Base

Проект представляет собой REST API для управления статьями, тегами и пользователями.
Поддерживает аутентификацию, авторизацию, разграничение доступа и управление ролями (админ/зарегестрированный пользователь/гость).

## Технологии

- **NestJS** (v11)
- **Prisma ORM**
- **PostgreSQL**
- **Docker + Docker Compose**
- **JWT Аутентификация**
- **Swagger (OpenAPI)**

---

## Быстрый старт

### 1. Клонировать репозиторий и установить зависимости:

```bash
git clone <your_repo_url>
cd another-knowelege-base
npm ci
```

### 2. Создать в корне проекта файл .env.development. Скопировать в него содержимое файла .env.example

```bash
cp .env.example .env.development
```

### 3. Запуск базы данных PostgreSQL

```bash
docker-compose --env-file .env.development up -d
```

### 4. Применить миграции и сгенерировать Prisma Client

```bash
npm run prisma:dev
npm run db:generate
```

### 5. Запуск приложения

```bash
npm run start:dev
```

### Админ по умолчанию

После первого запуска создаётся пользователь с правами администратора:
{
"email": "admin@admin.ru",
"password": "12345"
}

### 📘 Swagger UI (документация API)

После запуска перейди по адресу: http://localhost:3000/api
Документация генерируется автоматически с помощью @nestjs/swagger.

### База данных в браузере (Prisma Studio)

```bash
npx dotenv -e .env.development -- prisma studio
```

Откроется визуальный редактор базы данных: http://localhost:5555
