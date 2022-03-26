import { useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { authApi } from "../utils/Api";
import { AuthForm } from "./AuthForm";

export const Register = () => {
  const currentUser = useContext(CurrentUserContext);

  const onSubmit = (signupPayload) => {
    authApi
      .signup(signupPayload)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  };

  return !!currentUser?.isLoggedIn ? (
    <Navigate to="/" />
  ) : (
    <AuthForm
      title="Регистрация"
      buttonLabel="Зарегистрироваться"
      onSubmit={onSubmit}
      hint={
        <p className="authform__hint">
          Уже зарегистрированы?{" "}
          <Link className="authform__hint-link" to="/sign-in">
            Войти
          </Link>
        </p>
      }
    />
  );
};
