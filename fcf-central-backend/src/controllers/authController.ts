import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Usuario, { IUsuario } from '../models/Usuario';

// Estender Request para incluir usuário
declare global {
  namespace Express {
    interface Request {
      usuario?: IUsuario;
    }
  }
}

// Gerar JWT Token
const gerarToken = (id: string, role: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado');
  }
  
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
};

// @desc    Registrar novo usuário
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, role } = req.body;

    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, preencha todos os campos obrigatórios'
      });
    }

    // Verificar se usuário já existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }

    // Criar usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha_hash: senha, // Será hasheado no model
      role: role || 'user'
    });

    // Gerar token
    const token = gerarToken((usuario._id as any).toString(), usuario.role);

    res.status(201).json({
      success: true,
      data: {
        token,
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao registrar usuário'
    });
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    // Validações
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, forneça email e senha'
      });
    }

    // Buscar usuário com senha
    const usuario = await Usuario.findOne({ email }).select('+senha_hash');
    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Gerar token
    const token = gerarToken((usuario._id as any).toString(), usuario.role);

    res.status(200).json({
      success: true,
      data: {
        token,
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao fazer login'
    });
  }
};

// @desc    Obter dados do usuário autenticado
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    const usuario = await Usuario.findById(req.usuario._id);

    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar usuário'
    });
  }
};