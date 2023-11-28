const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist'); // Adjust the path as needed for your project structure
const commitHashFilePath = path.join(distDir, 'commitHash.js');

try {
    // Ensure the dist directory exists, create it if necessary
    fs.mkdirSync(distDir, { recursive: true });

    // Get the commit hash
    const commitHash = execSync('git rev-parse HEAD').toString().trim();
    const content = `const COMMIT_HASH = '${commitHash}';\n`;

    // Write the commit hash to the file
    fs.writeFileSync(commitHashFilePath, content);
} catch (error) {
    console.error('Failed to generate commit hash:', error);
}
