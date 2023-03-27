import fs from 'fs'
import * as path from 'path'

export function output(dataMap: { [key: string]: any | string | Buffer }) {
  Object.keys(dataMap).forEach((destination) => {
    const data = dataMap[destination]
    const fullPath = path.resolve(process.env['SCRIPT_ROOT'], `${destination}.txt`)
    console.log(`Writing ${fullPath}`)
    data &&
    fs.writeFileSync(
      `${fullPath}`,
      data instanceof Buffer || typeof data === 'string' ? data : JSON.stringify(data, null, 2),
    )
  })
}
