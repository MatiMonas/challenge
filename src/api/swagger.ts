//@ts-nocheck

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
      
      1- Autenticarse con un usuario en la ruta AUTH/REGISTER. Se necesitara email y password.

      2- Loguearse en la ruta AUTH/LOGIN. Se necesita email y password utilizados en el registro.
      Esto devolvera un token que se debe enviar en cada peticion que no sea un GET.

      3- Crear una película. Tener en cuenta que las películas deben tener un genero asociado. 
      Seguir el ejemplo de la petición MOVIES ROUTES POST.
      No olvidarse de agregar el token en el header
      
      4- Una vez creada la pelicula, ya se puede crear un personaje. Este debe estar relacionado con al menos una película. 
      Seguir el ejemplo de la petición CHARACTERS ROUTES POST.
      No olvidarse de agregar el token en el header
      
      5- Sentirse libre de crear todos los personajes y peliculas que deseen. Tengan en cuenta que hay tan solo 11 generos creados . Los id's de estos van del 1 al 11.
      
      6- Las rutas get cuentan con distintos filtros:
        - GET /characters?age={edad}: obtener todos los personajes con una edad especifica.
        - GET /characters?name={nombre}: obtener todos los personajes que tengan el nombre especificado
        - GET /characters?movie={id,id,id...}: obtener todos los personajes que hayan actuado en las peliculas con los id's especificados.

        - GET /movies?name={nombre}: obtener todas las peliculas que tengan el nombre especificado
        - GET /movies?genre={id}: obtener todas las peliculas que tengan los generos con el id especificados.
        - GET /movies?order={ASC|DESC}: trae las peliculas ordenadas por rating.
          
          `,
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
