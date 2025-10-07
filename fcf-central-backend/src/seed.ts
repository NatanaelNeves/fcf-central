import dotenv from 'dotenv';
import connectDB from './config/db';
import Usuario from './models/Usuario';
import Orcamento from './models/Orcamento';
import Despesa from './models/Despesa';
import Receita from './models/Receita';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Limpando banco de dados...');
    await Usuario.deleteMany({});
    await Orcamento.deleteMany({});
    await Despesa.deleteMany({});
    await Receita.deleteMany({});

    console.log('👤 Criando usuários...');
    const usuarios = await Usuario.create([
      {
        nome: 'Administrador FCF',
        email: 'admin@fcf.com.br',
        senha_hash: 'senha123',
        role: 'admin'
      },
      {
        nome: 'Usuário Teste',
        email: 'usuario@fcf.com.br',
        senha_hash: 'senha123',
        role: 'user'
      }
    ]);

    const adminId = usuarios[0]._id;
    const userId = usuarios[1]._id;

    console.log('💰 Criando orçamentos...');
    await Orcamento.create([
      // Orçamentos de Despesa - Outubro 2025
      {
        categoria_dre: 'Despesas com Pessoal',
        mes: 10,
        ano: 2025,
        valor_orcado: 80000,
        tipo: 'despesa'
      },
      {
        categoria_dre: 'Despesas Administrativas',
        mes: 10,
        ano: 2025,
        valor_orcado: 25000,
        tipo: 'despesa'
      },
      {
        categoria_dre: 'Despesas Operacionais',
        mes: 10,
        ano: 2025,
        valor_orcado: 15000,
        tipo: 'despesa'
      },
      {
        categoria_dre: 'Marketing e Comunicação',
        mes: 10,
        ano: 2025,
        valor_orcado: 10000,
        tipo: 'despesa'
      },
      // Orçamentos de Receita - Outubro 2025
      {
        categoria_dre: 'Receitas de Patrocínio',
        mes: 10,
        ano: 2025,
        valor_orcado: 100000,
        tipo: 'receita'
      },
      {
        categoria_dre: 'Receitas de Eventos',
        mes: 10,
        ano: 2025,
        valor_orcado: 30000,
        tipo: 'receita'
      },
      {
        categoria_dre: 'Outras Receitas',
        mes: 10,
        ano: 2025,
        valor_orcado: 20000,
        tipo: 'receita'
      }
    ]);

    console.log('📤 Criando despesas de exemplo...');
    await Despesa.create([
      {
        usuario_id: adminId,
        banco: 'Banco do Brasil',
        fornecedor: 'Empresa de Limpeza ABC',
        descricao: 'Serviços de limpeza mensal',
        data_pagamento: new Date('2025-10-05'),
        valor_pago: 3500,
        forma_pagamento: 'transferencia',
        categoria_dre: 'Despesas Administrativas',
        plano_de_contas: 'Serviços de Terceiros',
        subgrupo: 'Limpeza',
        audit: [{
          acao: 'create',
          usuario_id: adminId,
          data: new Date()
        }]
      },
      {
        usuario_id: userId,
        banco: 'Caixa Econômica',
        fornecedor: 'Fornecedor Material Escritório',
        descricao: 'Papelaria e material de escritório',
        data_pagamento: new Date('2025-10-10'),
        valor_pago: 1200,
        forma_pagamento: 'cartao_credito',
        categoria_dre: 'Despesas Operacionais',
        plano_de_contas: 'Material de Escritório',
        audit: [{
          acao: 'create',
          usuario_id: userId,
          data: new Date()
        }]
      },
      {
        usuario_id: adminId,
        banco: 'Banco do Brasil',
        fornecedor: 'Agência de Marketing Digital',
        descricao: 'Campanha redes sociais outubro',
        data_pagamento: new Date('2025-10-01'),
        valor_pago: 5000,
        forma_pagamento: 'pix',
        categoria_dre: 'Marketing e Comunicação',
        plano_de_contas: 'Marketing Digital',
        subgrupo: 'Redes Sociais',
        audit: [{
          acao: 'create',
          usuario_id: adminId,
          data: new Date()
        }]
      },
      {
        usuario_id: adminId,
        banco: 'Bradesco',
        fornecedor: 'Folha de Pagamento',
        descricao: 'Salários funcionários outubro',
        data_pagamento: new Date('2025-10-05'),
        valor_pago: 45000,
        forma_pagamento: 'transferencia',
        categoria_dre: 'Despesas com Pessoal',
        plano_de_contas: 'Salários',
        audit: [{
          acao: 'create',
          usuario_id: adminId,
          data: new Date()
        }]
      }
    ]);

    console.log('📥 Criando receitas de exemplo...');
    await Receita.create([
      {
        usuario_id: adminId,
        cliente: 'Empresa Patrocinadora XYZ',
        descricao: 'Patrocínio master campeonato estadual',
        data_recebimento: new Date('2025-10-01'),
        valor_recebido: 50000,
        forma_recebimento: 'transferencia',
        categoria_dre: 'Receitas de Patrocínio',
        plano_de_contas: 'Patrocínio Master',
        audit: [{
          acao: 'create',
          usuario_id: adminId,
          data: new Date()
        }]
      },
      {
        usuario_id: adminId,
        cliente: 'Clube Associado ABC',
        descricao: 'Taxa de participação campeonato',
        data_recebimento: new Date('2025-10-03'),
        valor_recebido: 8000,
        forma_recebimento: 'pix',
        categoria_dre: 'Receitas de Eventos',
        plano_de_contas: 'Taxas de Participação',
        audit: [{
          acao: 'create',
          usuario_id: adminId,
          data: new Date()
        }]
      },
      {
        usuario_id: userId,
        cliente: 'Venda de Ingressos Online',
        descricao: 'Receita bilheteria jogo final',
        data_recebimento: new Date('2025-10-15'),
        valor_recebido: 12000,
        forma_recebimento: 'cartao_credito',
        categoria_dre: 'Receitas de Eventos',
        plano_de_contas: 'Bilheteria',
        audit: [{
          acao: 'create',
          usuario_id: userId,
          data: new Date()
        }]
      },
      {
        usuario_id: adminId,
        cliente: 'Licenciamento de Marca',
        descricao: 'Royalties produtos licenciados',
        data_recebimento: new Date('2025-10-20'),
        valor_recebido: 5000,
        forma_recebimento: 'transferencia',
        categoria_dre: 'Outras Receitas',
        plano_de_contas: 'Licenciamento',
        audit: [{
          acao: 'create',
          usuario_id: adminId,
          data: new Date()
        }]
      }
    ]);

    console.log('✅ Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   👥 Usuários criados: ${usuarios.length}`);
    console.log(`   💰 Orçamentos criados: 7`);
    console.log(`   📤 Despesas criadas: 4`);
    console.log(`   📥 Receitas criadas: 4`);
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Admin: admin@fcf.com.br / senha123');
    console.log('   User:  usuario@fcf.com.br / senha123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
};

seedDatabase();