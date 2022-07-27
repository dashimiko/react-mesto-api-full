const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SuperSecret } = require('../utils/jwt');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

const getAllUser = (req, res, next) => {
  User.find({}).then((users) => {
    res.send(users);
  }).catch(next);
};

const getIdUser = (req, res, next) => {
  User.findOne({ _id: req.params.userId }).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    res.send(user);
  }).catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Пользователь по указанному _id не найден.'));
    } else {
      next(err);
    }
  });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  })).then((user) => res.send({
    _id: user._id,
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    email: user.email,
  })).catch((err) => {
    if (err.code === 11000) {
      next(new ConflictError('email занят'));
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля. Заполните поля, в них должно быть от 2 до 30 символов'));
    } else {
      next(err);
    }
  });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    } res.send(user);
  }).catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля. Заполните поля, в них должно быть от 2 до 30 символов'));
    } else {
      next(err);
    }
  });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  ).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    res.send(user);
  }).catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара. Заполните поле'));
    } else {
      next(err);
    }
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SuperSecret, { expiresIn: '7d' });
      res.send({ token });
    }).catch(next);
};

module.exports = {
  getAllUser,
  getIdUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUser,
};
