import { usePopupClose } from "../hooks/usePopupClose.js";
const ImagePopup = (props) => {
  const { onClose, isOpen, card } = props;

  usePopupClose(isOpen, onClose); // кастомный хук

  return (
    <section className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__image-container">
        <img alt={card.name} className="popup__image" src={card.link} />
        <p className="popup__image-text">{card.name}</p>
        <button
          type="button"
          className="popup__close"
          onClick={onClose}
        ></button>
      </div>
    </section>
  );
};

export default ImagePopup;
