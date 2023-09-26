const nanoid = require('nanoid');
const TABLA = 'user';

module.exports = function (injectedStore) {
    let store = injectedStore;
    if (!store) {
        store = require('../../../store/dummy');
    }
    function list() {
        return store.list(TABLA);
    }

    function get(id) {
        return store.get(TABLA, id);
    }

    function upsert(data) {
        [id, name] = data;
        if (!name) {
            return Promise.reject('No se indico la información necesaria');
        }
        if(!id) {
            id = nanoid();
        }

        const user = {
            id,
            name
        };
        return store.upsert(TABLA, user);
    }

    function remove(id) {
        if(!id) {
            return Promise.reject('No se indico el id del usario');
        }
        return store.remove(TABLA, id);
    }

    return {
        list,
        get,
        upsert,
        remove,
    };
};