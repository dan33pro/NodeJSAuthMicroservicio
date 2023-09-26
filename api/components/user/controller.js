const nanoid = require('nanoid');
const auth = require('../auth');
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

    async function upsert(body) {
        const user = {
            id: body.id,
            name: body.name,
            username: body.username,
        };
        if (!user.name) {
            return Promise.reject('No se indico la información necesaria');
        }
        if(!user.id) {
            user.id = nanoid();
        }

        if (body.password && body.username) {
            await auth.upsert({
                id: user.id,
                username: user.username,
                password: body.password,
            });
        }
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