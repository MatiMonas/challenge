import './src/common/env';
import { server, connectToDB } from './src/api';

const port = process.env.PORT || 3001;

server.listen(port, async () => {
  await connectToDB();
  console.log(`Server listening at http://localhost:${port}`);
});
