/* eslint-disable class-methods-use-this, import/no-cycle */
import App from '../../app';

/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */
export default class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    this.element = element;
    this.income = this.element.querySelector('button.create-income-button');
    this.expense = this.element.querySelector('button.create-expense-button');
    this.registerEvents();
  }

  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    this.income.addEventListener('click', () => {
      App.getModal('newIncome').open();
    });

    this.expense.addEventListener('click', () => {
      App.getModal('newExpense').open();
    });

    this.update();
  }

  update() {
    console.log(document.querySelectorAll('li.account'));
    if (!document.querySelector('li.account')) {
      this.income.setAttribute('disabled', '');
      this.expense.setAttribute('disabled', '');
    } else {
      this.income.removeAttribute('disabled');
      this.expense.removeAttribute('disabled');
    }
  }
}
