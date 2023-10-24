const child_process = require('child_process');

const { exitScript, consoleWrite } = require('./utils');

const [, , arg1 = '--android', arg2 = '--sync'] = process.argv;
const platforms = ['android', 'ios'];
const tasks = ['open', 'run', 'sync'];
const platform = arg1.slice(2);
// FIXME: When "--run", cannot choose which device
const task = arg2.slice(2);

if (!platforms.includes(platform)) {
  exitScript(`Invalid argument platform received "${arg1}"`, 'error');
}
if (!tasks.includes(task)) {
  exitScript(`Invalid argument task received "${arg2}"`, 'error');
}

const rootDir = process.cwd();

const conferencesDir = '../conferences';
// const buildMobile = 'yarn run build:mobile';
// const buildIos = 'yarn run build:ios';
// TODO: check if conferences work without extra parameters on build
const buildMobile = 'yarn run build';
const buildIos = 'yarn run build';

let commands = `cd ${conferencesDir}`;
commands += ' && rm -rf dist';
commands += ` && ${platform === 'android' ? buildMobile : buildIos}`;
commands += ` && cd ${rootDir}`;
commands += ' && rm -rf dist';
commands += ` && mv ${conferencesDir}/dist ./`;
commands += ' && source ~/.nvm/nvm.sh';
commands += ' && nvm use';
commands += ' && yarn install';
commands += ` && npx cap sync ${platform}`;
if (task !== 'sync') {
  commands += ` && npx cap ${task} ${platform}`;
}

const child = child_process.spawn(commands, {
  shell: true,
});
child.stderr.on('data', (data) => {
  consoleWrite(data.toString(), 'warning');
});
child.stdout.on('data', (data) => {
  consoleWrite(data.toString(), 'info');
});
child.on('exit', (exitCode) => {
  if (exitCode === 1) {
    exitScript(`Child exited with code: ${exitCode}`, 'error');
  }
  consoleWrite(
    `\nConferences project synchronized successfully with conferences-mobile using platform "${platform}"`,
    'success'
  );
});
