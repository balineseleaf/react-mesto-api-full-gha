const mongoose = require('mongoose');
const cardSchema = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// возвращаем все карточки
const getCards = (req, res, next) => {
  cardSchema
    .find({})
    .then((response) => res.status(200).send(response))
    .catch(next);
};

// создаем карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return cardSchema
    .create({ name, link, owner })
    .then((response) => res.status(201).send(response))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Некорректные данные: ${err.name}`));
      }
      return next(err);
    });
};

// удаляем карточку по id
const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  return cardSchema.findById(cardId)
    .orFail()
    .then((card) => {
      const ownerId = card.owner.toString();
      if (ownerId !== _id) {
        throw new ForbiddenError('У вас недостаточно прав');
      }
      return card.deleteOne();
    })
    .then((cardData) => res.status(200).send(cardData))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный id: ${cardId}`));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Карточка с указанным id не найдена: ${cardId}`));
      }
      return next(err);
    });
};

// поставить лайк
const putLikes = (req, res, next) => {
  const { cardId } = req.params;
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((response) => res.status(200).send(response))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный id: ${cardId}`));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Карточка с указанным id не найдена: ${cardId}`));
      }
      return next(err);
    });
};
// Свойство req.params — это объект, содер. св-ва, сопоставленные с именованными «парам.» маршрута.
const deleteLikes = (req, res, next) => {
  const { cardId } = req.params;
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((response) => res.status(200).send(response))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError(`Некорректный id: ${cardId}`));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(`Карточка с указанным id не найдена: ${cardId}`));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  putLikes,
  deleteLikes,
  deleteCardById,
};
