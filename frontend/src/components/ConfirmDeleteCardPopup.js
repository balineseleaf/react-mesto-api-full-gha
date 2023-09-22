import React from "react";
import PopupWithForm from "./PopupWithForm";

const PopupConfirmation = (props) => {
  const { isOpen, isClose, onSubmit, isLoading } = props;

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <PopupWithForm
      name="confirmation"
      title={"Вы уверены?"}
      onClose={isClose}
      isOpen={isOpen}
      buttonText={isLoading ? "Удаление..." : "Да"}
      onSubmit={handleSubmit}
    ></PopupWithForm>
  );
};

export default PopupConfirmation;
