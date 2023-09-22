import React from "react";

const InfoToolTip = ({ onClose, isOpen, isSuccess }) => {
  return (
    <section className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <div
          className={`popup__success ${
            isSuccess ? "popup__success_type_ok" : "popup__success_type_fail"
          }`}
        ></div>
        <h2 className="popup__title">
          {isSuccess
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте еще раз"}
        </h2>
        <button
          type="button"
          className="popup__close"
          onClick={onClose}
        ></button>
      </div>
    </section>
  );
};

export default InfoToolTip;
