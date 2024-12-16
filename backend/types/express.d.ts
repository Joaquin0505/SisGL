import { Request } from 'express';
import { User } from '';

// Define la interfaz para los datos del usuario
interface UserPayload {
  userId: string;
  email: string;
}

// Extiende la interfaz Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      }
      
    }
  }
}
