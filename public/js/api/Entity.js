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
  static list(data, callback = (f) => f) {
    return createRequest({
      url: this.HOST + this.URL,
      data,
      responseType: 'json',
      method: 'GET',
      callback,
    });
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback = (f) => f) {
    const newData = { _method: 'PUT', ...data };
    return createRequest({
      url: this.HOST + this.URL,
      data: newData,
      responseType: 'json',
      method: 'POST',
      callback,
    });
  }

  /**
   * Получает информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static get(id = '', data, callback = (f) => f) {
    const newData = { id, ...data };
    return createRequest({
      url: this.HOST + this.URL,
      data: newData,
      responseType: 'json',
      method: 'GET',
      callback,
    });
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback) {
    return createRequest({
      url: this.HOST + this.URL,
      data,
      responseType: 'json',
      method: 'POST',
      callback,
    });
  }
}
