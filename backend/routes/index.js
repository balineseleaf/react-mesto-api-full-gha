const router = require('express').Router(); // создаёт объект, на который мы и повесим обработчики:
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { REG_URL } = require('../config');

const usersRouter = require('./users');// импортируем роут пользователя из user.js
const cardsRouter = require('./cards');// импортируем роут с карточками из card.js
const { login, postUser } = require('../controllers/users'); // забираем из контроллера users данные

router.use('/users', auth, usersRouter); // добавл мидлвеир авторизации
router.use('/cards', auth, cardsRouter); // добавл мидлвеир авторизации

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', celebrate({ // роуты, не требующие авторизации,
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({ // роуты, не требующие авторизации,
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(REG_URL),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), postUser);

router.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

module.exports = router;
