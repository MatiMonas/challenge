import { Application, Request, Response, NextFunction } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

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
  defaultModelRendering: 'model',

  

  apis: [
    path.resolve(__dirname, './routes/index*'),
    path.resolve(__dirname, './routes/**/index*'),
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default function (app: Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
    res.redirect('/api-docs');
  });
}
