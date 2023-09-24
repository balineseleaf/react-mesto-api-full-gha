const router = require('express').Router(); // создаёт объект, на который мы и повесим обработчики:
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { REG_URL } = require('../config');

const usersRouter = require('./users');// импортируем роут пользователя из user.js
const cardsRouter = require('./cards');// импортируем роут с карточками из card.js
const { login, postUser } = require('../controllers/users'); // забираем из контроллера users данные

router.use('/api/users', auth, usersRouter); // добавл мидлвеир авторизации
router.use('/api/cards', auth, cardsRouter); // добавл мидлвеир авторизации

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/api/signin', celebrate({ // роуты, не требующие авторизации,
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/api/signup', celebrate({ // роуты, не требующие авторизации,
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REG_URL),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), postUser);

router.use('*', auth, (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

module.exports = router;
