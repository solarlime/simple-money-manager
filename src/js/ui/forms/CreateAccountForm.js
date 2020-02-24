/* eslint-disable class-methods-use-this, import/no-cycle */
import App from '../../app';
import AsyncForm from './AsyncForm';
import Account from '../../api/Account';
import User from '../../api/User';

/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * Наследуется от AsyncForm
 * */
export default class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно (в котором находится форма) в случае успеха,
   * а также вызывает App.update()
   * и сбрасывает форму.
   * Предварительно проверяет, использовано ли уже
   * такое имя, и запрашивает подтверждение.
   * */
  onSubmit(options, callback) {
    const duplicate = Array.from(document.querySelectorAll('li.account'))
      .map((item) => item.innerText.split(' / ')[0])
      .find((item) => item === options.name);
    let confirmation = true;
    if (duplicate) {
      // eslint-disable-next-line no-restricted-globals
      confirmation = confirm('Такое имя уже использовано. Всё равно создать?');
    }

    /**
     * Для однозначности выбора (если одновременно работают несколько
     * пользователей) запрашиваем user_id. Promise в помощь.
     */

    function getUser() {
      return new Promise((resolve) => {
        resolve(User.current());
      });
    }

    const resolveUser = getUser();
    resolveUser.then((res) => {
      if (confirmation) {
        Account.create({ user: res.id, ...options }, (err, response) => {
          if (response) {
            console.log(response);
            App.getModal('createAccount').close();
            callback();
            App.update({ account_id: response.account.id });
          }
        });
      }
    });
  }
}
