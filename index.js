#!/usr/bin/env node

import childProcess from 'child_process';
import console from "console";
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

const [rootDir, ...commandsToRun] = process.argv.slice(2);

if (!rootDir) {
  console.log('Repository folder is not specified');
  process.exit(-1);
}

const git = simpleGit(rootDir);

try {
  const repoDir = await git.revparse({ "--show-toplevel": true });

  const statusResult = await git.status();
  const workspaces = new Set();
  for (const fileName of statusResult.modified) {
    const filepath = path.join(repoDir, fileName);
    let fileDir = path.dirname(filepath);
    while (fileDir.startsWith(repoDir)) {
      const packageJsonPath = path.join(fileDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        workspaces.add(packageJson.name);
        break;
      } else {
        fileDir = fileDir.split(path.sep).slice(0, -1).join(path.sep);
      }
    }
  }

  if (commandsToRun.length) {
    for (const command of commandsToRun) {
      const parts = ['npm', 'run'];
      for (const ws of workspaces) {
        parts.push('-w', ws);
      }
      parts.push(command);

      console.log(`Executing ${parts.join(' ')}`);
      const output = childProcess.execSync(
        parts.join(' '),
        {
          encoding: 'utf-8',
          cwd: rootDir,
          stdio: 'inherit',
          stderr: 'inherit',
        },
      );
      console.log(output);
    }
  } else {
    console.log(Array.from(workspaces).join('\n'));
  }
} catch (err) {
  console.log(err);
  process.exit(-1);
}
