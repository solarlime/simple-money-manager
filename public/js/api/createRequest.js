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
        url = `${url}?${Object.keys(options.data)[0]}=${options.data.username}&${Object.keys(options.data)[1]}=${options.data.password}`;
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
        formData.append(Object.keys(options.data)[0], options.data.username);
        formData.append(Object.keys(options.data)[1], options.data.password);
        connection.send(formData);
    }

    connection.onload = function () {
        if (connection.status !== 200) {
            options.callback(connection.status, 0);
        }
        else {
            if (options.method === 'GET') {
                options.callback(0, 'Data transferred by GET');
            }
            else {
                options.callback(0, formData);
            }
        }
    };
    return connection;
};