const TABLA = {
    name: "Auth",
    pk: "id_auth",
};
const auth = require("../../../auth/index");
const error = require("../../../utils/error");
const sendMail = require("../../../utils/mailMessage");
const sendSMS = require("../../../utils/smsMessage");
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
        const dataUser = (await store.query(TABLAUSERS, {
            correoElectronico: correoElectronico,
        }))[0];
        const data = (await store.query(TABLA, { cedula: dataUser.cedula }))[0];
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

    async function verificatioPin(correoElectronico, pin) {
        const TABLAUSERS = {
            name: "Usuarios",
            pk: "cedula",
        };
        const dataUser = (await store.query(TABLAUSERS, {
            correoElectronico: correoElectronico,
        }))[0];
        const dataAuth = (await store.query(TABLA, { cedula: dataUser.cedula }))[0];
        if (dataAuth.pinIntents >= 3) {
            dataAuth.pin = null;
            dataAuth.pinIntents = 0;

            await store.upsert(TABLA, dataAuth, "update");
            throw error("Se exedio el limite de intentos", 418);
        } else {
            dataAuth.pinIntents = dataAuth.pinIntents + 1;
            await store.upsert(TABLA, dataAuth, "update");
        }
        if (dataAuth.pin == pin && dataAuth.pin && pin) {
            // Generar Token
            let token = auth.sign(dataAuth);
            dataAuth.pin = null;
            dataAuth.pinIntents = 0;
            store.upsert(TABLA, dataAuth, "update");
            return token;
        } else {
            throw error("Pin invalido", 418);
        }
    }

    async function senVerificationPin(correoElectronico, metodo) {
        const TABLAUSERS = {
            name: "Usuarios",
            pk: "cedula",
        };
        const dataUser = (await store.query(TABLAUSERS, {
            correoElectronico: correoElectronico,
        }))[0];
        const dataAuth = (await store.query(TABLA, { cedula: dataUser.cedula }))[0];

        let pin = Math.trunc(Math.random() * 999999);
        dataAuth.pin = pin;

        await store.upsert(TABLA, dataAuth, "update");
        switch (metodo) {
            case "mail":
                return await sendMail(dataUser.correoElectronico, dataAuth.pin);
            case "phone":
                return await sendSMS(
                    dataUser.codPais,
                    dataUser.numeroCelular,
                    dataAuth.pin
                );
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
            let authDatainBD = (await store.query(TABLA, { cedula: data.cedula }))[0];
            authData.id_auth = authDatainBD.id_auth;
        }
        return store.upsert(TABLA, authData, accion);
    }

    return {
        upsert,
        login,
        senVerificationPin,
        verificatioPin,
    };
};
