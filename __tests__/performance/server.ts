import fs from 'fs';
import cors from 'cors';
import path from 'path';
import express from 'express';
import util from 'util';

const exec = util.promisify(require('child_process').exec);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function execute(command: string) {
  const { stdout } = await exec(command);
  return stdout.trim();
}

const reportsPath = './reports';

app.get('/', (req, res) => {
  res.send('Connection established');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000!');
});

app.get('/commitId', async (req, res) => {
  const commitId = await execute('git rev-parse HEAD');
  res.send(commitId);
});

app.post('/report', async (req, res) => {
  const commitId = await execute('git rev-parse HEAD');
  const fileName = `${new Date().getTime()}-${commitId}.json`;
  const filePath = path.join(reportsPath, fileName);
  if (!fs.existsSync(reportsPath)) {
    fs.mkdirSync(reportsPath);
  }
  fs.writeFileSync(filePath, JSON.stringify(req.body));
  res.json({ success: true });
});

app.post('/statistic', (req, res) => {
  const files = fs.readdirSync(reportsPath);
  const jsonFiles = files
    .filter((f) => f.endsWith('.json'))
    .sort((a, b) => {
      const aTime = new Date(a).getTime();
      const bTime = new Date(b).getTime();
      return aTime - bTime;
    });
  const data = jsonFiles.map((f) => {
    const file = fs.readFileSync(path.join(reportsPath, f), 'utf8');
    const time = f.slice(0, 13);
    const commitId = f.slice(14, 54);
    return {
      time,
      commitId,
      data: Object.entries(JSON.parse(file)).map(([name, res]) => ({ name, ...(res as any).stat })),
    };
  });
  res.json(data);
});
