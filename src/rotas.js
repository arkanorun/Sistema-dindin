const { Router } = require("express")

const { cadastrarTransacao, listarTransacao, detalharTransacao, atualizarTransacao,
    excluirTransacao } = require("./controladores/transacoes")

const { cadastrarUsuarios, login, detalharUsuario, atualizarUsuario } =
    require("./controladores/usuarios")

const { cadastrarCategoria, detalharCategoria, listarCategoria, atualizarCategoria,
    deletarCategoria } = require("./controladores/categorias")

const { validarCadastrarUsuario, validarSenha, validarAtualizarUsuario } =
    require("./intermediarios/validarUsuarios")

const { verificarUsuarioLogado } = require("./intermediarios/autenticacao")

const { validarCadastrarCategoria, validarDetalharCategoria, validarAtualizarCategoria,
    validarDeletarCategoria } = require("./intermediarios/validarCategorias")

const { intermediarExtractTransacao } = require("./intermediarios/validarExtrato")

const extratoTrans = require("./controladores/extrato")

const { intermediarCadastroTransacao, intermediarListagemTransacoes, intermediarDetalhesTransacao,
    intermediarAtualizarTransacaoId, intermediarDeletarTransacaoId } =
    require("./intermediarios/validarTransacoes")

const rotas = Router()



rotas.post('/usuario', validarCadastrarUsuario, cadastrarUsuarios)
rotas.post('/login', validarSenha, login)

rotas.use(verificarUsuarioLogado)

rotas.get('/usuario', detalharUsuario)
rotas.put('/usuario', validarAtualizarUsuario, atualizarUsuario)

rotas.get('/categoria', listarCategoria)
rotas.get('/categoria/:id', validarDetalharCategoria, detalharCategoria)
rotas.post('/categoria', validarCadastrarCategoria, cadastrarCategoria)
rotas.put('/categoria/:id', validarAtualizarCategoria, atualizarCategoria)
rotas.delete('/categoria/:id', validarDeletarCategoria, deletarCategoria)

rotas.post('/transacao', intermediarCadastroTransacao, cadastrarTransacao)
rotas.get('/transacao', intermediarListagemTransacoes, listarTransacao)
rotas.get('/transacao/extrato', intermediarExtractTransacao, extratoTrans)
rotas.get('/transacao/:id', intermediarDetalhesTransacao, detalharTransacao)
rotas.put('/transacao/:id', intermediarAtualizarTransacaoId, atualizarTransacao)
rotas.delete('/transacao/:id', intermediarDeletarTransacaoId, excluirTransacao)








module.exports = rotas