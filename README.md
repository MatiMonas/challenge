# Alkemy Backend Challenge

## .env Example

```
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_PORT=
PORT=

TOKEN_SECRET=shh

FORCE_SYNC_DB=false

USER_EMAIL=testchallengealk@gmail.com
USER_PASSWORD=mdumwbezauwqhina
```
-----

> USER_EMAIL y USER_PASSWORD son necesarios para el envío de mails a la hora que los usuarios se registran en la app

>FORCE_SYNC_DB si esta en false, los datos de la base de datos van a persistir en caso que reinicien el local host. En true los datos no persisten.
## Para levantar el proyecto

1. Crear una base de datos llamada `alkemy`.
2. Generar un archivo .env en el root del proyecto y poner los segun sean necesarios.
3. El proyecto cuenta con swagger, con lo cual cuenta con documentación una vez se dirijan a su localhost.
4. Seguir los pasos informados en la documentación de swagger.




----
## Scripts incluidos

La app cuenta testeo de los modelos de Movie, Genre, Character y las rutas de Characters y Movies.

- Para testear la app completa ejecutar:
```
yarn test | npm test
```
- Para testear modelos:
```
yarn test:models | npm run test:models
yarn test:models:movie | npm run test:models:movie
yarn test:models:character | npm run test:models:character
yarn test:models:genre | npm run test:models:genre
```

- Para testear rutas:
```
yarn test:routes:character | npm run test:routes:character
yarn test:routes:movies | npm run test:routes:movies
```
