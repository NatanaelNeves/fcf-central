import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { 
  getDespesas, 
  getDespesa, 
  createDespesa, 
  updateDespesa, 
  deleteDespesa 
} from '../controllers/despesaController';
import { 
  getReceitas, 
  getReceita, 
  createReceita, 
  updateReceita, 
  deleteReceita 
} from '../controllers/receitaController';
import {
  getOrcamentos,
  createOrcamento,
  updateOrcamento,
  deleteOrcamento,
  getComparativo
} from '../controllers/orcamentoController';
import { protect, authorize } from '../middlewares/auth';

const router = Router();

// ============= ROTAS DE AUTENTICAÇÃO =============
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);

// ============= ROTAS DE DESPESAS =============
router.get('/despesas', protect, getDespesas);
router.get('/despesas/:id', protect, getDespesa);
router.post('/despesas', protect, createDespesa);
router.put('/despesas/:id', protect, updateDespesa);
router.delete('/despesas/:id', protect, deleteDespesa);

// ============= ROTAS DE RECEITAS =============
router.get('/receitas', protect, getReceitas);
router.get('/receitas/:id', protect, getReceita);
router.post('/receitas', protect, createReceita);
router.put('/receitas/:id', protect, updateReceita);
router.delete('/receitas/:id', protect, deleteReceita);

// ============= ROTAS DE ORÇAMENTOS =============
router.get('/orcamentos', protect, getOrcamentos);
router.get('/orcamentos/comparativo', protect, getComparativo);
router.post('/orcamentos', protect, authorize('admin'), createOrcamento);
router.put('/orcamentos/:id', protect, authorize('admin'), updateOrcamento);
router.delete('/orcamentos/:id', protect, authorize('admin'), deleteOrcamento);

export default router;