const extratoTrans = (req, res) => {
    const responseIntermediario = req.resposta;

    const somaEntradas = responseIntermediario
        .filter((transacao) => transacao.tipo === "entrada")
        .reduce((accumulador, transacao) => accumulador + transacao.valor, 0)

    const somaSaidas = responseIntermediario
        .filter((transacao) => transacao.tipo === "saida")
        .reduce((accumulador, transacao) => accumulador + transacao.valor, 0)
    const entrada = somaEntradas !== 0 ? somaEntradas : 0
    const saida = somaSaidas !== 0 ? somaSaidas : 0
    const okResposta = {
        entrada,
        saida
    };

    return res.status(200).json(okResposta);
};

module.exports = extratoTrans;
