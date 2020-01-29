'use strict';

/**
 * Класс Transaction наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/transaction'
 * */
class Transaction extends Entity {
    constructor() {
        super();
    }

    static URL = '/transaction';

    static remove(id = '', data, callback = f => f) {
        let newData = Object.assign({
            transaction: id,
            _method: 'DELETE'
        }, data);
        super.remove(newData, callback);
    }
}
