import { useEffect } from "react";
// Хук для навешивания обработчиков закрытия по Esc и клику по оверлею
export const usePopupClose = (isOpen, closeAllPopups) => {
  useEffect(() => {
    if (!isOpen) return; // останавливаем действие хука, если попап закрыт

    const handleOverlay = (e) => {
      if (e.target.classList.contains("popup_opened")) {
        closeAllPopups();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOverlay);
    // удаляем обработчики в clean-up ф-ии
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOverlay);
    };
  }, [isOpen]); // следим за зависимостями
};
export default usePopupClose;
