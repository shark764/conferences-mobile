const child_process = require('child_process');

const { exitScript, consoleWrite, formatDate } = require('./utils');

const [, , arg1 = '--android', arg2 = '--build-version', arg3 = '1.0'] =
  process.argv;
const platforms = ['android', 'ios'];
const versions = ['marketing-version', 'build-version'];
const platform = arg1.slice(2);
const task = arg2.slice(2);
const version = arg3;

if (!platforms.includes(platform)) {
  exitScript(`Invalid argument platform received "${arg1}"`, 'error');
}
if (!versions.includes(task)) {
  exitScript(`Invalid argument task received "${arg2}"`, 'error');
}

const rootDir = process.cwd();

const androidDir = './android';
const iosDir = './ios/App';

const dateToFormat = formatDate(new Date());

const versionMap = {
  android: {
    'marketing-version': `./gradlew bumperAppVersion -PbumperVersionName=${version}`,
    'build-version': './gradlew bumperVersionCodeOnly',
  },
  ios: {
    'marketing-version': `xcrun agvtool new-marketing-version ${version}`,
    'build-version': `xcrun agvtool new-version -all ${version}.${dateToFormat}`,
  },
};

let commands = `cd ${rootDir}`;
commands += ` && cd ${platform === 'android' ? androidDir : iosDir}`;
commands += ` && ${versionMap[platform][task]}`;

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
  consoleWrite(`\nVersion bumped for "${platform}"`, 'success');
});
