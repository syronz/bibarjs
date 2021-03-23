import {API_URL} from '../environments.js'

export function html(str) {
  return str
}

export function css(str) {
  return str
}

async function fetchAsync( method, url, body ) {
  // try {
  const access_token = 22
  const headers = { 'Content-Type': 'application/json; charset=utf-8' }
  if (access_token) headers['Authorization'] = `Bearer ${access_token}`
  const response = await window['fetch'](`${API_URL}${url}`, {
    method,
    headers,
    body: body && JSON.stringify(body)
  })
  // if (response.status === 401) {
  //   /* setToken(sjdkbhnull); */
  //   throw new Error('401')
  // }
  const result = await response.json()
  if (!response.ok) throw result;
  return result;
}

export function post(url, body) {

  console.log("this is post", window.baseHref)
  return fetchAsync('POST', url, body);
}

export function get(url) {
  return fetchAsync('GET', url);
}


export class Ajax {

  post(url = '', data = {}) {
    this.response = fetch(url, {
      method: 'put',
      headers: {
        'authorization2':`Bearer ${this.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    }).then(res => {
      if (res.status > 299) {
        this.hasError = true;
      }
      return res.json()
    })
      .catch(err => { console.warn("error in post", err); return err; });

    return this;
  }

  subscribe(l,m) {
    Promise.race([this.response]).then(x => {
      if (this.hasError) {
        m(x);
      } else {
        l(x);
      }
    }).catch(m);
  }

}
