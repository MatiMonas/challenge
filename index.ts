import './src/common/env';
import { server, connectToDB } from './src/api';
import db from './src/db';

const { Genre } = db;
const port = process.env.PORT || 3001;

server.listen(port, async () => {
  await connectToDB().then(() => {
    Genre.bulkCreate([
      { name: 'Action' },
      { name: 'Adventure' },
      { name: 'Animation' },
      { name: 'Comedy' },
      { name: 'Crime' },
      { name: 'Documentary' },
      { name: 'Drama' },
      { name: 'Family' },
      { name: 'Fantasy' },
      { name: 'History' },
      { name: 'Horror' },
    ]);
  });
  console.log(`Server listening at http://localhost:${port}`);
});
