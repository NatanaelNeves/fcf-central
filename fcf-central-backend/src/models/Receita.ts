import mongoose, { Document, Schema } from 'mongoose';

interface IAudit {
  acao: 'create' | 'update' | 'delete';
  usuario_id: mongoose.Types.ObjectId;
  data: Date;
  meta?: any;
}

export interface IReceita extends Document {
  usuario_id: mongoose.Types.ObjectId;
  cliente: string;
  descricao: string;
  data_recebimento: Date;
  valor_recebido: number;
  forma_recebimento: string;
  categoria_dre: string;
  plano_de_contas: string;
  subgrupo?: string;
  comprovante_url?: string;
  deleted: boolean;
  deleted_by?: mongoose.Types.ObjectId;
  deleted_at?: Date;
  criado_em: Date;
  atualizado_em: Date;
  audit: IAudit[];
}

const receitaSchema = new Schema<IReceita>({
  usuario_id: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  cliente: {
    type: String,
    required: [true, 'Cliente é obrigatório'],
    trim: true
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true
  },
  data_recebimento: {
    type: Date,
    required: [true, 'Data de recebimento é obrigatória']
  },
  valor_recebido: {
    type: Number,
    required: [true, 'Valor é obrigatório'],
    min: [0.01, 'Valor deve ser maior que zero']
  },
  forma_recebimento: {
    type: String,
    required: [true, 'Forma de recebimento é obrigatória'],
    enum: ['dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'transferencia', 'boleto']
  },
  categoria_dre: {
    type: String,
    required: [true, 'Categoria DRE é obrigatória'],
    trim: true
  },
  plano_de_contas: {
    type: String,
    required: [true, 'Plano de contas é obrigatório'],
    trim: true
  },
  subgrupo: {
    type: String,
    trim: true
  },
  comprovante_url: {
    type: String,
    trim: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deleted_by: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  deleted_at: {
    type: Date
  },
  criado_em: {
    type: Date,
    default: Date.now
  },
  atualizado_em: {
    type: Date,
    default: Date.now
  },
  audit: [{
    acao: {
      type: String,
      enum: ['create', 'update', 'delete'],
      required: true
    },
    usuario_id: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    data: {
      type: Date,
      default: Date.now
    },
    meta: Schema.Types.Mixed
  }]
});

// Índices para performance
receitaSchema.index({ usuario_id: 1, data_recebimento: -1 });
receitaSchema.index({ categoria_dre: 1, data_recebimento: -1 });
receitaSchema.index({ cliente: 1 });
receitaSchema.index({ deleted: 1 });

// Atualizar data de modificação
receitaSchema.pre('save', function(next) {
  this.atualizado_em = new Date();
  next();
});

export default mongoose.model<IReceita>('Receita', receitaSchema);