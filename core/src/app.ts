import express from 'express';
import router from './routes/index.js';
import cors from 'cors';
import { errorHandler } from './errors.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
    res.json({
        message: '651658196+5',
    });
});

app.use(errorHandler);

export default app;
