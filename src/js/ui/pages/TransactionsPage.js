/* eslint-disable class-methods-use-this, no-unused-vars, import/no-cycle */
import App from '../../app';
import User from '../../api/User';
import Account from '../../api/Account';
import Transaction from '../../api/Transaction';

/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
export default class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      console.error('Element does not exist!');
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    console.log(this.lastOptions);
    if (this.lastOptions) {
      this.render(this.lastOptions);
    } else {
      this.render();
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    document.querySelector('button.remove-account').addEventListener('click', () => {
      this.removeAccount(document.querySelector('li.active').getAttribute('data-id'));
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диалоговое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount(id) {
    // eslint-disable-next-line no-restricted-globals
    const confirmation = confirm('Вы действительно хотите удалить счёт?');
    if (confirmation) {
      Account.remove(id, User.current(), (err, response) => {
        if (response) {
          this.clear();
          App.update();
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждения действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction(id) {
    // eslint-disable-next-line no-restricted-globals
    const confirmation = confirm('Вы действительно хотите удалить транзакцию?');
    if (confirmation) {
      Transaction.remove(id, User.current(), (err, response) => {
        console.log(id);
        console.log(User.current());
        if (response) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options = false) {
    if (options) {
      Account.get(options.account_id, User.current(), (e, res) => {
        if (res) {
          this.renderTitle(res.data.find((item) => item.id === options.account_id).name);
          Transaction.list(options, (err, response) => {
            if (response) {
              this.renderTransactions(response.data);
              this.lastOptions = options;
            }
          });
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions();
    this.renderTitle('Название счёта');
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.querySelector('.content-title').innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(rawDate) {
    const date = new Date(rawDate);
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} г. в ${
      (date.getHours() < 10 ? `0${date.getHours()}` : date.getHours())}:${
      (date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes())}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const transaction = document.createElement('div');
    transaction.setAttribute('class', `transaction transaction_${item.type.toLowerCase()} row`);

    transaction.innerHTML = `${'<div class="col-md-7 transaction__details">\n'
        + '      <div class="transaction__icon">\n'
        + '          <span class="fa fa-money fa-2x"></span>\n'
        + '      </div>\n'
        + '      <div class="transaction__info">\n'
        + '          <h4 class="transaction__title">'}${item.name}</h4>\n`
        + '          <!-- дата -->\n'
        + `          <div class="transaction__date">${this.formatDate(item.created_at)}</div>\n`
        + '      </div>\n'
        + '    </div>\n'
        + '    <div class="col-md-3">\n'
        + '      <div class="transaction__summ">\n'
        + `      <!--  сумма -->\n${item.sum
        }        <span class="currency">₽</span>\n`
        + '      </div>\n'
        + '    </div>\n'
        + '    <div class="col-md-2 transaction__controls">\n'
        + '        <!-- в data-id нужно поместить id -->\n'
        + `        <button class="btn btn-danger transaction__remove" data-id="${item.transaction}">\n`
        + '            <i class="fa fa-trash"></i>  \n'
        + '        </button>\n'
        + '    </div>';

    const button = transaction.querySelector('button.transaction__remove');
    button.addEventListener('click', () => {
      this.removeTransaction(button.getAttribute('data-id'));
    });

    return transaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data = 0) {
    const content = document.querySelector('.content');
    Array.from(content.children).forEach((item) => content.removeChild(item));
    if (data !== 0) {
      for (const item of data) {
        document.querySelector('.content').append(this.getTransactionHTML(item));
      }
    }
  }
}
