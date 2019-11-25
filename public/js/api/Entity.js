'use strict';

/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * Имеет свойство HOST, равно 'https://bhj-diplom.letsdocode.ru'.
 * */
class Entity {
  static HOST = 'http://localhost:8000';
  static URL = '';
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list( data, callback = f => f ) {
    return createRequest({
      url: this.HOST + this.URL,
      data: data,
      responseType: 'json',
      method: 'GET',
      callback: callback
    });
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create( data, callback = f => f ) {
    let newData = Object.assign({
      _method: 'PUT'
    }, data);
    return createRequest({
      url: this.HOST + this.URL,
      data: newData,
      responseType: 'json',
      method: 'POST',
      callback: callback
    });
  }

  /**
   * Получает информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static get( id = '', data, callback = f => f ) {
    let newData = Object.assign({
      id: id
    }, data);
    return createRequest({
      url: this.HOST + this.URL,
      data: newData,
      responseType: 'json',
      method: 'GET',
      callback: callback
    });
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove( id = '', data, callback = f => f ) {
    let newData = Object.assign({
      id: id,
      _method: 'DELETE'
    }, data);
    return createRequest({
      url: this.HOST + this.URL,
      data: newData,
      responseType: 'json',
      method: 'POST',
      callback: callback
    });
  }
}
/*
const data = {
  mail: 'ivan@biz.pro',
  password: 'odinodin'
};
const callback = (err, response) => {
  if (err) {
    console.log('Error: ', err);
  }
  else {
    console.log(...response);
  }
};
console.log(Entity.list(data, callback));
console.log(Entity.create(data, callback));
console.log(Entity.get(10, data, callback));
console.log(Entity.remove(10, data, callback));
*/
