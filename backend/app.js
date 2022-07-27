require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');

const {
  login,
  createUser,
} = require('./controllers/users');

const { allowedCors } = require('./utils/corsData');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { userAuthorization } = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { regex } = require('./utils/constants');
const NotFoundError = require('./errors/notFoundError');

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('*', cors({
  origin: allowedCors,
  credentials: true,
}));

app.use(requestLogger);
app.use(express.json());

/*
удалить после ревью
*/
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(regex)),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use('/users', userAuthorization, usersRouter);
app.use('/cards', userAuthorization, cardsRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Вы обратились к несуществующей странице'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'что-то пошло не так' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
