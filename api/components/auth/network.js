const express = require("express");

const response = require("../../../network/response");
const controller = require("./index");

const router = express.Router();
router.post("/login", login);
router.post("/send-verification-pin", senVerificationPin);
router.post("/verification-pin", verificationPin);

function login(req, res, next) {
  controller
    .login(req.body.correoElectronico, req.body.userPassword)
    .then((token) => {
      response.success(req, res, token, 200);
    })
    .catch(next);
}

function senVerificationPin(req, res, next) {
  controller
    .senVerificationPin(req.body.correoElectronico, req.body.metodo)
    .then(() => {
      response.success(req, res, "Se envio el pin de verificación", 200);
    })
    .catch(next);
}

function verificationPin(req, res, next) {
  controller
    .verificatioPin(req.body.correoElectronico, req.body.pin)
    .then((token) => {
      response.success(req, res, token, 200);
    })
    .catch(next);
}

module.exports = router;
