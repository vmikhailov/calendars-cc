const fs = require('fs');
const { execSync } = require('child_process');

const nodeVersion = process.version;
const npmVersion = execSync('npm --version').toString().trim();
let angularVersion = 'unknown';
try {
    angularVersion = require('../node_modules/@angular/core/package.json').version;
} catch (e) { }


const deployDatetime = new Date().toISOString();

const content = `// This file is auto-generated during build/deploy
export const versionInfo = {
  node: '${nodeVersion}',
  npm: '${npmVersion}',
  angular: '${angularVersion}',
  deployedAt: '${deployDatetime}'
};
`;

fs.writeFileSync('src/version-info.ts', content);
console.log('src/version-info.ts generated:', content);
