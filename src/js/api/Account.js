/* eslint-disable no-useless-constructor,linebreak-style */
import Entity from './Entity';

/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
export default class Account extends Entity {
  constructor() {
    super();
  }

  static URL = '/account';

  static remove(id = '', data, callback = (f) => f) {
    console.log(id);
    const newData = {
      account: id,
      _method: 'DELETE',
      ...data,
    };
    console.log(newData);
    super.remove(newData, callback);
  }
}
