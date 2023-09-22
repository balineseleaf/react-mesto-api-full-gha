const userRoutes = require('express').Router(); // создаёт объект, на который мы и повесим обработчики:
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateUser, updateAvatar, getUser,
} = require('../controllers/users'); // импортируем методы

userRoutes.get('/', getUsers); // записываем их роуты
userRoutes.get('/me', getUser);

userRoutes.get('/:userId', celebrate({
  params: Joi.object().keys({ // Такое описание говорит, что body должно быть объектом с ключами:
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserById);

userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({ // Такое описание говорит, что body должно быть объектом с ключами:
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

userRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().regex(/https?:\/\/(www\.)?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\#?$/i),
  }),
}), updateAvatar);

module.exports = userRoutes;
