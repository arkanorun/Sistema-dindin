const pool = require('../conexao');

const intermediarExtractTransacao = async (req, res, next) => {
    const { id } = req.usuario

    try {
        const lista = await pool.query("select * from transacoes where usuario_id = $1", [id])

        if (lista.rows.length === 0) {
            return res.json({ mensagem: "Nenhuma transação encontrada para o usuário" })
        }

        req.resposta = lista.rows;

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

module.exports = { intermediarExtractTransacao };
