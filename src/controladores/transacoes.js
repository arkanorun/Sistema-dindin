const pool = require('../conexao')


const listarTransacao = async (req, res) => {
    const { id } = req.usuario
    const { filtro } = req.query
    let filtrarCampos
    let transacaoFiltrada = []

    try {
        const lista = await pool.query(
            `select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, 
            c.descricao AS categoria_nome from transacoes t join categorias c ON t.categoria_id =
            c.id where t.usuario_id = $1`, [id]
        )

        if (filtro) {
            for (let i in filtro) {
                filtrarCampos = lista.rows.filter((elemento) => {
                    return elemento.categoria_nome === filtro[i]
                })
                transacaoFiltrada = transacaoFiltrada.concat(filtrarCampos)
            }
            return res.status(200).json(transacaoFiltrada);
        }
        return res.status(200).json(lista.rows);

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const detalharTransacao = async (req, res) => {
    const { id } = req.params
    try {
        const lista = await pool.query(`select t.id, t.tipo, t.descricao, t.valor, t.data, 
        t.usuario_id, t.categoria_id, c.descricao as     categoria_nome from transacoes t join 
        categorias c ON t.categoria_id = c.id where t.id = $1`, [id])

        return res.status(200).json(lista.rows[0])

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const cadastrarTransacao = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body;
    const usuario_id = req.usuario.id

    try {
        const cadastrar = await pool.query( //VERIFICAR SE A SAÍDA DO INSOMNIA BATE COM O EXEMPLO
            `insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)
            values ($1, $2, $3, $4, $5, $6) returning id, tipo, descricao, valor, data, 
            usuario_id, categoria_id, (select descricao from categorias where id = $5) 
            as categoria_nome`, [tipo, descricao, valor, data, categoria_id, usuario_id]
        );

        return res.status(201).json(cadastrar.rows[0])
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
};

const atualizarTransacao = async (req, res) => {
    const usuario_id = req.usuario.id
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const { id } = req.params

    try {
        await pool.query(`update transacoes set descricao = $1, valor=$2, data=$3,
                         categoria_id=$4, tipo=$5 where id=$6 and usuario_id=$7`,
            [descricao, valor, data, categoria_id, tipo, id, usuario_id])
        return res.status(200).json()
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}


const excluirTransacao = async (req, res) => {
    const usuario_id = req.usuario.id;
    const { id } = req.params

    try {
        await pool.query('delete from transacoes where id = $1 and usuario_id = $2', [id,
            usuario_id])

        return res.status(200).json()
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}


module.exports = {
    cadastrarTransacao,
    listarTransacao,
    detalharTransacao,
    atualizarTransacao,
    excluirTransacao
}