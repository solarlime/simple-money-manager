/* eslint-disable no-useless-constructor, import/no-cycle */
import App from '../../app';
import User from '../../api/User';
import AsyncForm from './AsyncForm';
import Account from '../../api/Account';
import Transaction from '../../api/Transaction';

/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
export default class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    // this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(User.current(), (err, response) => {
      if (response) {
        const selectIncome = this.element.querySelector('#income-accounts-list');
        const selectExpense = this.element.querySelector('#expense-accounts-list');

        if (selectIncome) {
          Array.from(selectIncome.children).forEach((item) => selectIncome.removeChild(item));
        } else {
          Array.from(selectExpense.children).forEach((item) => selectExpense.removeChild(item));
        }

        response.data.forEach((item) => {
          const option = document.createElement('option');
          option.setAttribute('value', item.id);
          option.insertAdjacentText('beforeend', item.name);

          if (selectIncome) {
            selectIncome.appendChild(option);
          } else {
            selectExpense.appendChild(option);
          }
        });
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(options, callback) {
    Transaction.create(options, (err, response) => {
      if (response) {
        const selectIncome = this.element.querySelector('#income-accounts-list');

        if (selectIncome) {
          App.getModal('newIncome').close();
        } else {
          App.getModal('newExpense').close();
        }
        callback();
        App.update();
      }
    });
  }
}
