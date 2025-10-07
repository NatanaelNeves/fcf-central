import mongoose, { Document, Schema } from 'mongoose';

export interface IOrcamento extends Document {
  categoria_dre: string;
  mes: number;
  ano: number;
  valor_orcado: number;
  tipo: 'receita' | 'despesa';
  criado_em: Date;
  atualizado_em: Date;
}

const orcamentoSchema = new Schema<IOrcamento>({
  categoria_dre: {
    type: String,
    required: [true, 'Categoria DRE é obrigatória'],
    trim: true
  },
  mes: {
    type: Number,
    required: [true, 'Mês é obrigatório'],
    min: 1,
    max: 12
  },
  ano: {
    type: Number,
    required: [true, 'Ano é obrigatório'],
    min: 2020,
    max: 2100
  },
  valor_orcado: {
    type: Number,
    required: [true, 'Valor orçado é obrigatório'],
    min: [0, 'Valor orçado não pode ser negativo']
  },
  tipo: {
    type: String,
    enum: ['receita', 'despesa'],
    required: [true, 'Tipo é obrigatório']
  },
  criado_em: {
    type: Date,
    default: Date.now
  },
  atualizado_em: {
    type: Date,
    default: Date.now
  }
});

// Índice único para evitar duplicatas (mesma categoria, mês, ano e tipo)
orcamentoSchema.index({ categoria_dre: 1, mes: 1, ano: 1, tipo: 1 }, { unique: true });

// Atualizar data de modificação
orcamentoSchema.pre('save', function(next) {
  this.atualizado_em = new Date();
  next();
});

export default mongoose.model<IOrcamento>('Orcamento', orcamentoSchema);