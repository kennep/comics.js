const fs = require('fs');
const process = require('process');
const path = require('path');
const shell = require('shelljs');

const projectPath = path.resolve(__dirname, '..');
const buildPath = path.resolve(projectPath, "build");
const distPath = path.resolve(buildPath, "dist");
const clientSrc = path.resolve(projectPath, "client");
const serverSrc = path.resolve(projectPath, "server");

if(!fs.existsSync(distPath)) {
  shell.mkdir("-p", distPath);
}

shell.cp("-Ru", path.resolve(clientSrc, "public"), path.resolve(distPath));

var result = shell.exec("babel '" + serverSrc + "' --out-dir '" + distPath + "'")

var result = shell.exec("webpack");
if(result.code != 0) process.exit(result.code);
