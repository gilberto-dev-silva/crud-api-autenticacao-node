const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
    nomeFantasia: { type: String, required: true },
    razaoSocial: { type: String, required: true },
    cnpj: { type: String, required: true }
});

module.exports = mongoose.model('Cliente', ClienteSchema);