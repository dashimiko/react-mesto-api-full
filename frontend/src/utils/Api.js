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
