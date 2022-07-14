import { Application, Request, Response, NextFunction } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Disney API, Alkemy challenge',
      description: `La api cuenta con los modelos de Character, Movies y Genre. Los generos son creados una vez la base de datos inicializa.      
      Para el correcto funcionamiento de la API seguir los pasos:
      
      1- Crear una película. Tener en cuenta que las películas deben tener un genero asociado. Seguir el ejemplo de la petición MOVIES ROUTES POST.
      
      2- Una vez creada la pelicula, ya se puede crear un personaje. Este debe estar relacionado con al menos una película. Seguir el ejemplo de la petición CHARACTERS ROUTES POST.`,
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
