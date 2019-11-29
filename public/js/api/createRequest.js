'use strict';

/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let connection = new XMLHttpRequest();
    let formData = new FormData;
    let url = options.url;
    if (options.headers !== undefined) {
        console.log(Object.keys(options.headers)[0], Object.values(options.headers)[0]);
    }
    if (options.method === 'GET') {
        url = `${url}?`;
        for (let item in options.data) {
            url += `${item}=${options.data[item]}&`;
        }
        url = url.slice(0, url.length - 1);
    }
    connection.open(options.method, url);
    connection.responseType = options.responseType;
    connection.withCredentials = true;
    if (options.headers !== undefined) {
        connection.setRequestHeader(Object.keys(options.headers)[0].toString(), Object.values(options.headers)[0].toString());
    }
    if (options.method === 'GET') {
        connection.send();
    }
    else {
        for (let item in options.data) {
            formData.append(item, options.data[item]);
        }
        connection.send(formData);
    }

    connection.onload = function () {
        if (connection.status !== 200) {
            options.callback(connection.status, 0);
        }
        else {
            try {
                options.callback(0, connection.response);
            }
            catch (e) {
                options.callback(e, 0);
            }
        }
    };
    return connection;
};
