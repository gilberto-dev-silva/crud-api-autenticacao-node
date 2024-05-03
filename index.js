const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const clientes = require('./app/router/cliente.router');
const verifyToken = require('./app/security/verifyToken');
const authentication = require('./app/security/authentication');


app.use(bodyParser.json());

const port = process.env.port || 8000;
const router = express.Router();

router.use(verifyToken, function (req, res, next) {
    console.log('Alguém está fazendo requisição a api ;)');
    next();
});

//Rota que criamos para informar que a api está online
router.get('/online', function (req, res) {
    res.json({ message: 'Beleza! Eu estou online =)' });
});

//Chamar routes clientes
router.use(clientes);

//Chamar routes authentication
router.use('/auth/', authentication);

//Todas chamadas começaram com '/api/', exemplo localhost:8000/api/usuarios
app.use('/api', router);

app.listen(port);
console.log(`Iniciando o app na porta http://localhost:${port}/`);