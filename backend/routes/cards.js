const cardRoutes = require('express').Router(); // создаёт объект, на который мы и повесим обработчики:
const { celebrate, Joi } = require('celebrate');
const { REG_URL } = require('../config');

const {
  getCards,
  createCard,
  deleteCardById,
  putLikes,
  deleteLikes,
} = require('../controllers/cards');

cardRoutes.get('/', getCards); // регаем по такому-то роуту - такой-то обработчик

cardRoutes.post('/', celebrate({ // Такое описание говорит, что body должно быть объектом с ключами:
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(REG_URL),
  }),
}), createCard);

cardRoutes.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCardById);

cardRoutes.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), putLikes);

cardRoutes.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteLikes);

module.exports = cardRoutes;
