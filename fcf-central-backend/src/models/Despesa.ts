import mongoose, { Document, Schema } from 'mongoose';

interface IAudit {
  acao: 'create' | 'update' | 'delete';
  usuario_id: mongoose.Types.ObjectId;
  data: Date;
  meta?: any;
}

export interface IDespesa extends Document {
  usuario_id: mongoose.Types.ObjectId;
  banco: string;
  fornecedor: string;
  descricao: string;
  data_pagamento: Date;
  valor_pago: number;
  forma_pagamento: string;
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

const despesaSchema = new Schema<IDespesa>({
  usuario_id: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  banco: {
    type: String,
    required: [true, 'Banco é obrigatório'],
    trim: true
  },
  fornecedor: {
    type: String,
    required: [true, 'Fornecedor é obrigatório'],
    trim: true
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true
  },
  data_pagamento: {
    type: Date,
    required: [true, 'Data de pagamento é obrigatória']
  },
  valor_pago: {
    type: Number,
    required: [true, 'Valor é obrigatório'],
    min: [0.01, 'Valor deve ser maior que zero']
  },
  forma_pagamento: {
    type: String,
    required: [true, 'Forma de pagamento é obrigatória'],
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
despesaSchema.index({ usuario_id: 1, data_pagamento: -1 });
despesaSchema.index({ categoria_dre: 1, data_pagamento: -1 });
despesaSchema.index({ fornecedor: 1 });
despesaSchema.index({ deleted: 1 });

// Atualizar data de modificação
despesaSchema.pre('save', function(next) {
  this.atualizado_em = new Date();
  next();
});

export default mongoose.model<IDespesa>('Despesa', despesaSchema);