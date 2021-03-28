import {API_URL} from '../environments.js'

export function html(str) {
  return str
}

export function css(str) {
  return str
}

/*
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
*/


export class Ajax {
  constructor() {
    this.token = localStorage.getItem('token');
  }


  fetch(method, url, body) {
    this.response = fetch(`${API_URL}${url}`, {
      method: method,
      headers: {
        'authorization':`Bearer ${this.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body),
    }).then(res => {
      if (res.status > 299) {
        this.hasError = true;
      }
      return res.json()
    })
      .catch(err => { console.warn("error in post", err); return err; });

  }

  post(url = '', data = {}) {
    this.fetch('post', url, data);
    return this;
  }

  put(url = '', data = {}) {
    this.fetch('put', url, data);
    return this;
  }

  get(url = '') {
    this.fetch('get', url);
    return this;
  }

  list(url = '') {
    this.get(`companies/${window.UserInfo.company_id}/${url}`);
    return this;
  }

  getNode(url = '') {
    this.get(`companies/${window.UserInfo.company_id}/nodes/${window.UserInfo.node_id}/${url}`);
    return this;
  }

  subscribe(success,failed) {
    Promise.race([this.response]).then(x => {
      if (this.hasError) {
        failed(x);
      } else {
        success(x);
      }
    }).catch(failed);
  }

}
