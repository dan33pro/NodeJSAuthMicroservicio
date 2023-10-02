const TABLA = {
    name: "Auth",
    pk: "id_auth",
};
const auth = require("../../../auth/index");
const error = require("../../../utils/error");
const sendMail = require("../../../utils/mailMessage");
const bcrypt = require("bcrypt");

module.exports = function (injectedStore) {
    let store = injectedStore;
    if (!store) {
        store = require("../../../store/mysql");
    }

    async function login(correoElectronico, userPassword) {
        const TABLAUSERS = {
            name: "Usuarios",
            pk: "cedula",
        };
        const dataUser = await store.query(TABLAUSERS, {
            correoElectronico: correoElectronico,
        });
        const data = await store.query(TABLA, { cedula: dataUser.cedula });
        return bcrypt
            .compare(userPassword, data.userPassword)
            .then((sonIguales) => {
                if (sonIguales) {
                    // Generar Token
                    return auth.sign(data);
                } else {
                    throw error("Información invalida", 418);
                }
            });
    }

    async function senVerificationPin(correoElectronico, metodo) {
        const TABLAUSERS = {
            name: "Usuarios",
            pk: "cedula",
        };
        const dataUser = await store.query(TABLAUSERS, {
            correoElectronico: correoElectronico,
        });
        const dataAuth = await store.query(TABLA, { cedula: dataUser.cedula });

        let pin = Math.trunc(Math.random() * 999999);
        dataAuth.pin = pin;

        await store.upsert(TABLA, dataAuth, "update");
        switch (metodo) {
            case "mail":
                return await sendMail(dataUser.correoElectronico, dataAuth.pin);
            case "phone":
                break;
            default:
                throw error("Metodo no valido", 405);
        }
    }

    async function upsert(data, accion) {
        const authData = {};

        if (data.cedula) {
            authData.cedula = data.cedula;
        }
        if (data.userPassword) {
            authData.userPassword = await bcrypt.hash(data.userPassword, 5);
        }

        if (accion == "update") {
            let authDatainBD = await store.query(TABLA, { cedula: data.cedula });
            authData.id_auth = authDatainBD.id_auth;
        }
        return store.upsert(TABLA, authData, accion);
    }

    return {
        upsert,
        login,
        senVerificationPin,
    };
};
