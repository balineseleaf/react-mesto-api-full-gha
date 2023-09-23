class Api {
  constructor(config) {
    this._url = config.url; // url
    this._headers = config.headers; // заголовок
    this._authorization = config.headers.authorization; // token
  }

  getUserData() {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: getHeaders(),
    }).then(this._handleResponse);
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      // Возвращает Promise- объект
      method: "GET",
      headers: getHeaders(),
    }) // 200 ms проходит, в эвент луп, и когда запрос придет обратно, отработает этот колбэк (ниже)
      .then(this._handleResponse);
  }

  setUpdateUserData(userData) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({
        name: userData.name,
        about: userData.about,
      }),
    }).then(this._handleResponse);
  }

  setNewAvatar(avatar) {
    // здесь лежит наша ссылка введенная с инпута
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(avatar),
      //body: JSON.stringify({ avatar: avatar.link }), // поле name="link" у инпута  в попапе
    }).then(this._handleResponse);
  }

  postNewCard({ name, link }) {
    // то , что ввели в инпут - имя и линк
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(this._handleResponse);
  }

  deleteCard(cardID) {
    return fetch(`${this._url}/cards/${cardID}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(this._handleResponse);
  }

  addLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: getHeaders(),
    }).then(this._handleResponse);
  }

  deleteLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(this._handleResponse);
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json(); // Метод json читает ответ от сервера в формате json
      // и возвращает промис.
      //Из этого промиса потом можно доставать нужные нам данные.
    } else {
      return Promise.reject(`Ошибка ${res.status}`);
    }
  }
}

const getHeaders = () => {
  const token = localStorage.getItem('jwt');
  return {
    authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

const api = new Api({
  url: "https://api.balineseleaf.students.nomoredomainsrocks.ru",
  headers: getHeaders(),
});

export default api;
