import React from "react";
import Header from "./Header";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext"; // импортируем объект контекста
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth.js";
import Login from "./Login";
import Register from "./Register";
import InfoToolTip from "./InfoToolTip";
import PopupConfirmation from "./ConfirmDeleteCardPopup";

function App() {
  const [cards, setCards] = React.useState([]);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState({});

  const [isImagePopupOpen, setImagePopupOpen] = React.useState(false);

  const [confirmationPopup, setConfirmationPopup] = React.useState(false); // попап для подтв. удаления карточки

  const [currentCard, setCurrentCard] = React.useState(null);

  const [currentUser, setCurrentUser] = React.useState({});

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = React.useState(false); // попап с рез-том после регистрации

  const [headerEmail, setHeaderEmail] = React.useState(""); // для почты внутри профиля

  const [isInfoToolTipSuccess, setIsInfoToolTipSuccess] = React.useState(false);

  const [isLoadingUpdateUser, setIsLoadingUpdateUser] = React.useState(false);

  const [isLoadingUpdateAvatar, setIsLoadingUpdateAvatar] =
    React.useState(false);

  const [isLoadingAddPlace, setIsLoadingAddPlace] = React.useState(false);

  const [isLoadingDeletePopup, setIsLoadingDeletePopup] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res.data) {
            navigate("/");
            setHeaderEmail(res.data.email);
            setIsLoggedIn(true);
          } else {
            navigate("/sign-in");
          }
        })
        .catch((err) => console.error(`Ошибка: ${err}`));
    }
  }, []);

  React.useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserData(), api.getInitialCards()])
        .then(([userData, cards]) => {
          setCurrentUser(userData);
          setCards(cards);
        })
        .catch((err) => console.log(err));
    }
  }, [isLoggedIn]);

  // регистрация пользователя
  function handleRegisterUser(email, password) {
    return auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setIsInfoToolTipSuccess(true); // успешная регистрация
          navigate("/sign-in");
        }
      })
      .catch((err) => {
        setIsInfoToolTipSuccess(false); // неудачная регистрация
        console.log(err);
      })
      .finally(() => setIsSuccessPopupOpen(true)); // в любом случае открываем попап
  }

  // аутентификация пользователя
  function handleLoginUser(email, password) {
    // если пользователь зашел первый раз и мы сэттим токен в локальное хранилище
    return auth
      .login(email, password)
      .then((res) => {
        if (res.JWT) {
          setHeaderEmail(email); // передаем почту
          setIsLoggedIn(true); // вошли
          localStorage.setItem("jwt", res.token);
          navigate("/");
        }
      })
      .catch((err) => {
        setIsInfoToolTipSuccess(false);
        setIsSuccessPopupOpen(true); // в любом случае открываем попап
        console.log(err);
      });
  }

  // удаляем токен
  function handleSingOut() {
    localStorage.removeItem("jwt");
    setHeaderEmail(""); // очищаем почту
    setIsLoggedIn(false); // не войдено
    navigate("/sign-in");
  }

  // попап редактирования
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  // попап добавления
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  // попап аватара
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  // зуум изображение
  function handleCardClick(cardData) {
    setImagePopupOpen(true);
    console.log(cardData);
    setSelectedCard(cardData);
  }

  // ф-ия закрытия попапов
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setImagePopupOpen(false);
    setSelectedCard({});
    setIsSuccessPopupOpen(false);
    setConfirmationPopup(false);
  }

  // лайк карточек
  //эта функция в параметре содержит текущее состояние стейта , state - массив карточек
  //дальше проходим по всем текущим карточкам, и если у нее id равен тому что ты лайкнули, то карточка подменяется на ту что пришла в ответе с сервера
  function handleCardLike(card) {
    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    if (!isLiked) {
      api
        .addLike(card._id)
        .then((newCard) => {
          // обновленные данные карточки
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => console.log(err));
    } else {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => console.log(err));
    }
  }

  function handleCardDelete(card) {
    setCurrentCard(card);
    setConfirmationPopup(true);
  }

  function handleConfirmationSubmit() {
    setIsLoadingDeletePopup(true);
    api
      .deleteCard(currentCard._id)
      .then(() => {
        setCards((state) =>
          state.filter((item) => item._id !== currentCard._id)
        );
        closeAllPopups();
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoadingDeletePopup(false);
      });
  }

  // апдейт пользователя
  function handleUpdateUser(data) {
    setIsLoadingUpdateUser(true);
    api
      .setUpdateUserData(data)
      .then((newUser) => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingUpdateUser(false)); //текст кнопки на попапе
  }
  // апдейт аватара
  function handleUpdateAvatar(avatar) {
    // наша ссылка с инпута
    setIsLoadingUpdateAvatar(true);
    api
      .setNewAvatar(avatar)
      .then((newAvatar) => {
        // newAvatar - это объект с данными пользователя
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingUpdateAvatar(false)); //текст кнопки на попапе
  }

  //добавление карточек
  function handleAddPlaceSubmit(data) {
    // name , link с инпутов
    setIsLoadingAddPlace(true);
    api
      .postNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]); // исп "..." для расширения текущего массива
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingAddPlace(false)); //текст кнопки на попапе
  }

  return (
    <CurrentUserContext.Provider
      value={
        currentUser /*Мы будем использовать контекст, чтобы все компоненты приложения могли получить доступ к этим данным.*/
      }
    >
      <div className="page">
        <Header onSignOut={handleSingOut} headerEmail={headerEmail} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                Component={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            }
          />
          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegisterUser} />}
          />
          <Route
            path="/sign-in"
            element={<Login onLogin={handleLoginUser} />}
          />
          <Route
            path="*"
            element={
              isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
            }
          />
        </Routes>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoadingUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleAddPlaceSubmit}
          isLoading={isLoadingAddPlace}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoadingUpdateAvatar}
        />
        <ImagePopup
          onClose={closeAllPopups}
          isOpen={isImagePopupOpen}
          card={selectedCard}
        />
        <PopupConfirmation
          isOpen={confirmationPopup}
          onClose={closeAllPopups}
          onSubmit={handleConfirmationSubmit}
          isLoading={isLoadingDeletePopup}
        />
        <InfoToolTip
          onClose={closeAllPopups}
          isOpen={isSuccessPopupOpen}
          isSuccess={isInfoToolTipSuccess}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
