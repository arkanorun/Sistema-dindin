const pool = require('../conexao')


const listarCategoria = async (req, res) => {
    const { id } = req.usuario

    try {
        const listaCategorias = await pool.query(`select id, descricao, usuario_id from categorias
         where usuario_id = $1`, [id])

        return res.json(listaCategorias.rows)

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const detalharCategoria = async (req, res) => {
    const { id } = req.params

    try {
        const categoriaDescricao = await pool.query(`select id, descricao, usuario_id from 
        categorias where id = $1`, [id])

        return res.json(categoriaDescricao.rows[0])

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const cadastrarCategoria = async (req, res) => {
    const { descricao } = req.body
    const { id } = req.usuario

    try {
        const cadastrar = await pool.query(`insert into categorias (usuario_id, descricao) values 
        ($1, $2) returning id, descricao, usuario_id`, [id, descricao])

        return res.status(201).json(cadastrar.rows[0])

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const atualizarCategoria = async (req, res) => {
    const { descricao } = req.body
    const { id } = req.params
    const usuario_id = req.usuario.id

    try {
        const categoriaAtualizada = await pool.query(`update categorias set descricao = $1 where 
        id = $2 and usuario_id = $3 returning *`, [descricao, id, usuario_id])

        return res.status(201).json()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}


const deletarCategoria = async (req, res) => {
    const { id } = req.params

    try {
        const deletarCategoria = await pool.query('delete from categorias where id = $1', [id])
        return res.status(204).json()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}


module.exports = {
    listarCategoria, detalharCategoria, cadastrarCategoria, atualizarCategoria,
    deletarCategoria
}