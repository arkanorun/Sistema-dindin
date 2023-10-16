const pool = require('./conexao')


const buscaUsuarioEmail = async (email) => {
    const usuarioLista = await pool.query('select * from usuarios')
    const busca = usuarioLista.rows.find((elemento) => {
        return elemento.email === email
    })
    return busca
}
const buscaDescricaoCategoria = async (usuario_id, descricao) => {
    const categoriaUsuario = await pool.query(`select * from categorias where usuario_id = $1 and
    descricao = $2`, [usuario_id, descricao])
    const buscaDescricao = categoriaUsuario.rows.find((elemento) => {
        return elemento.descricao === descricao
    })
    return buscaDescricao
}

const buscaCategoriaUsuario_id = async (id, usuario_id) => {
    const listarCategoriaUsuario = await pool.query(`select * from categorias where id = $1 and
    usuario_id = $2`, [id, usuario_id])
    return listarCategoriaUsuario
}









module.exports = { buscaUsuarioEmail, buscaDescricaoCategoria, buscaCategoriaUsuario_id }