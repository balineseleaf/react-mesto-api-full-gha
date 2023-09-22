// eslint-disable-next-line no-useless-escape
const { REG_URL = /https?:\/\/(www\.)?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\#?$/i } = process.env;
const { DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
module.exports = {
  REG_URL,
  DB_URL,
};
