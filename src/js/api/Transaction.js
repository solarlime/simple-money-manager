/* eslint-disable no-useless-constructor */
import Entity from './Entity';

/**
 * Класс Transaction наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/transaction'
 * */
export default class Transaction extends Entity {
  constructor() {
    super();
  }

  static URL = '/transaction';

  static remove(id = '', data, callback = (f) => f) {
    const newData = {
      transaction: id,
      _method: 'DELETE',
      ...data,
    };
    super.remove(newData, callback);
  }
}
