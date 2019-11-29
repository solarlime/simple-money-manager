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
      console.log(localStorage['user']);
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
      return JSON.parse(localStorage['user']);
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch( data, callback = f => f ) {
      let xhr = createRequest({
          url: this.HOST + this.URL + '/current',
          data: data,
          responseType: 'json',
          method: 'GET',
          callback: callback
      });
      console.log(xhr);
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login( data, callback = f => f ) {

  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register( data, callback) {
      let xhr = createRequest({
          url: this.HOST + this.URL + '/register',
          data: data,
          responseType: 'json',
          method: 'POST',
          callback( err, response ) {
              function getDate(date) {
                  return `${
                      (date.getDate() < 10) ? '0' + date.getDate() : date.getDate()
                  }-${
                      (date.getMonth() < 10) ? '0' + date.getMonth() : date.getMonth()
                  }-${
                      date.getFullYear()
                  } ${
                      (date.getHours() < 10) ? '0' + date.getHours() : date.getHours()
                  }:${
                      (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()
                  }:${
                      (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()
                  }`
              }
              if (data.password.length < 3) {
                  response.error = {};
                  response.success = false;
                  delete response.user
                  console.log(response);
                  response.error.password = 'Количество символов в поле Пароль должно быть не менее 3.';
              }
              let regexp = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
              console.log(regexp.test(data.email));
              if (regexp.test(data.email) === false) {
                  if (!response.error) {
                      response.error = {};
                  }
                  response.success = false;
                  delete response.user
                  console.log(response);
                  response.error.email = 'E-mail введён неверно.'
              }
              if ((data.password.length > 2) && (regexp.test(data.email) === true) && response.error) {
                  console.log(response);
                  let date = new Date();
                  response.user.created_at = getDate(date);
                  response.user.updated_at = getDate(date);
                  User.setCurrent(response.user);
              }
              callback( err, response );
          }
      });
      console.log(xhr);
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout( data, callback = f => f ) {

  }
}

const user = {
    id: 12,
    name: 'Vlad'
};
const data = {
    name: 'Vlad',
    email: 'rest@test.ru',
    password: 'abra'
};

User.setCurrent(user);
//User.unsetCurrent(user);
//console.log(User.current());
//User.fetch(User.current(), ( err, response ) => {
//    console.log( response.user.id ); // 2
//});
User.register(data, (err, response) => {
    console.log(response);
});