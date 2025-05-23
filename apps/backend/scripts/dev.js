const { spawn } = require('child_process');

const withEmulator = process.argv.includes('with-emulator'); //enable with flag

if (withEmulator) {
  console.log('[Dev Script] Starting Firebase Emulator...');
  spawn('npx', ['firebase', 'emulators:start'], { stdio: 'inherit', shell: true });
}

console.log('[Dev Script] Starting Backend...');
spawn('npm', ['run', 'dev:default'], { stdio: 'inherit', shell: true });