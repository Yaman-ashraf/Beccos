import express from 'express';
import 'dotenv/config'
import { appRouter } from './Src/Module/app.router.js';
const app = express();

appRouter(app, express);
app.listen(process.env.PORT, () => {

    console.log(`app is running ... ${process.env.PORT}`)

})
