const router = require('express').Router(); // создаёт объект, на который мы и повесим обработчики:
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

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
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\#?$/i),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), postUser);

router.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

module.exports = router;
