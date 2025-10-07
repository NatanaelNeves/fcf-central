import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

// Carregar variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 4000;

// Conectar ao banco de dados
connectDB();

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║        🚀 FCF CENTRAL API 🚀             ║
║                                           ║
║  Servidor rodando em:                    ║
║  http://localhost:${PORT}                    ║
║                                           ║
║  Ambiente: ${process.env.NODE_ENV || 'development'}                  ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ UNHANDLED REJECTION! Encerrando...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recebido. Encerrando gracefully...');
  server.close(() => {
    console.log('✅ Processo encerrado');
  });
});