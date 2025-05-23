const { spawn } = require('child_process');

const withEmulator = process.argv.includes('with-emulator'); // enable with flag

function runCommand(command, args, label) {
  return new Promise((resolve, reject) => {
    console.log(`[Start Script] Starting ${label}...`);
    const child = spawn(command, args, { stdio: 'inherit', shell: true });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`[Start Script] ${label} finished successfully.`);
        resolve();
      } else {
        reject(new Error(`${label} exited with code ${code}`));
      }
    });
  });
}

async function start() {
  try {
    if (withEmulator) {
      runCommand('npx', ['firebase', 'emulators:start'], 'Firebase Emulator');
    }

    // await runCommand('npm', ['run', 'build'], 'Build');
    await runCommand('npm', ['run', 'start:default'], 'Backend');
  } catch (error) {
    console.error('[Start Script] Error:', error.message);
    process.exit(1);
  }
}

start();