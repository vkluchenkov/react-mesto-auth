import { useContext, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import logo from "../images/mesto_logo.svg";

export const Header = ({ onLogoutClick }) => {
  const currentUser = useContext(CurrentUserContext);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const logout = () => {
    onLogoutClick();
    setMenuIsOpen(false);
  };

  const Icons = () => {
    if (menuIsOpen) {
      return <button className="header__close-button" type="button" onClick={toggleMenu}></button>;
    } else {
      return <button className="header__menu-button" type="button" onClick={toggleMenu}></button>;
    }
  };

  return (
    <header className="header">
      <div
        className={
          menuIsOpen ? "header__mobile-menu header__mobile-menu_open" : "header__mobile-menu"
        }
      >
        <span className="header__info header__info_mobile">{currentUser?.email}</span>
        <Link className="header__link header__link_mobile" onClick={logout} to="/sign-in">
          Выйти
        </Link>
      </div>
      <img src={logo} alt="Место Россия" className="header__logo" />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="header__info-wrapper">
                <div className="header__info">
                  {currentUser?.email}
                  <Link
                    className="header__link header__link_logout"
                    onClick={onLogoutClick}
                    to="/sign-in"
                  >
                    Выйти
                  </Link>
                </div>
              </div>
              <Icons />
            </>
          }
        />
        <Route
          path="sign-in"
          element={
            <Link className="header__link" to="/sign-up">
              Регистрация
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
