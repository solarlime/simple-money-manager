/* eslint-disable class-methods-use-this, import/no-cycle */
import App from '../../app';
import AsyncForm from './AsyncForm';
import Account from '../../api/Account';

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
   * и сбрасывает форму
   * */
  onSubmit(options) {
    Account.create(options, (err, response) => {
      if (response) {
        App.getModal('createAccount').close();
        App.update();
      }
    });
  }
}
