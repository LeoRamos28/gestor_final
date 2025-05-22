import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePasswords } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const register = async (nombre_usuario: string, email: string, password: string) => {
  const existingUser = await prisma.usuario.findUnique({ where: { email } });
  if (existingUser) throw new Error('El email ya está registrado');

  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.usuario.create({
    data: {
      nombre_usuario,
      email,
      password_hash: hashedPassword,
    },
  });

  const token = generateToken(newUser.id_usuario);
  return { user: newUser, token };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');

  const isValid = await comparePasswords(password, user.password_hash);
  if (!isValid) throw new Error('Contraseña incorrecta');

  const token = generateToken(user.id_usuario);
  return { user, token };
};
