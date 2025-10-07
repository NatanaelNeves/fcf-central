import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUsuario extends Document {
  nome: string;
  email: string;
  senha_hash: string;
  role: 'admin' | 'user';
  criado_em: Date;
  compararSenha(senha: string): Promise<boolean>;
}

const usuarioSchema = new Schema<IUsuario>({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  senha_hash: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  criado_em: {
    type: Date,
    default: Date.now
  }
});

// Índice para busca eficiente
usuarioSchema.index({ email: 1 });

// Hash da senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha_hash')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.senha_hash = await bcrypt.hash(this.senha_hash, salt);
  next();
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function(senha: string): Promise<boolean> {
  return await bcrypt.compare(senha, this.senha_hash);
};

export default mongoose.model<IUsuario>('Usuario', usuarioSchema);