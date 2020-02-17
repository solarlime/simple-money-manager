/* eslint-disable class-methods-use-this, import/no-cycle */
import App from '../../app';
import User from '../../api/User';
import AsyncForm from './AsyncForm';

/**
 * Класс RegisterForm управляет формой
 * регистрации.
 * Наследуется от AsyncForm
 * */
export default class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(options) {
    User.register(options, (err, response) => {
      if (response) {
        App.setState('user-logged');
        App.getModal('register').close();
      }
    });
  }
}
