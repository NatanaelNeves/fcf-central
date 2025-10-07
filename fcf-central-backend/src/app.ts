import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';

const app: Application = express();

// ============= MIDDLEWARES DE SEGURANÇA =============
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// ============= MIDDLEWARES DE PARSING =============
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============= LOGGING =============
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============= ROTA DE HEALTH CHECK =============
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'FCF Central API está rodando!',
    timestamp: new Date().toISOString()
  });
});

// ============= ROTAS DA API =============
app.use('/api', routes);

// ============= ROTA 404 =============
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// ============= ERROR HANDLER =============
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('❌ Erro:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;