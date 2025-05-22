import { Request, Response } from 'express';
import { register, login } from '../services/auth.services';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { nombre_usuario, email, password } = req.body;
    const result = await register(nombre_usuario, email, password);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
