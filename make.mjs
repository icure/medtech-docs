import path from "path"
import fs from "fs"
import Mustache from "mustache"

function walk(src, dst, view) {
    try { fs.mkdirSync(dst) } catch (e) {/* do nothing */}
    fs.readdirSync(src).forEach(f => {
        const fullPathSrc = path.join(src, f)
        const fullPathDst = path.join(dst, f)
        if (fs.statSync(fullPathSrc).isDirectory()) {
            walk(fullPathSrc, fullPathDst, view)
        } else {
            if (f.endsWith(".md")) {
                try {
                    console.log("Generating file", fullPathSrc)
                    fs.writeFileSync(fullPathDst, Mustache.render(fs.readFileSync(fullPathSrc, {
                        encoding: 'utf8',
                        flag: 'r'
                    }), view).replace(/(?<!\w)([Aa]) (_|\*\*)?([AEIOaeio])/g, "$1n $2$3"))
                } catch (e) {
                    console.error("Cannot interpret file: " + fullPathSrc, e)
                }
            } else {
                fs.copyFileSync(fullPathSrc, fullPathDst)
            }
        }
    });
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const flavours = (s, d) => ({
    [s]: d,
    [cap(s)]: cap(d),
    [s+'s']: d+'s',
    [cap(s)+'s']: cap(d)+'s',
})

walk("./sdks", "./medtech-sdk", {
    ...flavours('service', 'data sample'),
    ...flavours('hcp', 'healthcare professional'),
    ...flavours('healthcareElement', 'healthcare element'),
    ...flavours('serviceNoSpace', 'dataSample'),
    ...flavours('hcpNoSpace', 'healthcareProfessional'),
    ...flavours('healthcareElementNoSpace', 'healthcareElement'),
    ...flavours('sdk', 'medtech-sdk'),
    ...flavours('sdkName', 'medtech sdk'),
    SdkName: 'Medtech SDK',
    medtech: true
});

walk("./sdks", "./ehr-lite-sdk", {
    ...flavours('service', 'observation'),
    ...flavours('hcp', 'practitioner'),
    ...flavours('healthcareElement', 'condition'),
    ...flavours('sdk', 'ehr-lite-sdk'),
    ...flavours('sdkName', 'ehr lite sdk'),
    SdkName: 'Ehr Lite SDK',
    ehrlite: true
});
