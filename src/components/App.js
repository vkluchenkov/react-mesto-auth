import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Main } from "./Main";
import { ImagePopup } from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api, authApi } from "../utils/Api";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import { Login } from "./Login";
import { Register } from "./Register";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { InfoPopup } from "./InfoPopup";

function App() {
  // Hooks
  const navigate = useNavigate();

  // States
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isSuccessPopupOpen, setSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setErrorPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);

  // Effects
  useEffect(() => {
    Promise.all([api.getMe(), api.getCards()])
      .then(([user, cards]) => {
        setCurrentUser((prev) => {
          return { ...prev, ...user };
        });
        setCards(cards);
      })
      .catch((error) => console.log(error));
  }, []);

  //// Returning user auth
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      authApi
        .getMe()
        .then((res) => {
          setCurrentUser((prev) => {
            return { ...prev, ...res.data, isLoggedIn: true };
          });
        })
        .catch((error) => console.log(error));
    }
  }, []);

  // Handlers
  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleCardClick = (card) => setSelectedCard(card);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser((prev) => {
      return { ...prev, isLoggedIn: false };
    });
  };

  const handleCardLike = (card) => {
    const hasMyLike = card.likes.some((like) => like._id === currentUser._id);

    api
      .toggleLike(card._id, hasMyLike)
      .then((newCard) => setCards((state) => state.map((c) => (c._id === card._id ? newCard : c))))
      .catch((err) => console.log(err));
  };
  const handleCardDelete = (card) =>
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => {
          state.filter((c) => c._id !== card._id);
        });
      })
      .catch((err) => console.log(err));

  const closeAllPopups = (e) => {
    if (
      e.type === "keydown" ||
      e.target.classList.contains("popup_opened") ||
      e.target.classList.contains("popup__close-button")
    ) {
      setIsAddPlacePopupOpen(false);
      setIsEditAvatarPopupOpen(false);
      setIsEditProfilePopupOpen(false);
      setErrorPopupOpen(false);
      setSuccessPopupOpen(false);
      setSelectedCard(null);
    }
  };

  const handleUserUpdate = (user) =>
    api
      .patchMe(user)
      .then((res) => {
        setCurrentUser(res);
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleAvatarUpdate = ({ avatar }) =>
    api
      .patchAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
        setIsEditAvatarPopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleAddPlaceSubmit = (cardPayload) =>
    api
      .postCard(cardPayload)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((err) => console.log(err));

  const handleRegistrationError = () => {
    setErrorPopupOpen(true);
  };

  const handleRegistrationSuccess = () => {
    setSuccessPopupOpen(true);
  };

  const handleSuccessPopupClose = (e) => {
    closeAllPopups(e);
    navigate("/sign-in");
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header onLogoutClick={handleLogout} />
      <Routes>
        <Route path="/sign-in" element={<Login />} />
        <Route
          path="/sign-up"
          element={
            <Register onError={handleRegistrationError} onSuccess={handleRegistrationSuccess} />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardDelete={handleCardDelete}
                onCardLike={handleCardLike}
              />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUserUpdate={handleUserUpdate}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddCard={handleAddPlaceSubmit}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onAvatarUpdate={handleAvatarUpdate}
      />

      <ImagePopup onClose={closeAllPopups} card={selectedCard} />

      <InfoPopup onClose={handleSuccessPopupClose} isOpen={isSuccessPopupOpen}>
        <div className="popup__info-icon popup__info-icon_success"></div>
        <h2 className="popup__info-title">Вы успешно зарегистрировались!</h2>
      </InfoPopup>

      <InfoPopup onClose={closeAllPopups} isOpen={isErrorPopupOpen}>
        <div className="popup__info-icon popup__info-icon_error"></div>
        <h2 className="popup__info-title">Что-то пошло не так! Попробуйте ещё раз.</h2>
      </InfoPopup>
    </CurrentUserContext.Provider>
  );
}

export default App;
