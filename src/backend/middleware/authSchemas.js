import { z } from 'zod';

export const signupSchema = z.object({
  usuario: z.string().min(3, 'Usuario muy corto'),
  email: z.string().email('Email inválido'),
  contrasena: z.string().min(6, 'Contraseña muy corta'),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(6, 'Contraseña muy corta'),
});