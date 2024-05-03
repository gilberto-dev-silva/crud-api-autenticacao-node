const express = require('express');
const Cliente = require('../models/cliente');
const connectToDatabase = require('../database/database');

const router = express.Router();

connectToDatabase();

router.route('/clientes')
    /* 1) Recurso para criar cliente (acessar em POST http://localhost:8000/api/clientes) */
    .post(function (req, res) {
        const cliente = new Cliente();
        cliente.nomeFantasia = req.body.nomeFantasia;
        cliente.razaoSocial = req.body.razaoSocial;
        cliente.cnpj = req.body.cnpj;

        cliente.save()
            .then(() => {
                res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send('Erro ao tentar salconst o cliente: ' + error);
            });
    })

    /* 2) Recurso para recuperar todos clientes (acessar em GET http://localhost:8000/api/clientes) */
    .get(async (req, res) => {
        try {
            const clienteFind = await Cliente.find();
            console.log(clienteFind);
            res.status(200).json(clienteFind)
        } catch (err) {
            res.status(500).json(err);
        }
    })

/* 3) Recurso para recuperar cliente por id (acessar em Get http://localhost:8000/api/clientes/id/:id)*/
router.route('/clientes/id/:id').get(async function (req, res) {
    try {
        const id = req.params.id;
        const cliente = await Cliente.findById(id);
        if (!cliente) {
            res.status(404).json({ message: 'Cliente not found' });
        } else {
            res.json(cliente);
        }
    } catch (error) {
        console.log('Error retrieving client:', error);
        res.status(500).json({ message: 'Error retrieving client' });
    }
})

    /* 4) Recurso para atualizar dados do cliente (acessar em PUT http://localhost:8000/api/clientes/id/:id)*/
    .put(async function (req, res) {
        try {
            const id = req.params.id;
            const cliente = await Cliente.findById(id);
            if (!cliente) {
                return res.json({ message: 'Cliente não encontrado!' });
            }

            const { nomeFantasia, razaoSocial, cnpj } = req.body;
            await Cliente.updateOne({ _id: id }, { $set: { nomeFantasia, razaoSocial, cnpj } });

            return res.json({ message: 'Cliente atualizado com sucesso!' });
        } catch (error) {
            return res.send('Erro ao tentar atualizar o cliente....: ' + error);
        }
    })

    /* 5) Recurso para deletar dados do cliente (acessar em DELETE http://localhost:8000/api/clientes/id/:id)*/
    .delete(async function (req, res) {
        try {
            const id = req.params.id;
            const cliente = await Cliente.findById(id);

            if (!cliente) {
                return res.status(404).json({ message: 'Cliente não encontrado!' });
            }

            await Cliente.deleteOne({ _id: id });
            return res.status(200).json({ message: 'Cliente deletado com sucesso!' });
        } catch (error) {
            return res.status(500).send('Erro ao tentar deletar o cliente....: ' + error);
        }
    });

module.exports = router;