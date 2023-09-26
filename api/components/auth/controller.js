const TABLA = "auth";
const auth = require('../../../auth/index');
const bcrypt = require('bcrypt');

module.exports = function (injectedStore) {
    let store = injectedStore;
    if (!store) {
        store = require('../../../store/dummy');
    }

    async function login(username, password) {
        const data = await store.query(TABLA, { username: username});
        return bcrypt.compare(password, data.password)
        .then(sonIguales => {
            if (sonIguales) {
                // Generar Token
                return auth.sign(data);
            } else {
                throw new Error('Información invalida');
            }
        });
    }

    async function upsert(data) {
        const authData = {
            id: data.id,
        };

        if (data.username) {
            authData.username = data.username;
        }
        if (data.password) {
            authData.password = await bcrypt.hash(data.password, 5);
        }

        return store.upsert(TABLA, authData);
    }

    return {
        upsert,
        login,
    };
};