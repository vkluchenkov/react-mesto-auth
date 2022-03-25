import logo from "../images/mesto_logo.svg";

export const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Место Россия" className="header__logo" />
    </header>
  );
};
