/* eslint-disable no-unused-vars, guard-for-in,prefer-destructuring */

/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
export default function createRequest(options = {}) {
  const connection = new XMLHttpRequest();
  const formData = new FormData();
  let url = options.url;

  connection.responseType = options.responseType;
  connection.withCredentials = true;

  if (options.headers !== undefined) {
    connection.setRequestHeader(
      Object.keys(options.headers)[0].toString(), Object.values(options.headers)[0].toString(),
    );
  }
  if (options.method === 'GET') {
    url = `${url}?`;
    for (const item in options.data) {
      url += `${item}=${options.data[item]}&`;
    }
    url = url.slice(0, url.length - 1);
  } else {
    for (const item in options.data) {
      formData.append(item, options.data[item]);
    }
  }
  connection.open(options.method, url);
  if (options.method === 'GET') {
    connection.send();
  } else {
    connection.send(formData);
  }

  function responseListener() {
    if (connection.readyState === 4) {
      try {
        options.callback(0, connection.response);
      } catch (e) {
        options.callback(e, 0);
      } finally {
        connection.removeEventListener('readystatechange', responseListener);
      }
    }
  }

  connection.addEventListener('readystatechange', responseListener);
  return connection;
}
