import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Usuario, { IUsuario } from '../models/Usuario';

interface JwtPayload {
  id: string;
  role: string;
}

// Estender Request para incluir usuário
declare global {
  namespace Express {
    interface Request {
      usuario?: IUsuario;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Verificar se o token está no header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado - Token não fornecido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Buscar usuário
    const usuario = await Usuario.findById(decoded.id).select('-senha_hash');

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Não autorizado - Token inválido'
    });
  }
};

// Middleware para verificar role específica
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    if (!roles.includes(req.usuario.role)) {
      return res.status(403).json({
        success: false,
        error: `Acesso negado. Role necessária: ${roles.join(' ou ')}`
      });
    }

    next();
  };
};