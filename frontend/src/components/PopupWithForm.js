import { usePopupClose } from "../hooks/usePopupClose.js";

const PopupWithForm = (props) => {
  const { isOpen, onClose, onSubmit, buttonText } = props;

  usePopupClose(isOpen, onClose);

  return (
    <section
      className={`popup popup_type_${props.name} ${
        isOpen ? "popup_opened" : ""
      }`}
    >
      <div className="popup__container">
        <h2 className="popup__header">{props.title}</h2>
        <form
          id="formEditProfile"
          name={`form-${props.name}`}
          className={`popup__form popup__form_${props.name}`}
          onSubmit={onSubmit}
        >
          {props.children}
          <button type="submit" className="popup__submit">
            {buttonText}
          </button>
        </form>
        <button
          type="button"
          className="popup__close"
          onClick={onClose}
        ></button>
      </div>
    </section>
  );
};

export default PopupWithForm;
