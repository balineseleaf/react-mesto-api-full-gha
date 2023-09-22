import editAvatar from "../images/editavatar.svg";
import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import Card from "./Card";
import Footer from "./Footer";

const Main = (props) => {
  const {
    onEditProfile,
    onAddPlace,
    onCardLike,
    onEditAvatar,
    cards,
    onCardClick,
    onCardDelete,
  } = props;

  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__info">
          <div className="profile__info-container" onClick={onEditAvatar}>
            <img
              className="profile__image"
              alt="Фотография пользователя"
              src={currentUser.avatar}
            />
            <img
              className="profile__edit-icon"
              alt="Иконка редактирования профиля"
              src={editAvatar}
            />
          </div>
          <div className="profile__bio">
            <div className="profile__block-info">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                type="button"
                className="profile__edit-button"
                onClick={onEditProfile}
              ></button>
            </div>
            <p className="profile__description">{currentUser.about}</p>
          </div>
        </div>
        <button
          type="button"
          className="profile__add-button"
          onClick={onAddPlace}
        ></button>
      </section>
      <section className="elements">
        {cards.map((item) => (
          <Card
            key={item._id}
            onCardLike={onCardLike}
            onCardClick={onCardClick}
            onCardDelete={onCardDelete}
            card={item}
          />
        ))}
      </section>
      <Footer />
    </main>
  );
};

export default Main;
