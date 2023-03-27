import fs from 'fs'
import * as path from 'path'

export function output(destination: string, data: any | string | Buffer) {
  const fullPath = path.resolve(process.env['SCRIPT_ROOT'], `${destination}.txt`)
  console.log(`Writing ${fullPath}`)
  data &&
    fs.writeFileSync(
      `${fullPath}`,
      data instanceof Buffer || typeof data === 'string' ? data : JSON.stringify(data, null, 2),
    )
}
