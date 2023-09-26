const express = require('express');

const response = require('../../../network/response')
const controller = require('./index');

const router = express.Router();
router.get('/', list);
router.get('/:id', get);
router.post('/', upsert);
router.put('/', upsert);
router.delete('/:id', remove);

const list = async (req, res) => {
    try {
        const lista = await controller.list();
        response.success(req, res, lista, 200);
    } catch (error) {
        response.error(req, res, error.message, 500);
    }
    
};

const get = (req, res) => {
    controller.get(req.params.id)
        .then((user) => {
            response.success(req, res, user, 200);
        })
        .catch((err) => {
            response.error(req, res, err.message, 500);
        });
};

const upsert = (req, res) => {
    controller.upsert(req.body)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch((err) => {
            response.error(req, res, err.message, 500);
        });
};

const remove = (req, res) => {
    controller.remove(req.params.id)
        .then(() => {
            response.success(req, res, "Registro eliminado", 202);
        })
        .catch((err) => {
            response.error(req, res, err.message, 500);
        });
};

module.exports = router;

