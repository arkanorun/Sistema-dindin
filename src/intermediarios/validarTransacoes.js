const pool = require('../conexao');

const intermediarCadastroTransacao = async (req, res, next) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const { id } = req.usuario;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(404).json({
            mensagem: "os campos descricao, valor, data, categoria_id e tipo devem ser informados"
        })
    }

    if (tipo !== "entrada" && tipo !== "saida") {
        return res.status(400).json({
            mensagem: "Erro na descrição do tipo"
        })
    }

    try {
        const consultaDatabase = await pool.query(`select * from categorias where usuario_id = $1`
            , [id])

        if (!consultaDatabase.rows.find(elemento => elemento.id === categoria_id)) {
            return res.status(400).json({
                mensagem: "Categoria não encontrada"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const intermediarListagemTransacoes = async (req, res, next) => {
    const { id } = req.usuario;

    if (!id) {
        return res.status(401).json({
            mensagem: "Usuário não encontrado"
        })
    }

    next()
}

const intermediarDetalhesTransacao = async (req, res, next) => {
    const { id } = req.params
    const usuario_id = req.usuario.id

    if (!Number(id)) {
        return res.status(400).json({
            mensagem: "informe um id no formato válido"
        });
    }

    try {
        const lista = await pool.query(`
            select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, 
            c.descricao as categoria_nome from transacoes t join categorias c on
            t.categoria_id = c.id where t.id = $1 and t.usuario_id = $2`, [id, usuario_id])

        if (lista.rows.length === 0) {
            return res.status(404).json({
                mensagem: "Transação não encontrada"
            })
        }

        next()
    } catch (error) {
        console.error(error)
        return res.status(500).json({ mensagem: message.error })
    }
}

const intermediarAtualizarTransacaoId = async (req, res, next) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const usuario_id = req.usuario.id;
    const { id } = req.params

    if (!Number(id)) {
        return res.status(400).json({
            mensagem: "informe um id no formato válido"
        });
    }

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(404).json({
            mensagem: "os campos descricao, valor, data, categoria_id e tipo devem ser informados"
        })
    }

    if (tipo !== "entrada" && tipo !== "saida") {
        return res.status(400).json({
            mensagem: "Erro na descrição do tipo"
        })
    }

    try {
        const lista = await pool.query(`
            select * from transacoes where id = $1 and usuario_id = $2`, [id, usuario_id])

        if (lista.rows.length === 0) {
            return res.status(400).json({
                mensagem: "Transação não encontrada"
            })
        }

        if (lista.rows[0].categoria_id !== categoria_id) {
            return res.status(400).json({
                mensagem: "Categoria de transação não encontrada"
            })
        }
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }

    next()
}


const intermediarDeletarTransacaoId = async (req, res, next) => {
    const usuario_id = req.usuario.id;
    const { id } = req.params

    if (!Number(id)) {
        return res.status(400).json({
            mensagem: "informe um id no formato válido"
        });
    }

    try {
        const lista = await pool.query(`
            select * from transacoes where id = $1 and usuario_id = $2`, [id, usuario_id])

        if (lista.rows.length === 0) {
            return res.status(400).json({
                mensagem: "Transação não encontrada"
            })
        } next()
    }
    catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}
module.exports = {
    intermediarCadastroTransacao,
    intermediarListagemTransacoes,
    intermediarDetalhesTransacao,
    intermediarAtualizarTransacaoId,
    intermediarDeletarTransacaoId
}