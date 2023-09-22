import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import PopupWithForm from "./PopupWithForm";

const EditProfilePopup = (props) => {
  const { isOpen, onClose, onUpdateUser, isLoading } = props;
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  // изменение инпута имени
  function handleNameChange(evt) {
    setName(evt.target.value);
  }
  // изменения инпута описания
  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }

  React.useEffect(() => {
    setName(currentUser.name ?? ""); // если существует, то оставляем текущий или пустую строку в противном случае
    setDescription(currentUser.about ?? "");
  }, [currentUser, isOpen]);

  //сабмит формы
  function handleSubmit(e) {
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      title={"Редактировать профиль"}
      name={"edit-profile"}
      isOpen={isOpen}
      onClose={onClose}
      buttonText={isLoading ? "Сохранение..." : "Сохранить"}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__fieldset">
        <input
          id="name-input"
          className="popup__input popup__input_type_name"
          name="name"
          placeholder="Введите ваше имя"
          required
          minLength="2"
          maxLength="40"
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        <span className="name-input-error popup__text-error"></span>
        <input
          id="description-input"
          className="popup__input popup__input_type_description"
          name="about"
          placeholder="Введите вашу профессию"
          required
          minLength="2"
          maxLength="40"
          type="text"
          value={description}
          onChange={handleDescriptionChange}
        />
        <span className="description-input-error popup__text-error"></span>
      </fieldset>
    </PopupWithForm>
  );
};

export default EditProfilePopup;
