import { readdir, readFile, watch, writeFile } from 'node:fs/promises';
import * as Path from "path";
const receivers = {}; //Paths that subscribe to changes for file://aFile|snippet
const examples = {};
const inject = async (path) => {
    const text = await readFile(path, 'utf8');
    let dst = '';
    let currentExample = false;
    text.split(/\n/).forEach(line => {
        const [_, injector, snippet] = [...(line.match('<\!-- *file://(.+?) *snippet:(.+?)-->') ?? [])];
        if (injector && snippet) {
            let ex = examples[`${injector}|${snippet}`];
            if (ex) {
                while (ex.lastIndexOf('\n\n') == ex.length - 2) {
                    ex = ex.slice(0, ex.length - 1);
                }
                ex = ex.replace(/\/\* truncate \*\/"(.+?)"/g, (_, s) => `"${s.slice(0, 10)}...${s.slice(s.length - 10)}"`);
                ex = ex.replace(/\/\* truncate \*\/'(.+?)'/g, (_, s) => `'${s.slice(0, 10)}...${s.slice(s.length - 10)}'`);
                dst += line + '\n';
                dst += '```typescript\n';
                dst += ex;
                dst += '```\n';
                currentExample = true;
            }
            else {
                dst += line + '\n';
            }
        }
        else if (currentExample) {
            if (line.match(/^```$/)) {
                currentExample = false;
            }
        }
        else {
            dst += line + '\n';
        }
    });
    return dst;
};
async function registerExample(path) {
    if (!path.endsWith('.ts') && !path.endsWith('.js') && !path.endsWith('.mts') && !path.endsWith('.mjs')) {
        return;
    }
    const text = await readFile(path, 'utf8');
    const ex = text.split('//tech-doc: ').slice(1);
    ex.forEach((x) => {
        const parts = x.split('\n');
        examples[`${Path.join('code-samples', path)}|${parts[0]}`] = parts.slice(1).join('\n');
    });
    Object.entries(receivers).forEach(([path, receivers]) => {
        if (path.startsWith(path)) {
            receivers.forEach(async (receiver) => {
                await writeFile(receiver, await inject(receiver));
            });
        }
    });
}
async function registerReceiver(path) {
    if (!path.endsWith('.md')) {
        return;
    }
    const text = await readFile(path, 'utf8');
    text.split('\n').forEach((line, index) => {
        const [_, injector, snippet] = [...(line.match('<\!-- *file://(.+?) *snippet:(.+?)-->') ?? [])];
        if (injector && snippet) {
            receivers[`${injector}|${snippet}`] = (receivers[`${injector}|${snippet}`] ?? []).filter((x) => x !== path).concat([path]);
        }
    });
}
const traverseFileSystem = async (container, skipper = (path) => !path.endsWith('node_modules') && !path.endsWith('.git') && !path.endsWith('.idea')) => (await readdir(container, { withFileTypes: true })).reduce(async (acc, item) => {
    if (item.isDirectory()) {
        return [...(await acc), ...(await traverseFileSystem(`${container}/${item.name}`))];
    }
    else {
        return [...(await acc), `${container}/${item.name}`];
    }
}, Promise.resolve([]));
await Promise.all([...['contact-manager', 'introduction', 'login-user-management', 'medtech-fhir', 'patient-manager'].map(async (fileName) => {
        await (await traverseFileSystem(fileName)).reduce(async (p, path) => { await p; await registerExample(path); }, Promise.resolve());
        const watcher = watch(fileName, { recursive: true });
        for await (const event of watcher) {
            await registerExample(Path.join(fileName, event.filename));
        }
    }), ...['../sdks'].map(async (fileName) => {
        await (await traverseFileSystem(fileName)).reduce(async (p, path) => { await p; await registerReceiver(path); }, Promise.resolve());
        const watcher = watch(fileName, { recursive: true });
        for await (const event of watcher) {
            let recPath = Path.join(fileName, event.filename);
            await registerReceiver(recPath);
        }
    })]);
