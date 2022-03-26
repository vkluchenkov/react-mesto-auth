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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

function App() {
  // States
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
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

  // Returning user auth
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <BrowserRouter>
        <Header onLogoutClick={handleLogout} />
        <Routes>
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
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
      </BrowserRouter>
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
    </CurrentUserContext.Provider>
  );
}

export default App;
