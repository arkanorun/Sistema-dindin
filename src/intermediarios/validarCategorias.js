const { buscaDescricaoCategoria, buscaCategoriaUsuario_id } = require('../api')
const pool = require('../conexao')

const validarDetalharCategoria = async (req, res, next) => {
    const { id } = req.params
    const usuario_id = req.usuario.id

    if (!Number(id)) {
        return res.status(400).json({ mensagem: "informe um id no formato válido" })
    }

    const listarCategoriaUsuario = await buscaCategoriaUsuario_id(id, usuario_id)

    if (listarCategoriaUsuario.rowCount === 0) {
        return res.status(404).json({
            mensagem: `não foi encontrada categoria para o id informado`
        })
    }
    next()
}

const validarCadastrarCategoria = async (req, res, next) => {
    const { descricao } = req.body
    const { id } = req.usuario

    try {
        if (!descricao) {
            return res.status(404).json({ mensagem: "o campo descrição deve ser informado" })
        }
        const descricaoEncontrada = await buscaDescricaoCategoria(id, descricao)

        if (descricaoEncontrada) {
            return res.status(400).json({
                mensagem: "já existe uma categoria com a descricao informada para este usuário"
            })
        }
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
    next()
}


const validarAtualizarCategoria = async (req, res, next) => {
    const { id } = req.params
    const { descricao } = req.body
    const usuario_id = req.usuario.id

    try {

        if (!Number(id)) {
            return res.status(400).json({ mensagem: "informe um id no formato válido" })
        }

        if (!descricao) {
            return res.status(404).json({ mensagem: "o campo descrição deve ser informado" })
        }

        const listarCategoriaUsuario = await buscaCategoriaUsuario_id(id, usuario_id)

        if (listarCategoriaUsuario.rowCount === 0) {
            return res.status(404).json({
                mensagem: `não foi encontrada categoria para o id informado`
            })
        }

        const descricaoEncontrada = await buscaDescricaoCategoria(usuario_id, descricao)

        if (descricaoEncontrada) {
            return res.status(400).json({
                mensagem: "já existe uma categoria com a descricao informada para este usuário"
            })
        }

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
    next()
}

const validarDeletarCategoria = async (req, res, next) => {
    const { id } = req.params
    const usuario_id = req.usuario.id


    try {
        if (!Number(id)) {
            return res.status(400).json({ mensagem: "informe um id no formato válido" })
        }
        const listarCategoriaUsuario = await buscaCategoriaUsuario_id(id, usuario_id)

        const verificaTransacaoCategoria = await pool.query(`select * from transacoes where 
        categoria_id = $1`, [id])


        if (listarCategoriaUsuario.rowCount === 0) {
            return res.status(404).json({
                mensagem: `não foi encontrada categoria para o id informado`
            })
        }

        if (verificaTransacaoCategoria.rowCount > 0) {
            return res.status(404).json({
                mensagem: `não foi possível realizar a exclusão, pois existe uma transação 
                associada a esta categoria`
            })
        }

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
    next()
}


module.exports = {
    validarDetalharCategoria, validarCadastrarCategoria, validarAtualizarCategoria,
    validarDeletarCategoria
}