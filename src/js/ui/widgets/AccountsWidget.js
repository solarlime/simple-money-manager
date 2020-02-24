/* eslint-disable class-methods-use-this, import/no-cycle */
import App from '../../app';
import User from '../../api/User';
import Account from '../../api/Account';

/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
export default class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
    } else {
      console.error('Element does not exist!');
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents(options) {
    const createAccountElem = document.querySelector('.create-account');

    createAccountElem.addEventListener('click', () => {
      App.getModal('createAccount').open();
    });
    let account = this.element.querySelector(`li.account[data-id="${options.account_id}"]`);
    if (!account) {
      account = this.element.querySelector('li.account');
    }
    account.classList.add('active');
    App.showPage('transactions', { account_id: account.getAttribute('data-id') });

    this.element.querySelectorAll('li.account').forEach((item) => {
      item.addEventListener('click', () => {
        document.body.classList.remove('sidebar-open');
        this.onSelectAccount(item);
      });
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update(options) {
    if (User.current()) {
      Account.list(User.current(), (err, response) => {
        if (response) {
          this.clear();
          response.data.forEach((item) => (this.renderItem(item)));
          App.getWidget('transactions').update();
          this.registerEvents(options);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    this.element.querySelectorAll('li.account').forEach((item) => item.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const active = document.querySelector('.active');
    if (active) {
      active.classList.remove('active');
    }
    element.classList.add('active');
    App.showPage('transactions', { account_id: element.getAttribute('data-id') });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const li = document.createElement('li');
    li.setAttribute('class', 'account');
    li.setAttribute('data-id', item.id);

    const a = document.createElement('a');
    a.setAttribute('href', '#');
    li.appendChild(a);

    const nameSpan = document.createElement('span');
    nameSpan.innerText = item.name;
    a.appendChild(nameSpan);

    a.insertAdjacentText('beforeend', ' / ');

    const sumSpan = document.createElement('span');
    sumSpan.innerText = item.sum;
    a.appendChild(sumSpan);

    return li;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(item) {
    this.element.appendChild(this.getAccountHTML(item));
  }
}
