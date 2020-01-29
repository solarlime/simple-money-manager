/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
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
      // this.update();
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
  registerEvents() {
    const createAccountElem = document.querySelector('.create-account');

    createAccountElem.addEventListener('click', () => {
      App.getModal('createAccount').open();
    });

    const defaultAccount = this.element.querySelector('li.account');
    defaultAccount.classList.add('active');
    App.showPage('transactions', { account_id: defaultAccount.getAttribute('data-id') });

    this.element.querySelectorAll('li.account').forEach((item) => {
      item.addEventListener('click', () => {
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
  update() {
    if (User.current()) {
      Account.list(User.current(), (err, response) => {
        if (response) {
          this.clear();
          response.data.forEach((item) => (this.renderItem(item)));
          this.registerEvents();
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
    let active = document.querySelector('.active');
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
    let li = document.createElement('li');
    li.setAttribute('class', 'account');
    li.setAttribute('data-id', item.id);

    let a = document.createElement('a');
    a.setAttribute('href', '#');
    li.appendChild(a);

    let nameSpan = document.createElement('span');
    nameSpan.innerText = item.name;
    a.appendChild(nameSpan);

    a.insertAdjacentText('beforeend', ' / ');

    let sumSpan = document.createElement('span');
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
