import React, {useContext} from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext.js";

function Card ({card,onCardClick,onCardLike,onCardDelete}) {

  const currentUser = useContext(CurrentUserContext);

  function handleClick() {
    onCardClick(card);
  };

  function handleLikeClick() {
    onCardLike(card);
  };

  function handleDeleteClick () {
    onCardDelete(card);
  };

  const isOwn = card.owner === currentUser.id;

  const cardDeleteButtonClassName = (
  `card__delete-button ${isOwn ? 'card__delete-button_active' : ''}`);

  const isLiked = card.likes.some(i => i === currentUser.id);

  const cardLikeButtonClassName = `card__like ${isLiked ? "card__like_active" : ''}`;

  return (
    <article className="card">
      <img onClick={handleClick} className="card__picture" src={card.link} alt={card.name}></img>
      <button onClick={handleDeleteClick} className={cardDeleteButtonClassName}></button>
      <div className="card__container">
        <h2 className="card__description">{card.name}</h2>
        <div className='card__like-container'>
          <button type="button" onClick={handleLikeClick} className={cardLikeButtonClassName}></button>
          <span className="card__like-count">{card.likes.length}</span>
        </div>
      </div>
    </article>
  );
}

export default Card;
