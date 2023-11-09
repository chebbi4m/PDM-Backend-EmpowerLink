import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';


import userRoutes from './routes/user.js'
import communityRoutes from './routes/communityRouter.js'
import experienceRoutes from './routes/experienceRouter.js'

import { errorHandler, notFoundError } from './middlewares/error_handler.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 9090;
const databaseName = 'pdm';
mongoose.set('debug', true);
mongoose.Promise = global.Promise;
mongoose
  .connect(`mongodb://0.0.0.0:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => {
    console.log(err);
  });
  app.use(cors());
app.use(express.json());
app.use(morgan("dev"))
app.use(express.urlencoded({extended: true}));
app.use((req,res,next)=>{
    console.log("Middleware just ran !");
    next();
  });
  
  app.use("/gse",(req,res,next)=>{
    console.log("Middleware just ran a gse route!");
    next();
  });
  
  app.use('/user', userRoutes);
  app.use('/community', communityRoutes);
  app.use('/experience', experienceRoutes);

  
  app.use(errorHandler);
  app.use(notFoundError);
  
  app.listen(port, () => {

    console.log(`Server running at http://192.168.139.1:${port}/`);
  });
