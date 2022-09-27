import { watch, readFile, writeFile } from 'node:fs/promises';
const receivers = {}; //Paths that subscribe to changes for file://aFile|snippet
const examples = {}; //Paths that subscribe to changes for file://aFile|snippet
const inject = async (path) => {
    const text = await readFile(path, 'utf8');
    let dst = '';
    let currentExample = false;
    text.split(/\n/).forEach(line => {
        const [_, injector, snippet] = [...(line.match('<\!-- *(file://\W+) *snippet: (.+?) *-->') ?? [])];
        if (injector && snippet) {
            let ex = examples[`${injector}|${snippet}`];
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
await Promise.all([...['contact-manager', 'introduction', 'login-user-management', 'medtech-fhir', 'patient-manager'].map(async (__filename) => {
        const watcher = watch(__filename, { recursive: true });
        for await (const event of watcher) {
            const text = await readFile(event.filename, 'utf8');
            const ex = text.split('//tech-doc: ').slice(1);
            ex.forEach((x) => {
                const parts = x.split('\n');
                examples[`${event.filename}|${parts[0]}`] = parts.slice(1).join('\n');
            });
            Object.entries(receivers).forEach(([path, receivers]) => {
                if (path.startsWith(event.filename)) {
                    receivers.forEach(async (receiver) => {
                        const dst = await inject(receiver);
                        await writeFile(receiver, dst);
                    });
                }
            });
        }
    }), ...['../sdks'].map(async (__filename) => {
        const watcher = watch(__filename, { recursive: true });
        for await (const event of watcher) {
            const text = await readFile(event.filename, 'utf8');
            text.split('\n').forEach((line, index) => {
                const [_, injector, snippet] = [...(line.match('<\!-- *(file://\W+) *snippet: (.+?) *-->') ?? [])];
                if (injector && snippet) {
                    receivers[`${injector}|${snippet}`] = (receivers[`${injector}|${snippet}`] ?? []).filter((x) => x !== event.filename).concat([event.filename]);
                }
            });
        }
    })]);
