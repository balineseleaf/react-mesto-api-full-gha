import React from "react";

const Login = ({ onLogin }) => {
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
    onLogin(email, password);
  }

  return (
    <form className="auth__form" onSubmit={handleSubmit} name="login">
      <h2 className="auth__title">Вход</h2>
      <input
        id="email-input"
        className="auth__input"
        type="email"
        name="email"
        required={true}
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        autoComplete="off"
      />
      <input
        id="password"
        className="auth__input"
        type="password"
        name="password"
        required={true}
        placeholder="Пароль"
        value={password}
        onChange={handlePasswordChange}
        autoComplete="off"
      />
      <button className="auth__button" type="submit">
        Войти
      </button>
    </form>
  );
};

export default Login;
