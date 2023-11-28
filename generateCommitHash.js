const { execSync } = require('child_process');
const fs = require('fs');

try {
    const commitHash = execSync('git rev-parse HEAD').toString().trim();
    const content = `const COMMIT_HASH = '${commitHash}';\n`;
    fs.writeFileSync('dist/commitHash.js', content);
} catch (error) {
    console.error('Failed to generate commit hash:', error);
}
