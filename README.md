Создать в корне проекта файл .env.development. Скопировать в него содержимое файла .env.example

docker-compose --env-file .env.development up -d

npm ci

миграции
запуск приложения

для просмотра базы в браузере
npx dotenv -e .env.development -- prisma studio
