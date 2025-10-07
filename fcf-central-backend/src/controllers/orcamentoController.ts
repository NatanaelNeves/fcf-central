import { Request, Response } from 'express';
import Orcamento from '../models/Orcamento';
import Despesa from '../models/Despesa';
import Receita from '../models/Receita';

// @desc    Listar orçamentos
// @route   GET /api/orcamentos
// @access  Private
export const getOrcamentos = async (req: Request, res: Response) => {
  try {
    const { mes, ano, tipo } = req.query;
    const query: any = {};

    if (mes) query.mes = parseInt(mes as string);
    if (ano) query.ano = parseInt(ano as string);
    if (tipo) query.tipo = tipo;

    const orcamentos = await Orcamento.find(query).sort({ ano: -1, mes: -1 });

    res.status(200).json({
      success: true,
      data: orcamentos
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar orçamentos'
    });
  }
};

// @desc    Criar novo orçamento
// @route   POST /api/orcamentos
// @access  Private (Admin)
export const createOrcamento = async (req: Request, res: Response) => {
  try {
    const orcamento = await Orcamento.create(req.body);

    res.status(201).json({
      success: true,
      data: orcamento
    });
  } catch (error: any) {
    // Tratamento para duplicatas
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Já existe um orçamento para esta categoria, mês, ano e tipo'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao criar orçamento'
    });
  }
};

// @desc    Atualizar orçamento
// @route   PUT /api/orcamentos/:id
// @access  Private (Admin)
export const updateOrcamento = async (req: Request, res: Response) => {
  try {
    const orcamento = await Orcamento.findByIdAndUpdate(
      req.params.id,
      { ...req.body, atualizado_em: new Date() },
      { new: true, runValidators: true }
    );

    if (!orcamento) {
      return res.status(404).json({
        success: false,
        error: 'Orçamento não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: orcamento
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao atualizar orçamento'
    });
  }
};

// @desc    Deletar orçamento
// @route   DELETE /api/orcamentos/:id
// @access  Private (Admin)
export const deleteOrcamento = async (req: Request, res: Response) => {
  try {
    const orcamento = await Orcamento.findByIdAndDelete(req.params.id);

    if (!orcamento) {
      return res.status(404).json({
        success: false,
        error: 'Orçamento não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: { message: 'Orçamento removido com sucesso' }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao deletar orçamento'
    });
  }
};

// @desc    Comparativo Orçado x Realizado
// @route   GET /api/orcamentos/comparativo
// @access  Private
export const getComparativo = async (req: Request, res: Response) => {
  try {
    const { mes, ano } = req.query;

    if (!mes || !ano) {
      return res.status(400).json({
        success: false,
        error: 'Mês e ano são obrigatórios'
      });
    }

    const mesNum = parseInt(mes as string);
    const anoNum = parseInt(ano as string);

    // Buscar orçamentos do período
    const orcamentos = await Orcamento.find({ mes: mesNum, ano: anoNum });

    // Calcular período
    const dataInicio = new Date(anoNum, mesNum - 1, 1);
    const dataFim = new Date(anoNum, mesNum, 0, 23, 59, 59);

    // Processar cada orçamento
    const resultado = await Promise.all(
      orcamentos.map(async (orc) => {
        let valor_realizado = 0;

        if (orc.tipo === 'despesa') {
          // Somar despesas da categoria no período
          const result = await Despesa.aggregate([
            {
              $match: {
                categoria_dre: orc.categoria_dre,
                data_pagamento: { $gte: dataInicio, $lte: dataFim },
                deleted: false
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$valor_pago' }
              }
            }
          ]);

          valor_realizado = result[0]?.total || 0;
        } else {
          // Somar receitas da categoria no período
          const result = await Receita.aggregate([
            {
              $match: {
                categoria_dre: orc.categoria_dre,
                data_recebimento: { $gte: dataInicio, $lte: dataFim },
                deleted: false
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$valor_recebido' }
              }
            }
          ]);

          valor_realizado = result[0]?.total || 0;
        }

        // Calcular percentual
        const percentual = orc.valor_orcado > 0 
          ? (valor_realizado / orc.valor_orcado) * 100 
          : null;

        const diferenca = valor_realizado - orc.valor_orcado;

        return {
          categoria: orc.categoria_dre,
          tipo: orc.tipo,
          valor_orcado: orc.valor_orcado,
          valor_realizado,
          diferenca,
          percentual: percentual ? parseFloat(percentual.toFixed(2)) : null,
          status: diferenca > 0 ? 'acima' : diferenca < 0 ? 'abaixo' : 'dentro'
        };
      })
    );

    // Calcular totais
    const totais = {
      despesas_orcadas: resultado
        .filter(r => r.tipo === 'despesa')
        .reduce((acc, r) => acc + r.valor_orcado, 0),
      despesas_realizadas: resultado
        .filter(r => r.tipo === 'despesa')
        .reduce((acc, r) => acc + r.valor_realizado, 0),
      receitas_orcadas: resultado
        .filter(r => r.tipo === 'receita')
        .reduce((acc, r) => acc + r.valor_orcado, 0),
      receitas_realizadas: resultado
        .filter(r => r.tipo === 'receita')
        .reduce((acc, r) => acc + r.valor_realizado, 0)
    };

    totais['saldo_orcado'] = totais.receitas_orcadas - totais.despesas_orcadas;
    totais['saldo_realizado'] = totais.receitas_realizadas - totais.despesas_realizadas;

    res.status(200).json({
      success: true,
      data: {
        mes: mesNum,
        ano: anoNum,
        categorias: resultado,
        totais
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao gerar comparativo'
    });
  }
};