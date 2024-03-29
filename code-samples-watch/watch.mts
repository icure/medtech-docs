import {readdir, readFile, watch, writeFile} from 'node:fs/promises'
import {Mutex} from 'async-mutex'
import * as Path from "path";
import * as console from "console";

const receivers: {[key: string]: string[]} = {} //Paths that subscribe to changes for file://aFile|snippet
const examples: {[key: string]: string} = {}
const mutexes = {}

const inject = async (path: string) => {
    const text = await readFile(path, 'utf8')
    let dst = ''
    let currentCodeSample = false
    let currentOutput = false
    await text.split(/\n/).reduce(async (p,line) => {
        await p
        const [_, injector, snippet] = [...(line.match('<\!-- *file://(.+?) *snippet:(.+?)-->') ?? [])]
        const [__, path, title] = [...(line.match('<\!-- *output://(.+/(.+)\.txt) *-->') ?? [])]
        if (injector && snippet) {
            let ex = examples[`${injector}|${snippet}`]
            if (ex) {
                while (ex.lastIndexOf('\n\n') == ex.length - 2) {
                    ex = ex.slice(0, ex.length - 1)
                }
                ex = ex.replace(/\/\* truncate \*\/"(.+?)"/g, (_, s) => `"${s.slice(0, 10)}...${s.slice(s.length - 10)}"`)
                ex = ex.replace(/\/\* truncate \*\/'(.+?)'/g, (_, s) => `'${s.slice(0, 10)}...${s.slice(s.length - 10)}'`)
                ex = ex.replace(/.+\/\/skip[ \t]*\n/g, '')
                dst += line + '\n'
                dst += '```typescript\n'
                dst += ex
                dst += '```\n'
                currentCodeSample = true
            } else {
                dst += line + '\n'
            }
        } else if (currentCodeSample) {
            if (line.match(/```[ \t]*$/)) {
                currentCodeSample = false
            }
        } else if (path && title) {
            const fullPath = `${Path.join('..', path)}`;
            let output
            try {
            output = await readFile(fullPath, 'utf8')
            } catch (e) {
                console.error(`Error reading file ${fullPath}`)
            }
            if (output) {
                while (output.lastIndexOf('\n\n') == output.length - 2) {
                    output = output.slice(0, output.length - 1)
                }

                dst += line + '\n'
                dst += '<details>\n'
                dst += `<summary>${title}</summary>\n`
                dst += '\n'
                if (output.startsWith("{")) {
                    dst += '```json\n'
                    dst += output + '\n'
                    dst += '```\n'
                } else {
                    dst += '```text\n'
                    dst += output + '\n'
                    dst += '```\n'
                }
                dst += '</details>\n'
                currentOutput = true
            } else {
                dst += line + '\n'
            }
        } else if (currentOutput) {
            if (line.match(/[ \t]*<\/details>[ \t]*$/)) {
                currentOutput = false
            }
        } else {
            dst += line + '\n'
        }
    }, Promise.resolve())
    if (currentCodeSample) {
        throw new Error(`Unclosed code block detected in ${path}`)
    }
    if (currentOutput) {
        throw new Error(`Unclosed output block detected in ${path}`)
    }

    return dst.replace(/\n\n+$/,'\n')
}

async function registerExample(path: string) {
    if (!path.endsWith('.ts') && !path.endsWith('.js') && !path.endsWith('.mts') && !path.endsWith('.mjs')) { return }
    const text = await readFile(path, 'utf8')
    const ex = text.split('//tech-doc: ').slice(1)
    const fullPath = path.startsWith('../') ? path.slice(3) : `${Path.join('code-samples', path)}`;
    ex.forEach((x: string) => {
        const parts = x.split('\n');
        examples[`${fullPath}|${parts[0]}`] = parts.slice(1).join('\n')
    })
    const filesToInject = Object.entries(receivers).reduce((filesToInject, [recPath, receivers]) => {
        if (recPath.startsWith(fullPath+'|')) {
            receivers.forEach((r) => filesToInject.add(r))
        }
        return filesToInject
    }, new Set<string>())
    await [...filesToInject].reduce(async (p, receiver) => {
        await p
        try {
            await (mutexes[receiver] ?? (mutexes[receiver] = new Mutex())).runExclusive(async () => {
                await writeFile(receiver, await inject(receiver));
            })
        } catch (e) {
            console.error(e);
        }
    }, Promise.resolve());
}

async function registerReceiver(path: string) {
    if (!path.endsWith('.md')) { return }
    const text = await readFile(path, 'utf8')
    text.split('\n').forEach((line, index) => {
        const [_, injector, snippet] = [...(line.match('<\!-- *file://(.+?) *snippet:(.+?)-->') ?? [])]
        if (injector && snippet) {
            receivers[`${injector}|${snippet}`] = (receivers[`${injector}|${snippet}`] ?? []).filter((x) => x !== path).concat([path])
        }
    })
}

const traverseFileSystem = async(
    container: string,
    skipper: (path: string) => boolean = (path) => path.endsWith('node_modules') || path.endsWith('.git') || path.endsWith('.idea'),
): Promise<string[]> =>
    (await readdir(container, {withFileTypes: true})).reduce(async (acc, item) => {
        const fullPath = `${container}/${item.name}`;
        if (item.isDirectory() && !skipper(fullPath)) {
            return [...(await acc), ...(await traverseFileSystem(fullPath))]
        } else {
            return [...(await acc), fullPath]
        }
    }, Promise.resolve([] as string[]))


const sampleDirectories = (await readdir('../code-samples', {withFileTypes: true})).filter((x) => x.isDirectory() && !['git','.idea','node_modules'].includes(x.name)).map((x) => x.name)
const docDirectories = ['../medtech-sdk','../ehr-lite-sdk']

await (docDirectories.reduce(async (p, dir) => {
    await (await traverseFileSystem(dir)).reduce(async (p, path) => { await p; await registerReceiver(path); }, Promise.resolve())
}, Promise.resolve()))

await (sampleDirectories.reduce(async (p, dir) => {
    await (await traverseFileSystem(`../code-samples/${dir}`)).reduce(async (p, path) => { await p; await registerExample(path); }, Promise.resolve())
}, Promise.resolve()))

await Promise.all([...sampleDirectories.map(async (fileName) => {
    const filePath = `../code-samples/${fileName}`
    const watcher = watch(filePath, { recursive: true })
    for await (const event of watcher) {
        await registerExample(Path.join(filePath, event.filename));
    }
}), ...docDirectories.map(async (fileName) => {
    const watcher = watch(fileName, { recursive: true })
    for await (const event of watcher) {
        let recPath = Path.join(fileName, event.filename);
        await registerReceiver(recPath);
    }
})])
