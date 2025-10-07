import { Request, Response } from 'express';
import Despesa from '../models/Despesa';

// @desc    Listar despesas com filtros
// @route   GET /api/despesas
// @access  Private
export const getDespesas = async (req: Request, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      categoria,
      forma_pagamento,
      fornecedor,
      page = 1,
      limit = 20
    } = req.query;

    const query: any = { deleted: false };

    // Filtros opcionais
    if (startDate || endDate) {
      query.data_pagamento = {};
      if (startDate) query.data_pagamento.$gte = new Date(startDate as string);
      if (endDate) query.data_pagamento.$lte = new Date(endDate as string);
    }

    if (categoria) query.categoria_dre = categoria;
    if (forma_pagamento) query.forma_pagamento = forma_pagamento;
    if (fornecedor) query.fornecedor = new RegExp(fornecedor as string, 'i');

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const despesas = await Despesa.find(query)
      .populate('usuario_id', 'nome email')
      .sort({ data_pagamento: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Despesa.countDocuments(query);

    res.status(200).json({
      success: true,
      data: despesas,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar despesas'
    });
  }
};

// @desc    Obter despesa por ID
// @route   GET /api/despesas/:id
// @access  Private
export const getDespesa = async (req: Request, res: Response) => {
  try {
    const despesa = await Despesa.findById(req.params.id)
      .populate('usuario_id', 'nome email');

    if (!despesa || despesa.deleted) {
      return res.status(404).json({
        success: false,
        error: 'Despesa não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: despesa
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar despesa'
    });
  }
};

// @desc    Atualizar despesa
// @route   PUT /api/despesas/:id
// @access  Private
export const updateDespesa = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    let despesa = await Despesa.findById(req.params.id);

    if (!despesa || despesa.deleted) {
      return res.status(404).json({
        success: false,
        error: 'Despesa não encontrada'
      });
    }

    // Adicionar registro de auditoria
    const auditEntry = {
      acao: 'update' as const,
      usuario_id: req.usuario._id,
      data: new Date(),
      meta: { campos_alterados: Object.keys(req.body) }
    };

    despesa = await Despesa.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        atualizado_em: new Date(),
        $push: { audit: auditEntry }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: despesa
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao atualizar despesa'
    });
  }
};

// @desc    Deletar despesa (soft delete)
// @route   DELETE /api/despesas/:id
// @access  Private
export const deleteDespesa = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    const despesa = await Despesa.findById(req.params.id);

    if (!despesa || despesa.deleted) {
      return res.status(404).json({
        success: false,
        error: 'Despesa não encontrada'
      });
    }

    // Soft delete
    despesa.deleted = true;
    despesa.deleted_by = req.usuario._id as any;
    despesa.deleted_at = new Date();
    despesa.audit.push({
      acao: 'delete',
      usuario_id: req.usuario._id as any,
      data: new Date()
    });

    await despesa.save();

    res.status(200).json({
      success: true,
      data: { message: 'Despesa removida com sucesso' }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao deletar despesa'
    });
  }
};

// @desc    Criar nova despesa
// @route   POST /api/despesas
// @access  Private
export const createDespesa = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    const despesaData = {
      ...req.body,
      usuario_id: req.usuario._id,
      audit: [{
        acao: 'create' as const,
        usuario_id: req.usuario._id,
        data: new Date()
      }]
    };

    const despesa = await Despesa.create(despesaData);

    res.status(201).json({
      success: true,
      data: despesa
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao criar despesa'
    });
  }
};