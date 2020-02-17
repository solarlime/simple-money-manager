/* eslint-disable class-methods-use-this */
import User from '../../api/User';

/**
 * Класс UserWidget отвечает за
 * отображение информации о имени пользователя
 * после авторизации или его выхода из системы
 * */
export default class UserWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
    } else {
      // eslint-disable-next-line no-console
      console.error('Element does not exist!');
    }
  }

  /**
   * Получает информацию о текущем пользователе
   * с помощью User.current()
   * Если пользователь авторизован,
   * в элемент .user-name устанавливает имя
   * авторизованного пользователя
   * */
  update() {
    const response = User.current();
    if (response) {
      document.querySelector('p.user-name').innerHTML = response.name;
    }
  }
}
