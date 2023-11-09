import { sum } from '@pnpm-workspaces-test/utils';

import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send(`Hello World! ${sum(1, 1)}`);
});

app.listen(port, () => {
    console.info(`Server listening on port ${port}`);
});
