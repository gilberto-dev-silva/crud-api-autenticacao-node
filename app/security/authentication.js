const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const Usuario = require('../models/usuario');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const verifyToken = require('../security/verifyToken');

router.post('/registrar', async function (req, res) {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    let usuario = await Usuario.create({
      nome: req.body.nome,
      email: req.body.email,
      password: hashedPassword,

    });

    const token = jwt.sign({ id: usuario._id }, config.secret, {
      expiresIn: config.expiresIn 
    });

    res.status(200).send({ auth: true, token: token });
  } catch (err) {
    res.status(500).send("Ocorreu um erro ao registrar o usuário.");
  }
});


router.get('/validartoken', verifyToken, function (req, res, next) {
  Usuario.findById(req.userId, { password: 0 }, function (err, user) {
    try {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new Error('Usuário não encontrado.');
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send('Ocorreu um erro inesperado no servidor: ' + error.message);
    }
  });
});

router.post('/login', async function (req, res) {
  try {
    const user = await Usuario.findOne({ email: req.body.email });
    if (!user) return res.status(404).send('Usuário não encontrado.');

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: config.expiresIn
    });
    res.status(200).send({ auth: true, token: token });
  } catch (err) {
    res.status(500).send('Ocorreu um erro inesperado no servidor.');
  }
});

module.exports = router;