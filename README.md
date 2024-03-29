# react-mesto-api-full

Mesto — это учебный проект Яндекс.Практикума, где пользователь может добавлять фотографии, ставить и снимать лайки, а также редактировать данные профиля. В этом репозитории находится завершающий вариант реализации приложения, объединяющий несколько практических работ.

Бэкенд расположен в директории `backend/`, а фронтенд - в `frontend/`. Код фронтенд-части разбит на функциональные компоненты, настроен роутинг, применяются React Hooks. Бекенд отвечает за аутентификацию, манипуляции с карточками и пользователями. 

### Используемый стек:

- Node.js;
- Express.js;
- MongoDB
- CSS;
- React.

### Используемые технологии и навыки:

- Семантичная и адаптивная верстка;
- Flexbox и Grid Layout для построения сеток;
- Методология БЭМ и организация файловой структуры Nested;
- Портирование разметки в JSX;
- React Hooks;
- React Router;
- React Context;
- авторизация через JWT, сохранение данных в LocalStorage;
- База данных — MongoDB;
- Все маршруты, кроме страницы регистрации и логина, защищены авторизацией;
- Аутентификация с помощью JWT;
- Централизованная обработка ошибок;
- Валидация приходящих на сервер запросов и данных на уровне схемы;
- Mongoose;
- Postman.

### Как проект развивался:

- [1 этап](https://github.com/dashimiko/mesto): чистый JavaScript, ООП, за бекенд отвечает внешнее API;
- [2 этап](https://github.com/dashimiko/mesto-react): фронтенд переписан на React, за бекенд отвечает внешнее API;
- [3 этап](https://github.com/dashimiko/react-mesto-auth): во фронтенд-часть добавлен функционал авторизации и регистрации;
- [4 этап](https://github.com/dashimiko/express-mesto-gha): создание бекенд-части приложения, отвечающего за аутентификацию, манипуляции с карточками и пользователями (Node.js, Express.js, MongoDB);
- 5 этап (🚩 вы находитесь здесь): объединение бекенд- и фронтенд-части приложения;
