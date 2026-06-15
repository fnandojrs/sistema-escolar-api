const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'yamabiko.proxy.rlwy.net',
  user: 'root',
  password: 'llfblPKemmWeXTdNLPnpoCWKASoDrWRO',
  database: 'railway',
  port: 30057
});

app.post('/fornecedor', async (req, res) => {
  try {
    const {
      empresa,
      cnpj,
      responsavel,
      telefone,
      email,
      produto,
      observacao,
      rua,
      bairro,
      numero,
      cep,
      complemento
    } = req.body;

    await pool.query(`
      INSERT INTO fornecedor (
        empresa,
        cnpj,
        responsavel,
        telefone,
        email,
        produto,
        observacao,
        rua,
        bairro,
        numero,
        cep,
        complemento
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      empresa,
      cnpj,
      responsavel,
      telefone,
      email,
      produto,
      observacao,
      rua,
      bairro,
      numero,
      cep,
      complemento
    ]);

    res.json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
});

app.post('/aluno', async (req, res) => {
  try {
    const {
      nome,
      cpf,
      rg,
      sexo,
      nomeMae,
      telMae,
      nomePai,
      telPai,
      medicamento,
      observacao,
      rua,
      bairro,
      numero,
      cep,
      complemento
    } = req.body;

    await pool.query(`
      INSERT INTO aluno (
        nome,
        cpf,
        rg,
        sexo,
        nome_mae,
        tel_mae,
        nome_pai,
        tel_pai,
        medicamento,
        observacao,
        rua,
        bairro,
        numero,
        cep,
        complemento
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nome,
      cpf,
      rg,
      sexo,
      nomeMae,
      telMae,
      nomePai,
      telPai,
      medicamento,
      observacao,
      rua,
      bairro,
      numero,
      cep,
      complemento
    ]);

    res.json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
});

app.post('/professor', async (req, res) => {
  try {
    const {
      nome,
      cpf,
      rg,
      sexo,
      telefone,
      email,
      disciplina,
      formacao,
      rua,
      bairro,
      numero,
      cep,
      complemento
    } = req.body;

    await pool.query(`
      INSERT INTO professor (
        nome,
        cpf,
        rg,
        sexo,
        telefone,
        email,
        disciplina,
        formacao,
        rua,
        bairro,
        numero,
        cep,
        complemento
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nome,
      cpf,
      rg,
      sexo,
      telefone,
      email,
      disciplina,
      formacao,
      rua,
      bairro,
      numero,
      cep,
      complemento
    ]);

    res.json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
});

app.get('/categoria', async (req, res) => {
  try {
    const [dados] = await pool.query(`
      SELECT
        id,
        nome
      FROM categoria
      ORDER BY nome
    `);
    res.json(dados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
});

app.get('/fornecedor', async (req, res) => {
  try {
    const [dados] = await pool.query(`
      SELECT
        id,
        empresa
      FROM fornecedor
      ORDER BY empresa
    `);
    res.json(dados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
});

app.post('/contas-pagar', async (req, res) => {
  try {
    const {
      fornecedor_id,
      categoria_id,
      descricao,
      valor_total,
      data_emissao,
      data_vencimento,
      status,
      juros,
      multa,
      numero_parcela,
      total_parcelas,
      centro_custo,
      codigo_boleto
    } = req.body;

    await pool.query(`
      INSERT INTO contas_pagar (
        fornecedor_id,
        categoria_id,
        descricao,
        valor_total,
        data_emissao,
        data_vencimento,
        status,
        juros,
        multa,
        numero_parcela,
        total_parcelas,
        centro_custo,
        codigo_boleto
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      fornecedor_id,
      categoria_id,
      descricao,
      valor_total,
      data_emissao,
      data_vencimento,
      status,
      juros,
      multa,
      numero_parcela,
      total_parcelas,
      centro_custo,
      codigo_boleto
    ]);

    res.json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
});

app.get('/contas-pagar', async (req, res) => {
  try {
    const [dados] = await pool.query(`
      SELECT
          cp.id,
          f.empresa AS fornecedor,
          c.nome AS categoria,
          cp.descricao,
          cp.valor_total AS valorTotal,
          cp.data_vencimento AS dataVencimento,
          cp.status,
          cp.numero_parcela AS numeroParcela,
          cp.total_parcelas AS totalParcelas
      FROM contas_pagar cp
      INNER JOIN fornecedor f
        ON f.id = cp.fornecedor_id
      INNER JOIN categoria c
        ON c.id = cp.categoria_id
      ORDER BY cp.id DESC
    `);
    res.json(dados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
});

/* ==================================================================
  NOVA ROTA: ATUALIZAR STATUS DE PAGAMENTO DA CONTA (PUT)
  ==================================================================
*/
app.put('/contas-pagar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Captura os dados enviados pelo Angular vindos do formulário modal de pagamento
    const { 
      status, 
      forma_pagamento, 
      formaPagamento, 
      data_pagamento, 
      dataPagamento, 
      valor_pago, 
      valorPago 
    } = req.body;

    // Garante que usará uma chave válida caso venha em camelCase ou snake_case
    const finalStatus = status || 'Pago';
    const finalForma = forma_pagamento || formaPagamento || 'PIX';
    const finalData = data_pagamento || dataPagamento || null;
    const finalValor = valor_pago || valorPago || 0;

    /*
      NOTA SOBRE O SEU BANCO DE DADOS:
      A query abaixo tenta salvar também a forma de pagamento, a data e o valor pago.
      Se essas colunas adicionais não existirem na sua tabela do MySQL, o banco dará um erro.
      
      Caso dê erro de coluna inexistente, use a query simplificada abaixo descomentando-a.
    */
    
    // QUERY COMPLETA (Recomendada se você tiver esses campos na tabela):
    await pool.query(`
      UPDATE contas_pagar 
      SET 
        status = ?, 
        forma_pagamento = ?, 
        data_pagamento = ?, 
        valor_pago = ?
      WHERE id = ?
    `, [finalStatus, finalForma, finalData, finalValor, id]);


    // QUERY SIMPLIFICADA (Se o seu banco só tiver a coluna 'status'):
    /*
    await pool.query(`
      UPDATE contas_pagar 
      SET status = ?
      WHERE id = ?
    `, [finalStatus, id]);
    */

    res.json({ sucesso: true, mensagem: `Conta #${id} alterada para ${finalStatus} com sucesso!` });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
});

/* ==================================================================
  ROTA ADICIONAL: EXCLUIR CONTA (DELETE)
  ==================================================================
*/
app.delete('/contas-pagar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM contas_pagar WHERE id = ?', [id]);
    res.json({ sucesso: true, mensagem: `Conta #${id} excluída com sucesso!` });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: erro.message });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});