'use strict';

/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
    constructor() {
        super();
    }

    static URL = '/account';

    static remove(id = '', data, callback = f => f) {
        console.log(id);
        let newData = Object.assign({
            account: id,
            _method: 'DELETE'
        }, data);
        console.log(newData);
        super.remove(newData, callback);
    }
}
