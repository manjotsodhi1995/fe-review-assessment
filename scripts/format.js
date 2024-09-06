import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const formatTSFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');

    // Custom rules for formatting: For example, a simple rule for indentation and semicolon enforcement.
    let formattedContent = content
        .replace(/ {2}/g, '    ') // Replace 2 spaces with 4 spaces
        .replace(/;(?=\n)/g, ''); // Remove semicolons before newlines

    // Write the formatted content back to the file
    fs.writeFileSync(filePath, formattedContent, 'utf8');
    console.log(`Formatted: ${filePath}`);
};

const formatDirectory = (dirPath) => {
    fs.readdirSync(dirPath).forEach((file) => {
        const fullPath = path.join(dirPath, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
            formatDirectory(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            formatTSFile(fullPath);
        }
    });
};

const rootDir = path.resolve(__dirname, '../src');
formatDirectory(rootDir);
