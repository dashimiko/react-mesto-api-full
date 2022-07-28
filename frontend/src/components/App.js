import React, {useState,useEffect} from 'react';
import {Route, Switch, Redirect, Link, useHistory} from 'react-router-dom';

import {api} from '../utils/Api';
import * as MestoAuth from '../utils/MestoAuth';

import {CurrentUserContext} from "../contexts/CurrentUserContext";

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';

import Login from './Login.js';
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute.js';
import InfoTooltip from './InfoTooltip.js';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isEntranceCompleted, setisEntranceCompleted] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [userData, setUserData] = useState('');
  const [InfoTooltipText, setInfoTooltipText] = useState('');
  const [cards, setCards] = useState([]);

  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getProfile(), api.getInitialCards()])
      .then(([userData, card]) => {
        const myUser = userData.user;
        setCurrentUser({
          ...currentUser,
          name: myUser.name,
          about: myUser.about,
          avatar: myUser.avatar,
          id: myUser._id,
        });
        setCards(card.map(i => i).reverse());
      }).catch((err) => console.log(err));
    }},[loggedIn]);

  function handleEditAvatarClick () {
    setIsEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick () {
    setIsEditProfilePopupOpen(true);
  };

  function handleInfoTooltipPopupClick () {
    setIsInfoTooltipPopupOpen(true);
  };

  function handleAddPlaceClick () {
    setIsAddPlacePopupOpen(true);
  };

  function handleCardClick (card) {
    setSelectedCard(card);
  };

  function closeAllPopups () {
    setIsEditProfilePopupOpen(null);
    setIsAddPlacePopupOpen(null);
    setIsEditAvatarPopupOpen(null);
    setIsInfoTooltipPopupOpen(null);
    setSelectedCard(null);
  }

  function handleUpdateUser({name,about}) {
    api.editProfile(name,about)
    .then((res) => {
      setCurrentUser({
        ...currentUser,
        name: res.name,
        about: res.about,
      });
      closeAllPopups();
    })
    .catch((err) => console.log(err))};

  function handleAddPlaceSubmit({name, link}) {
    api.addImage(name, link)
    .then(newCard => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((err) => console.log(err))};

    function handleUpdateAvatar({avatar}) {
      api.editAvatar(avatar)
      .then((res) => {
        setCurrentUser({
          ...currentUser,
          avatar: res.avatar,
        });
        closeAllPopups();
      })
      .catch((err) => console.log(err))};

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {setCards((state) => state.filter((с) => с._id !== card._id))})
    .catch((err) => console.log(err))};

  const handleRegister = ({email, password}) => {
    return MestoAuth.register(email, password).then((res) => {
      if (res) {
        handleInfoTooltipPopupClick();
        history.push("/sign-in");
        setisEntranceCompleted(true);
        setInfoTooltipText('Вы успешно зарегистрировались!');
      }})
      .catch((err) => {
        console.log(err);
        handleInfoTooltipPopupClick();
        setisEntranceCompleted(false);
        setInfoTooltipText('Что-то пошло не так! Попробуйте ещё раз.');
      })
    };

  const handleLogin = ({email, password}) => {
    return MestoAuth.authorize(email, password).then((res) => {
      api.updateToken(res['token']);
      setLoggedIn(true);
      if (res['token']) {
        localStorage.setItem("jwt", res['token']);
        tokenCheck();
      }}).catch((err) => {
          console.log(err);
          handleInfoTooltipPopupClick();
          setisEntranceCompleted(false);
          setInfoTooltipText('Что-то пошло не так! Попробуйте ещё раз.');
        })
    };

  const tokenCheck = () => {
    const jwt = localStorage.getItem('jwt');
      if (jwt) {
        MestoAuth.getContent(jwt).then((res) => {
          if (res) {
            const userData = res.user;
            setUserData(userData.email);
            setLoggedIn(true);
            setisLoading(false);
            history.push("/");
          }}).catch((err) => {
            console.log(err);
          });
        } else {
          setisLoading(false);
        }
    };

  function handleCardLike(card) {
    const isLiked = card.likes.some(like => like === currentUser.id);
    if(!isLiked) {
      api.addLike(card._id).then((res) => {
        setCards((state) => state.map((c) => c._id === card._id ? res : c));
      })
    } else {
      api.deleteLike(card._id).then((res) => {
        setCards((state) => state.map((c) => c._id === card._id ? res : c));
      })
    }
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  const signOut = () => {
    localStorage.removeItem('jwt');
    setUserData('');
    setLoggedIn(false);
    history.push('/sign-in');
  };

  if (isLoading) return null;

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
      <Switch>

      <Route path="/sign-in">
        <Header>
          <Link to="/sign-up" className ="header__link header__link_margin">Регистрация</Link>
        </Header>
        <Login handleLogin={handleLogin} tokenCheck={tokenCheck}/>
      </Route>

      <Route path="/sign-up">
        <Header>
          <Link to="/sign-in" className ="header__link header__link_margin">Войти</Link>
        </Header>
        <Register handleRegister={handleRegister} />
      </Route>

      <ProtectedRoute exact path="/" loggedIn={loggedIn}>
        <Header userData={userData}>
          <div className ="header__user-container">
            <p className ="header__link header__email">{userData}</p>
            <Link onClick={signOut} to="/sign-in" className ="header__link">Выйти</Link>
          </div>
        </Header>
        <Main
        cards={cards}
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onEditAvatar={handleEditAvatarClick}
        onCardClick = {handleCardClick}
        onCardLike = {handleCardLike}
        onCardDelete = {handleCardDelete}/>
        <Footer />
      </ProtectedRoute>

      <Route  path="/">
        {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
      </Route>

      </Switch>

      <InfoTooltip onClose={closeAllPopups} isEntrance={isEntranceCompleted} isOpen={isInfoTooltipPopupOpen} text={InfoTooltipText}/>

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>

      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddCard={handleAddPlaceSubmit}/>

      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>

      <PopupWithForm name="delete" title="Вы уверены?">
        <label className="popup__profile-info">
          <input type="url" name = "avatar" id = "avatar" className = "popup__input popup__input_avatar" placeholder="Ссылка на картинку" required></input>
          <span className="avatar-error popup__error" id=""></span>
        </label>
      </PopupWithForm>

      <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

      </div>

    </CurrentUserContext.Provider>
  );
}

export default App;
