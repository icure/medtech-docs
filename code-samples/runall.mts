import * as fs from 'fs'
import * as process from 'process'
import { execSync } from 'child_process'
import * as Process from 'process'

const cwd = process.cwd()
if (!cwd.endsWith('/code-samples')) {
  throw Error('Please run this script from the code samples directory')
}

function scanAndRunRecursively(dir: string) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err
    }
    files.forEach(async (filename) => {
      const fullpath = `${dir}/${filename}`
      if (filename !== 'node_modules') {
        if (fs.lstatSync(fullpath).isDirectory()) {
          scanAndRunRecursively(fullpath)
        } else if ((filename === 'index.js' || filename === 'index.mjs') && fs.lstatSync(fullpath).isFile()) {
          const relative = '.' + fullpath.slice(cwd.length)
          console.log(`Running ${relative}`)
          execSync(`node ${relative}`, { env: Process.env, stdio: 'inherit' })
        }
      }
    })
  })
}

;[`quick-start`, `how-to`, `tutorial`].forEach((module) => {
  scanAndRunRecursively(`${cwd}/${module}`)
})
