/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство HOST, равно значению Entity.HOST.
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';
  static HOST = Entity.HOST;
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
      localStorage['user'] = JSON.stringify(user);
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent(user) {
      localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
      if (localStorage['user']) {
          return JSON.parse(localStorage['user']);
      }
      else {
          console.log('localstorage[user] does not exist');
      }
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch( data, callback = f => f ) {
      createRequest({
          url: this.HOST + this.URL + '/current',
          data: data,
          responseType: 'json',
          method: 'GET',
          callback: (err, response) => {
              if (response.user) {
                  this.setCurrent(response.user);
              }
              else {
                  this.unsetCurrent();
              }
              callback(err, response);
          }
      });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login( data, callback = f => f ) {
      createRequest({
          url: this.HOST + this.URL + '/login',
          data: data,
          responseType: 'json',
          method: 'POST',
          callback: (err, response) => {
              callback(err, response);
          }
      });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register( data, callback = f => f) {
      createRequest({
          url: this.HOST + this.URL + '/register',
          data: data,
          responseType: 'json',
          method: 'POST',
          callback: (err, response) => {
              if (response.user) {
                  this.setCurrent(response.user);
              }
              callback(err, response);
          }
      });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout( data, callback = f => f ) {
      createRequest({
          url: this.HOST + this.URL + '/logout',
          data: data,
          responseType: 'json',
          method: 'POST',
          callback: (err, response) => {
              callback(err, response);
          }
      });
  }
}