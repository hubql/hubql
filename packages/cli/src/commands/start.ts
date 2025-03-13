import chokidar from 'chokidar';
import { execaCommand } from 'execa';
import { Command } from 'commander';
import { loadConfig } from '../utils/loadConfig';

const checkLocalStudio = async (): Promise<boolean> => {
  try {
    // Try to fetch from local Studio
    const response = await fetch('http://localhost:13140/');
    return response.ok;
  } catch (err) {
    return false;
  }
};

const startStudio = async (config: { useLocal?: boolean }) => {
  try {
    // Check if Studio is running locally
    const isLocalRunning = await checkLocalStudio();

    if (config.useLocal) {
      if (!isLocalRunning) {
        throw new Error('Local Studio is required but not running on port 3000');
      }
      console.log('Using local Studio on port 13140');
      return;
    }

    if (isLocalRunning) {
      console.log('Studio is already running locally on port 13140');
      return;
    }

    // If not running locally and not forced to use local, use Docker
    console.log('Starting Studio in Docker...');
    const imageTag = 'hubql/studio:latest';

    console.log('Pulling latest Studio version...');
    await execaCommand(`docker pull ${imageTag}`, {
      stdio: 'inherit'
    });

    const dockerProcess = execaCommand(
      'docker run -it --rm ' +
      '-p 13140:3000 ' +  // Studio UI
      '-p 13142:5133 ' +  // Electric sync port
      '-v $(pwd):/app ' +
      imageTag,
      {
        stdio: 'inherit',
        shell: true
      }
    );

    await dockerProcess;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error starting Studio:', err.message);
    } else {
      console.error('Error starting Studio:', err);
    }
  }
};

const startFileWatcher = async (contentPath: string) => {
  // Initialize Electric client
  const config = {
    url: 'postgresql://postgres:postgres@localhost:13142/hubql',
    schema: 'public'
  };

  // const electric = await electrify(config);

  // Watch for file changes
  const watcher = chokidar.watch(contentPath, { persistent: true });

  watcher.on('all', async (event: string, path: string) => {
    console.log(`File ${event}: ${path}`);

    // Instead of WebSocket, sync through Electric
    // await electric.db.files.upsert({
    //   path,
    //   event,
    //   timestamp: new Date().toISOString(),
    //   content: event === 'unlink' ? null : await fs.readFile(path, 'utf-8')
    // });
  });

  console.log(`File watcher running on ${contentPath}...`);
};

export const startCommand = new Command('start')
  .alias('s')
  .alias('dev')
  .description('Run the Hubql Studio')
  .option('--local', 'Use local Docker image instead of published version')
  .argument('[workspaceId]', 'Workspace ID to serve documentation for')
  .action(async (options) => {

    const { input, output, local } = options ?? {};
    // Load user-defined config
    const { config, configPath } = await loadConfig();

    if (!configPath) {
      throw new Error('No hubql.config.ts found');
    }

    const contentPath = input || config.input || './docs/content';

    await startStudio({ useLocal: local });
    startFileWatcher(contentPath);
  });
