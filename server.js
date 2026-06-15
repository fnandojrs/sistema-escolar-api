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

    res.json({
      sucesso: true
    });

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: erro.message
    });

  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});