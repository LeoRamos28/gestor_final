import { Router } from 'express';
import { listarGastos, crearGasto, actualizarGasto, eliminarGasto } from '../controllers/gastosController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', listarGastos);
router.post('/', crearGasto);
router.put('/:id', actualizarGasto);
router.delete('/:id', eliminarGasto);

export default router;
