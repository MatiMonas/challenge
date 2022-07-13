import { Application } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Disney API',
      description: 'Disney API documentation',
      contact: {
        name: 'Matías Monastirsky',
      },
      servers: ['http://localhost:3001'],
    },
  },
  apis: ['./src/api/routes/*.ts'],
} 

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default function (app: Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}