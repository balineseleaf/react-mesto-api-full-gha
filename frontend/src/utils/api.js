class Api {
  constructor(config) {
    this._url = config.url; // url
    this._headers = config.headers; // заголовок
    this._authorization = config.headers.authorization; // token
  }

  getUserData() {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        authorization: this._authorization,
      },
    }).then(this._handleResponse);
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      // Возвращает Promise- объект
      method: "GET",
      headers: {
        authorization: this._authorization,
        "Content-type": "application/json",
      },
    }) // 200 ms проходит, в эвент луп, и когда запрос придет обратно, отработает этот колбэк (ниже)
      .then(this._handleResponse);
  }

  setUpdateUserData(userData) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: this._authorization,
        "Content-Type": "application/json",
      },
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
      headers: {
        authorization: this._authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(avatar),
      //body: JSON.stringify({ avatar: avatar.link }), // поле name="link" у инпута  в попапе
    }).then(this._handleResponse);
  }

  postNewCard({ name, link }) {
    // то , что ввели в инпут - имя и линк
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: {
        authorization: this._authorization,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(this._handleResponse);
  }

  deleteCard(cardID) {
    return fetch(`${this._url}/cards/${cardID}`, {
      method: "DELETE",
      headers: {
        authorization: this._authorization,
        "Content-type": "application/json",
      },
    }).then(this._handleResponse);
  }

  addLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        authorization: this._authorization,
        "Content-type": "application/json",
      },
    }).then(this._handleResponse);
  }

  deleteLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        authorization: this._authorization,
        "Content-type": "application/json",
      },
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

const api = new Api({
  url: "https://mesto.nomoreparties.co/v1/cohort-68",
  headers: {
    authorization: "79aff481-506e-4c4c-8308-be7829df1002",
    "Content-Type": "application/json",
  },
});

export default api;
