/*class Api {
  constructor({baseUrl,headers}) {
    this._headers = headers;
    this._baseUrl = baseUrl
  }

  getInfo() {
    return Promise.all([this.getInitialCards(), this.getProfile()])
  }

  getProfile(){
    return fetch(`${this._baseUrl}/users/me`,{
      headers: this._headers,
      credentials: 'include',
    }).then(this.checkResponse)
    .catch(console.log)
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`,{
      headers: this._headers,
      credentials: 'include',
    }).then(this.checkResponse)
    .catch(console.log)
  }

  editProfile(name,about) {
    return fetch(`${this._baseUrl}/users/me`,{
      method: "PATCH",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name,
        about
      })
    }).then(this.checkResponse)
    .catch(console.log)
  }

  addImage(name,link) {
    return fetch(`${this._baseUrl}/cards`,{
      method: "POST",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name,
        link
      })
    }).then(this.checkResponse)
    .catch(console.log)
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`,{
      method: "DELETE",
      headers: this._headers,
      credentials: 'include',
    }).then(this.checkResponse)
    .catch(console.log)
  }

  deleteLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`,{
      method: "DELETE",
      headers: this._headers,
      credentials: 'include',
    }).then(this.checkResponse)
    .catch(console.log)
  }

  addLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`,{
      method: "PUT",
      headers: this._headers,
      credentials: 'include',
    }).then(this.checkResponse)
    .catch(console.log)
  }

  editAvatar( avatar ) {
    return fetch(`${this._baseUrl}/users/me/avatar`,{
      method: "PATCH",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        avatar,
      })
    }).then(this.checkResponse)
    .catch(console.log)
  }

  changeLikeCardStatus(id, isLiked) {
    return isLiked ? this.addLike(id) : this.deleteLike(id);
  }

  checkResponse(res) {
    if (res.ok) {
      console.log('я здесь')
      return res.json()}
    else {
      return Promise.reject(res.status)}
  }

  updateToken(token) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

}


const token = localStorage.getItem('jwt');

export const api = new Api({
  baseUrl: 'http://localhost:3001',
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  credentials: 'include',
});my class*/


class Api {
  constructor(options) {
    this._options = options;
  }

  _checkResponse(res) {
    if (res.ok) {
      console.log('res ok')
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getInfo() {
    return Promise.all([this.getInitialCards(), this.getProfile()])
  }

  getInitialCards() {
    return fetch(this._options.baseUrl + "/cards", {
      headers: this._options.headers,
      credentials: 'include',
    }).then(this._checkResponse).catch(console.log)
    //.then((res) => res)
  }

  getProfile() {
    return fetch(this._options.baseUrl + "/users/me", {
      headers: this._options.headers,
      credentials: 'include',
    }).then(this._checkResponse).catch(console.log)
    //.then((res) => res)
  }

  editProfile(name,about) {
    return fetch(this._options.baseUrl + "/users/me",{
      method: "PATCH",
      headers: this._options.headers,
      credentials: 'include',
      body: JSON.stringify({
        name,
        about
      })
    }).then(this._checkResponse)
    .catch(console.log)
  }

  editAvatar( avatar ) {
    return fetch(this._options.baseUrl + "/users/me/avatar",{
      method: "PATCH",
      headers: this._options.headers,
      credentials: 'include',
      body: JSON.stringify({
        avatar,
      })
    }).then(this._checkResponse)
    .catch(console.log)
  }

  addLike(_id) {
    return fetch(this._options.baseUrl + "/cards/" + _id + "/likes", {
      method: "PUT",
      headers: this._options.headers,
      credentials: 'include',
    }).then(this._checkResponse)
    .catch(console.log)
  }

  deleteLike(_id) {
    return fetch(this._options.baseUrl + "/cards/" + _id + "/likes", {
      method: "DELETE",
      headers: this._options.headers,
      credentials: 'include',
    }).then(this._checkResponse)
    .catch(console.log)
  }

  addImage(name,link) {
    return fetch(this._options.baseUrl + "/cards",{
      method: "POST",
      headers: this._options.headers,
      credentials: 'include',
      body: JSON.stringify({
        name,
        link
      })
    }).then(this._checkResponse)
    .catch(console.log)
  }

  deleteCard(cardId) {
    return fetch(this._options.baseUrl + "/cards/" + cardId,{
      method: "DELETE",
      headers: this._options.headers,
      credentials: 'include',
    }).then(this._checkResponse)
    .catch(console.log)
  }

  updateToken(token) {
    this._options.headers['Authorization'] = `Bearer ${token}`;
  }
}

const token = localStorage.getItem('jwt');

export const api = new Api({
  baseUrl: `${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:3001'}`,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  credentials: 'include',
});
