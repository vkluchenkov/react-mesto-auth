import { useContext } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import logo from "../images/mesto_logo.svg";

export const Header = ({ onLogoutClick }) => {
  const currentUser = useContext(CurrentUserContext);

  return (
    <header className="header">
      <img src={logo} alt="Место Россия" className="header__logo" />
      <Routes>
        <Route
          path="/"
          element={
            <div className="header__info">
              {currentUser.email}
              <Link
                className="header__link header__link_logout"
                onClick={onLogoutClick}
                to="/sign-in"
              >
                Выйти
              </Link>
            </div>
          }
        />
        <Route
          path="sign-in"
          element={
            <Link className="header__link" to="/sign-up">
              Зарегистрироваться
            </Link>
          }
        />
        <Route
          path="sign-up"
          element={
            <Link className="header__link" to="/sign-in">
              Войти
            </Link>
          }
        />
      </Routes>
    </header>
  );
};
