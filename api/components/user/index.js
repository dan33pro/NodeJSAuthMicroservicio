const ctrl = require('./controller');
const store = require('../../../store/remote-mysql');
// const store = require('../../../store/mysql');

module.exports = ctrl(store);