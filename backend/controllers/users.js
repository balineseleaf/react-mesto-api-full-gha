const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');

const { NODE_ENV, JWT } = process.env;

const UnauthorizedError = require('../errors/UnauthorizedError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

// находим себя
const getUser = (req, res, next) => {
  const { _id } = req.user;
  return userSchema.findById(_id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(next);
};

// возвращаем всех пользователей
const getUsers = (req, res) => {
  userSchema.find({})
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log(err.name);
      return res.status(500).send({ message: `Внутренняя ошибка сервера: ${err.name}` });
    });
};

// возвр пользователя  по ID
const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return userSchema.findById(userId)
    .orFail()
    .then((response) => res.status(200).send(response))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный Id: ${userId}`));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Пользователь с указанным id не найден: ${userId}`));
      }
      return next(err);
    });
};

const postUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => userSchema.create({
      name, about, avatar, email, password: hash,
    }))
    .then((userData) => {
      res.status(201).send({
        name: userData.name,
        about: userData.about,
        avatar: userData.avatar,
        email: userData.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегестрирован'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Некорректные данные: ${err.name}`));
      }
      return next(err);
    });
};

// обновить данные
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  return userSchema
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((response) => res.status(200).send(response))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Некорректные данные: ${err.name}`));
      }
      return next(err);
    });
};
// обновление аватара
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((response) => { res.status(200).send(response); })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(`Некорректные данные: ${err.name}`));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return userSchema.findOne({ email }).select('+password')// Хэш пароля нужен
  // Чтобы найти польз. по почте, нам потребуется метод findOne, которому передадим на вход email
    .then((user) => { // не нашёлся — отклоняем промис
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password, (error, isValid) => { // нашёлся—сравниваемхеши
        if (isValid) {
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT : 'dev-secret', { expiresIn: '7d' }); // Вызовем метод jwt.sign,
          // чтобы создать токен
          // Методу sign мы передали два аргумента:
          // пейлоуд токена и секретный ключ подписи:
          // Пейлоуд токена — зашифрованный в строку объект пользователя.
          return res.status(200).send({ JWT: token });
        }
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      });
    })
    .catch(next);
};

module.exports = {
  getUser,
  getUsers,
  getUserById,
  postUser,
  updateUser,
  updateAvatar,
  login,
  JWT,
};
