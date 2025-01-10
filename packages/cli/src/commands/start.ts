import chokidar from 'chokidar';
import WebSocket from 'ws';
import { execa } from 'execa';
import { Command } from 'commander';
import { loadConfig } from '../utils/loadConfig';
import path from 'path';
import { spawn } from 'child_process';

const startStudio = async () => {
  try {
    console.log('Starting Studio...');
    const studioPath = path.join(process.cwd(), 'node_modules', '@hubql/studio');
    const studioProcess = spawn('pnpm', ['dev'], {
      cwd: path.resolve(process.cwd(), 'packages/studio'),
      stdio: 'inherit'
    });
    await new Promise<void>((resolve, reject) => {
      studioProcess.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Studio process exited with code ${code}`));
        }
      });
      studioProcess.on('error', reject);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error starting Studio:', err.message);
    } else {
      console.error('Error starting Studio:', err);
    }
  }
};

const startFileWatcher = (contentPath: string) => {
  const watcher = chokidar.watch(contentPath, { persistent: true });

  const wss = new WebSocket.Server({ port: 4001 });

  wss.on('connection', (socket: WebSocket) => {
    console.log('Studio connected to WebSocket server.');
    watcher.on('all', (event: string, path: string) => {
      console.log(`File ${event}: ${path}`);
      socket.send(JSON.stringify({ event, path }));
    });
  });

  console.log(`File watcher running on ${contentPath}...`);
};

export const startCommand = new Command('start')
  .description('Run the Hubql Studio')
//   .option('-i, --input <path>', 'Input directory containing MDX files')
//   .option('-o, --output <path>', 'Output directory for rendered HTML files')
  .action(async (options) => {
    const { input, output } = options;
    // Load user-defined config
    const { config, configPath } = await loadConfig();

    if (!configPath) {
      throw new Error('No hubql.config.ts found');
    }

    const contentPath = input || config.input || './content';
    
    await startStudio();
    startFileWatcher(contentPath);
  });
