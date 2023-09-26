const db = {
    'user': [
        {id: 1, name: 'Carlos'},
    ],
};

const list = (tabla) => {
    return db[tabla];
};

const get = (tabla, id) => {
    let coleccion = list(tabla);
    return coleccion.filter( item => item.id == id)[0] || null;
};

const upsert = (tabla, data) => {
    let coleccion = list(tabla);
    db[coleccion].push(data);
};

const remove = (tabla, id) => {
    return true;
};

module.exports = {
    list,
    get,
    upsert,
    remove,
};