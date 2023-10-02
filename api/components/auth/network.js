const express = require("express");

const response = require("../../../network/response");
const controller = require("./index");

const router = express.Router();
router.post("/login", login);
router.post("/verification-pin", senVerificationPin);

function login(req, res) {
  controller
    .login(req.body.correoElectronico, req.body.userPassword)
    .then((token) => {
      response.success(req, res, token, 200);
    })
    .catch((e) => {
      response.error(req, res, "Información ivalida", 400);
    });
}

function senVerificationPin(req, res) {
  controller
    .senVerificationPin(req.body.correoElectronico, req.body.metodo)
    .then(() => {
      response.success(req, res, "Se envio el pin de verificación", 200);
    })
    .catch((e) => {
      response.error(req, res, e.message, 400);
    });
}

module.exports = router;
