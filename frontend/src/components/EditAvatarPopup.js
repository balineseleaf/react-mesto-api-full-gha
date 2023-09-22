import React from "react";
import PopupWithForm from "./PopupWithForm";

const EditAvatarPopup = (props) => {
  const { isOpen, onClose, onUpdateAvatar, isLoading } = props;
  const ref = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: ref.current.value, //current ссылается на DOM элемент input и берем поле value
    });
  }
  // очищаем инпуты
  React.useEffect(() => {
    ref.current.value = "";
  }, [isOpen]);

  return (
    <PopupWithForm
      title={"Обновить аватар"}
      buttonText={isLoading ? "Сохранение..." : "Сохранить"}
      name={"edit-avatar"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__fieldset">
        <input
          ref={ref}
          id="avatar-input"
          className="popup__input popup__input_type_edit-avatar"
          name="link"
          placeholder="Ссылка на аватар"
          required
          type="url"
        />
        <span className="avatar-input-error popup__text-error">
          Вставьте ссылку на ваш аватар
        </span>
      </fieldset>
    </PopupWithForm>
  );
};

export default EditAvatarPopup;
