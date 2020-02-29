const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const execa = require('execa')

const projectPath = path.resolve(__dirname, '..');
const buildPath = path.resolve(projectPath, "build");
const distPath = path.resolve(buildPath, "dist");
const clientSrc = path.resolve(projectPath, "client");
const serverSrc = path.resolve(projectPath, "server");

if(!fs.existsSync(distPath)) {
  shell.mkdir("-p", distPath);
}

shell.cp("-Ru", path.resolve(clientSrc, "public"), path.resolve(distPath));

execa.sync('babel', [serverSrc, '--out-dir', distPath], {'stdio': 'inherit'})
execa.sync('webpack', [], {'stdio': 'inherit'})
