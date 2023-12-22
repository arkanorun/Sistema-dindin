const extratoTrans = async (req, res) => {
    const { id } = req.usuario

    try {
        const extrato = await pool.query(`select sum(valor) as entrada, (select sum(valor) as 
        saida from transacoes where usuario_id = $1 and tipo = $2) as saida from transacoes where
        usuario_id = $1 and tipo = $3`, [id, "saida", "entrada"])

        return res.json({
            entrada: Number(extrato.rows[0].entrada),
            saida: Number(extrato.rows[0].saida)
        })

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })

    }
}

module.exports = extratoTrans;
