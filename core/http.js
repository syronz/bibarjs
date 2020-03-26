import {API_URL} from '../environments.js'


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
  // } catch(e) {
  //   console.warn(e)
  // }
}

export function post(url, body) {

  console.log("this is post", window.baseHref)
  return fetchAsync('POST', url, body);
}

export function get(url) {
  return fetchAsync('GET', url);
}
