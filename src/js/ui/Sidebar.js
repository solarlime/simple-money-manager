/* eslint-disable import/no-cycle */
import App from '../app';
import User from '../api/User';

/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
export default class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const button = document.querySelector('a.sidebar-toggle');
    button.addEventListener('click', (event) => {
      button.closest('body').classList.toggle('sidebar-open');
      button.closest('body').classList.toggle('sidebar-collapse');
      event.preventDefault();
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регистрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const regElem = document.querySelector('li.menu-item_register');
    const loginElem = document.querySelector('li.menu-item_login');
    const logoutElem = document.querySelector('li.menu-item_logout');

    regElem.addEventListener('click', () => {
      App.getModal('register').open();
    });

    loginElem.addEventListener('click', () => {
      App.getModal('login').open();
    });

    logoutElem.addEventListener('click', () => {
      User.logout(0, (err, response) => {
        if (response.success) {
          App.setState('init');
        }
      });
    });
  }
}
