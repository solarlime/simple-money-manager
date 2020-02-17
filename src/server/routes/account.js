/* eslint-disable no-plusplus */
const router = require('express').Router();
const multer = require('multer');

const upload = multer();
const uniqid = require('uniqid');

const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync');

// функция создания счёта
function createAccount(response, name) {
  const db = low(new FileSync('db.json'));// получение БД
  const user = db.get('users').find({ isAuthorized: true });// поиск авторизованного пользователя
  const userValue = user.value();// получение значения авторизованного пользователя
  const createdAccount = { name, user_id: userValue.id, id: uniqid() };// создаваемый аккаунт
  db.get('accounts').push(createdAccount).write();// добавление созданного аккаунта к уже существующим и запись в БД
  response.json({ success: true, account: createdAccount });// отправка ответа с данными
}

// функция удаления счёта
function removeAccount(response, id) {
  const db = low(new FileSync('db.json'));// получение БД
  const accounts = db.get('accounts');// получение списка счетов
  const transactions = db.get('transactions');
  const removingAccount = accounts.find({ id });// нахождение нужного удаляемого счёта
  if (removingAccount.value()) { // если удаляемый аккаунт существует
    accounts.remove({ id }).write();// удалить и перезаписать аккаунт
    transactions.remove({ account_id: id }).write();
    response.json({ success: true });// отправка ответа успешности
  } else { // если аккаунта нету
    response.json({ success: false });// отправка ответа неуспешности
  }
}

// запрос изменения счета
router.post('/', upload.none(), (request, response) => {
  // получение метода и названия счёта
  const { _method, name } = request.body;
  if (_method === 'PUT') {
    // если метод PUT...
    createAccount(response, name);// создание счёта
  }

  if (_method === 'DELETE') { // если метод DELETE...
    removeAccount(response, request.body.account);// удаление счёта
  }
});

// запрос получения списка счетов
router.get('/:id?', upload.none(), (request, response) => {
  const db = low(new FileSync('db.json'));// получение БД
  const { id } = request.query; // получение id из запроса

  // получение списка счетов, которые принадлежат указанному пользователю
  const accounts = db.get('accounts').filter({ user_id: id }).value();
  for (let i = 0; i < accounts.length; i++) { // цикл по всем аккаунтам
    // получение всех транзакций для нужного счёта
    const transactions = db.get('transactions').filter({ account_id: accounts[i].id }).value();
    // подсчёт баланса для счёта
    accounts[i].sum = transactions.reduce((sum, a) => (a.type === 'EXPENSE' ? sum - a.sum : sum + a.sum), 0);
  }
  // отправка ответа со списком счётов и посчитанного баланса для каждого счёта
  response.json({ success: true, data: accounts });
});

module.exports = router;
