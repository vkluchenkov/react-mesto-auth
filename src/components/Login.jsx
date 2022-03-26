import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { authApi } from "../utils/Api";
import { AuthForm } from "./AuthForm";

export const Login = () => {
  const currentUser = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const onSubmit = (signinPayload) => {
    authApi
      .signin(signinPayload)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        currentUser.isLoggedIn = true;
        currentUser.email = signinPayload.email;
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  return currentUser?.isLoggedIn ? (
    <Navigate to="/" />
  ) : (
    <AuthForm title="Вход" buttonLabel="Войти" onSubmit={onSubmit} />
  );
};
