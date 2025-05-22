// src/controllers/gastosController.ts
import { Response, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

/**
 * Listar gastos del usuario autenticado.
 */
export const listarGastos: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.userId;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const gastos = await prisma.gasto.findMany({
      where: { id_usuario: userId },
      include: { categoria: true },
    });
    res.json(gastos);
  } catch {
    res.status(500).json({ error: 'Error al obtener los gastos' });
  }
};

/**
 * Crear un nuevo gasto para el usuario autenticado.
 */
export const crearGasto: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.userId;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  const { monto, fecha, id_categoria } = req.body;
  if (!monto || !fecha || !id_categoria) {
    res.status(400).json({ error: 'Faltan datos obligatorios' });
    return;
  }

  try {
    const nuevoGasto = await prisma.gasto.create({
      data: {
        monto,
        fecha: new Date(fecha),
        id_usuario: userId,
        id_categoria,
      },
    });
    res.status(201).json(nuevoGasto);
  } catch {
    res.status(500).json({ error: 'Error al crear el gasto' });
  }
};

/**
 * Actualizar un gasto existente del usuario.
 */
export const actualizarGasto: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.userId;
  const idGasto = Number(req.params.id);

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  if (isNaN(idGasto)) {
    res.status(400).json({ error: 'ID de gasto inválido' });
    return;
  }

  try {
    const gastoExistente = await prisma.gasto.findUnique({ where: { id_gasto: idGasto } });
    if (!gastoExistente || gastoExistente.id_usuario !== userId) {
      res.status(404).json({ error: 'Gasto no encontrado o no autorizado' });
      return;
    }

    const { monto, fecha, id_categoria } = req.body;
    const gastoActualizado = await prisma.gasto.update({
      where: { id_gasto: idGasto },
      data: {
        monto,
        fecha: fecha ? new Date(fecha) : gastoExistente.fecha,
        id_categoria,
      },
    });
    res.json(gastoActualizado);
  } catch {
    res.status(500).json({ error: 'Error al actualizar el gasto' });
  }
};

/**
 * Eliminar un gasto del usuario.
 */
export const eliminarGasto: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.userId;
  const idGasto = Number(req.params.id);

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  if (isNaN(idGasto)) {
    res.status(400).json({ error: 'ID de gasto inválido' });
    return;
  }

  try {
    const gastoExistente = await prisma.gasto.findUnique({ where: { id_gasto: idGasto } });
    if (!gastoExistente || gastoExistente.id_usuario !== userId) {
      res.status(404).json({ error: 'Gasto no encontrado o no autorizado' });
      return;
    }

    await prisma.gasto.delete({ where: { id_gasto: idGasto } });
    res.json({ mensaje: 'Gasto eliminado correctamente' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar el gasto' });
  }
};
