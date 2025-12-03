import express from 'express';
import cors from 'cors';
import carRoutes from './routes/carRoutes';
import brandRoutes from './routes/brandRoutes';
import ownerRoutes from './routes/ownerRoutes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/swagger';

const app = express();
app.use(express.json());

// Habilitar CORS para permitir chamadas do front (porta 5173)
app.use(cors({
  origin: "http://localhost:5173" // endereço do seu front
}));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Prefixo /api para todas as rotas
app.use('/cars', carRoutes);
app.use('/brands', brandRoutes);
app.use('/owners', ownerRoutes);

export default app;
