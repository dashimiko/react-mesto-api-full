class Api {
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
}


const token = localStorage.getItem('jwt');

export const api = new Api({
  baseUrl: 'http://localhost:3001',
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  credentials: 'include',
});