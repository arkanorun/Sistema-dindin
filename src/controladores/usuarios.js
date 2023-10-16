const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../conexao')
const { buscaUsuarioEmail } = require('../api')

const senhaJwt = process.env.JWT_HASH

const cadastrarUsuarios = async (req, res) => {
    const { nome, email, senha } = req.body

    try {

        const senhaCripografada = await bcrypt.hash(`${senha}`, 10)

        const cadastrar = await pool.query(`insert into usuarios (nome, email, senha) values 
        ($1,$2,$3) returning id, nome, email`, [nome, email, senhaCripografada])

        return res.status(201).json(cadastrar.rows[0])

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const login = async (req, res) => {
    const { email } = req.body

    try {

        const usuarioEncontrado = await buscaUsuarioEmail(email)

        const token = jwt.sign({ id: usuarioEncontrado.id }, senhaJwt, { expiresIn: '9h' })

        const { senha: _, ...usuarioLogado } = usuarioEncontrado
        return res.json({ usuario: usuarioLogado, token })

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const detalharUsuario = (req, res) => {
    const { senha: _, ...usuarioSemSenha } = req.usuario
    return res.status(200).json(usuarioSemSenha)
}

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    const { id } = req.usuario
    try {
        const senhaCripografada = await bcrypt.hash(`${senha}`, 10)
        const usuarioAtualizado = await pool.query(`update usuarios set nome = $1, email = $2,
     senha = $3 where id = $4`, [nome, email, senhaCripografada, id])

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}



module.exports = { cadastrarUsuarios, login, detalharUsuario, atualizarUsuario }