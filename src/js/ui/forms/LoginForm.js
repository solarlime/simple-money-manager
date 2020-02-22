/* eslint-disable class-methods-use-this, import/no-cycle */
import App from '../../app';
import User from '../../api/User';
import AsyncForm from './AsyncForm';

/**
 * Класс LoginForm управляет формой
 * входа в портал
 * Наследуется от AsyncForm
 * */
export default class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(options, callback) {
    User.login(options, (err, response) => {
      if (response) {
        App.setState('user-logged');
        App.getModal('login').close();
        callback();
      }
    });
  }
}
