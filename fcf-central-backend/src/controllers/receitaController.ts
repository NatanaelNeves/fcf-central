import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Receita from '../models/Receita';
import { IUsuario } from '../models/Usuario';

// Extend Request interface to include usuario
declare global {
  namespace Express {
    interface Request {
      usuario?: IUsuario;
    }
  }
}

// @desc    Listar receitas com filtros
// @route   GET /api/receitas
// @access  Private
export const getReceitas = async (req: Request, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      categoria,
      forma_recebimento,
      cliente,
      page = 1,
      limit = 20
    } = req.query;

    const query: any = { deleted: false };

    if (startDate || endDate) {
      query.data_recebimento = {};
      if (startDate) query.data_recebimento.$gte = new Date(startDate as string);
      if (endDate) query.data_recebimento.$lte = new Date(endDate as string);
    }

    if (categoria) query.categoria_dre = categoria;
    if (forma_recebimento) query.forma_recebimento = forma_recebimento;
    if (cliente) query.cliente = new RegExp(cliente as string, 'i');

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const receitas = await Receita.find(query)
      .populate('usuario_id', 'nome email')
      .sort({ data_recebimento: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Receita.countDocuments(query);

    res.status(200).json({
      success: true,
      data: receitas,
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
      error: error.message || 'Erro ao buscar receitas'
    });
  }
};

// @desc    Obter receita por ID
// @route   GET /api/receitas/:id
// @access  Private
export const getReceita = async (req: Request, res: Response) => {
  try {
    const receita = await Receita.findById(req.params.id)
      .populate('usuario_id', 'nome email');

    if (!receita || receita.deleted) {
      return res.status(404).json({
        success: false,
        error: 'Receita não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: receita
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar receita'
    });
  }
};

// @desc    Criar nova receita
// @route   POST /api/receitas
// @access  Private
export const createReceita = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    const receitaData = {
      ...req.body,
      usuario_id: req.usuario._id,
      audit: [{
        acao: 'create' as const,
        usuario_id: req.usuario._id,
        data: new Date()
      }]
    };

    const receita = await Receita.create(receitaData);

    res.status(201).json({
      success: true,
      data: receita
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao criar receita'
    });
  }
};

// @desc    Atualizar receita
// @route   PUT /api/receitas/:id
// @access  Private
export const updateReceita = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    let receita = await Receita.findById(req.params.id);

    if (!receita || receita.deleted) {
      return res.status(404).json({
        success: false,
        error: 'Receita não encontrada'
      });
    }

    const auditEntry = {
      acao: 'update' as const,
      usuario_id: req.usuario._id,
      data: new Date(),
      meta: { campos_alterados: Object.keys(req.body) }
    };

    receita = await Receita.findByIdAndUpdate(
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
      data: receita
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao atualizar receita'
    });
  }
};

// @desc    Deletar receita (soft delete)
// @route   DELETE /api/receitas/:id
// @access  Private
export const deleteReceita = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    const receita = await Receita.findById(req.params.id);

    if (!receita || receita.deleted) {
      return res.status(404).json({
        success: false,
        error: 'Receita não encontrada'
      });
    }

    receita.deleted = true;
    receita.deleted_by = req.usuario._id as mongoose.Types.ObjectId;
    receita.deleted_at = new Date();
    receita.audit.push({
      acao: 'delete',
      usuario_id: req.usuario._id as mongoose.Types.ObjectId,
      data: new Date()
    });

    await receita.save();

    res.status(200).json({
      success: true,
      data: { message: 'Receita removida com sucesso' }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao deletar receita'
    });
  }
};