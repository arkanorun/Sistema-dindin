const validator = require("email-validator")
const bcrypt = require('bcrypt')
const { buscaUsuarioEmail } = require('../api')
const pool = require("../conexao")



const validarCadastrarUsuario = async (req, res, next) => {

    const { nome, email, senha } = req.body

    try {
        const validarEmail = validator.validate(email)

        const usuarioEncontrado = await buscaUsuarioEmail(email)

        if (!nome || !email || !senha) {
            return res.status(404).json({
                mensagem: "os campos nome, email e senha devem ser informados"
            })
        }
        if (!validarEmail || usuarioEncontrado) {
            return res.status(400).json({
                mensagem: "email inválido ou já existe usuário cadastrado com o email informado"
            })
        }

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
    next()
}


const validarSenha = async (req, res, next) => {
    let { senha, email } = req.body

    try {

        const usuarioEncontrado = await buscaUsuarioEmail(email)

        if (!senha || !email) {
            return res.status(404).json({
                mensagem: 'os campos email e senha são obrigatórios'
            })
        }
        if (!usuarioEncontrado) {
            return res.status(400).json({
                mensagem: "email inválido ou usuário não encontrado"
            })
        }
        const senhaValida = await bcrypt.compare(`${senha}`, usuarioEncontrado.senha)

        if (!senhaValida) {
            return res.status(400).json({
                mensagem: 'senha incorreta'
            })
        }
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
    next()
}


const validarAtualizarUsuario = async (req, res, next) => {
    const { nome, email, senha } = req.body
    const { id } = req.usuario

    try {
        const validarEmail = validator.validate(email)

        if (!nome || !email || !senha) {
            return res.status(404).json({
                mensagem: "os campos nome, email e senha devem ser informados"
            })
        }

        const lista = await pool.query(`select * from usuarios where id!= $1`, [id])
        const buscaUsuarioEmail = lista.rows.find((elemento) => {
            return elemento.email === email
        })

        if (!validarEmail || buscaUsuarioEmail) {
            return res.status(400).json({
                mensagem: "email inválido ou já existe usuário cadastrado com o email informado"
            })
        }
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
    next()
}


module.exports = { validarCadastrarUsuario, validarSenha, validarAtualizarUsuario }