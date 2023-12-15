import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import userRoutes from './routes/user.js';
import servicesRoutes from './routes/serviceSociauxRoute.js';
import ExperienceRoutes from './routes/experienceRouter.js';
import CommunityRoutes from './routes/communityRouter.js';
import FormationRoute from './routes/Formations.js';
import EducationRoute from './routes/Educations.js';
import SoinsRoutes from './routes/soinRoutes.js'
import { errorHandler, notFoundError } from './middlewares/error_handler.js';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(session({ secret: 'yoursecret', resave: false, saveUninitialized: false }));

const port = process.env.PORT || 9090;
const databaseName = 'pdm';
mongoose.set('debug', true);
mongoose.Promise = global.Promise;
mongoose
  .connect(`mongodb+srv://chebbi6m:55554471@pdm.r5bim2n.mongodb.net/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('Middleware just ran!');
  next();
});

app.use('/gse', (req, res, next) => {
  console.log('Middleware just ran a gse route!');
  next();
});

// Import the "Offreemploi" routes
import OpportuniteRoutes from './routes/OpportuniteRoutes.js';

// Use the "Offreemploi" routes under the "/api" base path
app.use('/api', OpportuniteRoutes);
app.use('/user', userRoutes);
app.use('/service', servicesRoutes);
app.use('/community', CommunityRoutes);
app.use('/experience', ExperienceRoutes);
app.use('/formation', FormationRoute);
app.use('/education', EducationRoute);
app.use("/soin",SoinsRoutes);

app.use(errorHandler);
app.use(notFoundError);


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

export { io };