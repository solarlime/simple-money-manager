/* eslint-disable camelcase */
const router = require('express').Router();
const multer = require('multer');

const upload = multer();
const uniqid = require('uniqid');

const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync');

// запрос списка транзакций
router.get('/', upload.none(), (request, response) => {
  const db = low(new FileSync('db.json'));// получение БД
  // получение значения списка транзакций, для указанного счёта
  const transactions = db.get('transactions').filter({ account_id: request.query.account_id }).value();
  // отправка ответа со списком транзакций
  response.json({ success: true, data: transactions });
});

router.post('/', upload.none(), (request, response) => {
  const db = low(new FileSync('db.json'));// получение БД
  const transactions = db.get('transactions');// получение всех транзакций
  const { _method } = request.body;// получение используемого HTTP метода
  if (_method === 'DELETE') { // если метод DELETE...
    const { transaction } = request.body;// получение id из тела запроса
    // нахождение удаляемой транзакции
    const removingTransaction = transactions.find({ transaction });
    if (removingTransaction.value()) { // если значение транзакции существует...
      transactions.remove({ transaction }).write();// удалить транзакцию и записать это в БД
      response.json({ success: true });// отправление ответа с успехом
    } else { // если значение транзакции не существует...
      response.json({ success: false });// отправление ответа с неудачей
    }
  }
  if (_method === 'PUT') { // если метод PUT...
    const {
      type, name, sum, account_id,
    } = request.body;// получение значений из тела запроса
    // нахождение значения текущего пользователя
    const currentUser = db.get('users').find({ isAuthorized: true }).value();
    if (!currentUser) {
      // если текущего авторизованного пользователя нет
      // отправление ответа с ошибкой о необходимости авторизации
      response.json({ success: false, error: 'Необходима авторизация' });
    } else {
      // если авторизованный пользователь существует
      const currentUserId = currentUser.user_id;// получить id текущего пользователя
      // добавление существующей транзакцию к списку и записывание в БД
      transactions.push({
        type: type.toUpperCase(),
        name,
        transaction: uniqid(),
        sum: +sum,
        account_id,
        user_id: currentUserId,
        created_at: new Date().toISOString(),
      }).write();
      response.json({ success: true });// отправление ответа с успешностью
    }
  }
});

module.exports = router;
