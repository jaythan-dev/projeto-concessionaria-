import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car API',
      version: '1.0.0',
      description: 'API para gerenciamento de carros, marcas e proprietários',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Caminho correto para os arquivos com comentários Swagger
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
