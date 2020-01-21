/**
 * Класс LoginForm управляет формой
 * входа в портал
 * Наследуется от AsyncForm
 * */
class LoginForm extends AsyncForm{
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(options) {
    User.login(options, (err, response) => {
      if (response) {
        App.setState('user-logged');
        const close = new Modal(document.querySelector('#modal-login'));
        close.close();
      }
    });
  }
}
