import http from 'http';
import express from 'express';
import config from './config/config';
import router from './routes/routes';
import connectToDb from './utils/connect-to-db';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import deserializeUser from './middleware/deserializeUser';
// import { getSession } from './schema/session-schema';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: config.client.origin }));

app.use(deserializeUser);
app.use(router);

connectToDb();

console.log(config.client.origin);

//

const httpServer = http.createServer(app);
httpServer.listen(config.server.port, (err?: Error) => {
  if (err) {
    console.error(`Failed to start server on port ${config.server.port}`, err);
    process.exit(1);
  }
  console.log(`listening on port: ${config.server.port}`);
});
