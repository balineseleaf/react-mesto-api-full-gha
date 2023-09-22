import React from "react";
import { Link } from "react-router-dom";

const Register = (props) => {
  const { onRegister } = props;
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onRegister(email, password);
  }

  return (
    <form onSubmit={handleSubmit} className="auth__form" name="register">
      <h2 className="auth__title">Регистрация</h2>
      <input
        id="email"
        className="auth__input"
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        required={true}
        onChange={handleEmailChange}
        autoComplete="off"
      />

      <input
        id="password"
        className="auth__input"
        name="password"
        type="password"
        placeholder="Пароль"
        value={password}
        required={true}
        onChange={handlePasswordChange}
        autoComplete="off"
      />
      <button type="submit" className="auth__button">
        Зарегистрироваться
      </button>
      <div className="auth__signin">
        <Link to="/sign-in" className="auth__link">
          Уже зарегистрированы? Войти
        </Link>
      </div>
    </form>
  );
};

export default Register;
