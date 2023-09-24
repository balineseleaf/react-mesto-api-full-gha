import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import React from "react";

const Card = (props) => {
  const { card, onCardClick, onCardDelete, onCardLike } = props;
  //тут наша карточка и у нее уже берем все нужные поля: имя, лайки, айди, овнерАйди, описание...

  const currentUser = React.useContext(CurrentUserContext); // тут мои данные - все поля

  // Определяем, являемся ли мы владельцем текущей карточки, чтобы удалять впоследствии
  const isOwn = card.owner === currentUser._id;

  //Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some((i) => i === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element__icon-like ${
    isLiked ? "element__icon-like_active" : ""
  }`;

  // фу-ия с лайком
  function handleLikeClick() {
    onCardLike(card); // метод  у card
  }

  function handleClick() {
    onCardClick(card); //здесь лежит выбранная карточка для зум
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <div className="element">
      {isOwn && (
        <button
          className="element__delete-card-button"
          type="button"
          onClick={handleDeleteClick}
        />
      )}
      <img
        alt={card.name}
        className="element__image"
        role="button"
        src={card.link}
        onClick={handleClick}
      />
      <div className="element__caption-block">
        <h2 className="element__caption">{card.name}</h2>
        <div className="element__like-section">
          <button
            type="button"
            onClick={handleLikeClick}
            className={cardLikeButtonClassName}
          ></button>
          <p className="element__icon-like-counter">{card.likes.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
