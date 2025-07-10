# Инструкция по развертыванию

## Конфигурация для разных серверов

Проект поддерживает конфигурацию для разных серверов через переменные окружения.

### Доступные конфигурации:

1. **SafePay** (по умолчанию) - `env.example`
2. **MaxPay** - `env.maxpay`

### Как развернуть на MaxPay:

1. Скопируйте файл конфигурации:
   ```bash
   cp env.maxpay .env
   ```

2. Запустите скрипт настройки:
   ```bash
   npm run setup-maxpay
   ```

3. Установите зависимости:
   ```bash
   npm install
   ```

4. Запустите приложение:
   ```bash
   npm start
   ```

### Как развернуть на SafePay:

1. Скопируйте файл конфигурации:
   ```bash
   cp env.example .env
   ```

2. Запустите скрипт настройки:
   ```bash
   npm run setup-safepay
   ```

3. Установите зависимости:
   ```bash
   npm install
   ```

4. Запустите приложение:
   ```bash
   npm start
   ```

## Переменные окружения

### API Configuration:
- `API_BASE_URL` - Базовый URL API
- `API_DOMAIN` - Домен API

### Application Branding:
- `APP_NAME` - Название приложения (SafePay/MaxPay)
- `APP_DISPLAY_NAME` - Отображаемое название
- `APP_DOMAIN` - Домен приложения

### Manager ID:
- `MANAGER_ID` - ID менеджера для авторизации

## Что изменяется автоматически:

1. **API endpoints** - все запросы к API теперь используют переменную `API_BASE_URL`
2. **Названия в HTML** - заголовки страниц и мета-теги
3. **Manifest.json** - название приложения в PWA
4. **Package.json** - имя пакета

## Создание новой конфигурации:

1. Создайте новый файл `env.[project-name]`
2. Укажите нужные переменные окружения
3. Добавьте скрипт в package.json:
   ```json
   "setup-[project-name]": "node scripts/replace-env-vars.js env.[project-name]"
   ```

## Примечания:

- Файл `.env` должен быть добавлен в `.gitignore`
- При изменении конфигурации перезапустите приложение
- Скрипт `replace-env-vars.js` обновляет статические файлы (HTML, manifest, package.json)
- React компоненты используют переменные окружения автоматически через `src/config.js` 