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
            if (f.endsWith(".md")||f.endsWith(".mdx")) {
                const fullContent = fs.readFileSync(fullPathSrc, {
                    encoding: 'utf8',
                    flag: 'r'
                })
                const initialFlag = (fullContent.match(/^!!([a-z]+)/) ?? [])[1]
                const parsedContent = fullContent.replace(/^!![a-z]+\n/, "")
                if(!initialFlag || view[initialFlag]){
                    try {
                        console.log("Generating file", fullPathSrc)
                        fs.writeFileSync(fullPathDst, Mustache.render(parsedContent, view)
                            .replace(/(?<!\w)([Aa]) (_|\*\*)?([AEIOaeio])/g, "$1n $2$3"))
                    } catch (e) {
                        console.error("Cannot interpret file: " + fullPathSrc, e)
                    }
                } else {
                    console.log(`Skipping file: ${fullPathSrc}`)
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
    [cap(s)+'s']: cap(d)+'s'
})

walk("./sdks", "./medtech-sdk", {
    ...flavours('service', 'data sample'),
    ...flavours('hcp', 'healthcare professional'),
    ...flavours('healthcareElement', 'healthcare element'),
    ...flavours('serviceNoSpace', 'dataSample'),
    ...flavours('hcpNoSpace', 'healthcareProfessional'),
    ...flavours('healthcareElementNoSpace', 'healthcareElement'),
    ...flavours('messageFactory', 'MedTechMessageFactory'),
    ...flavours('defaultMessageFactory', 'iCureMedTechMessageFactory'),
    sdk: 'medtech-sdk',
    ...flavours('sdkName', 'medtech sdk'),
    SdkName: 'Medtech SDK',
    CodeSdkName: 'MedTech',
    medtech: true
});

walk("./sdks", "./ehr-lite-sdk", {
    ...flavours('service', 'observation'),
    ...flavours('serviceNoSpace', 'observation'),
    ...flavours('hcp', 'practitioner'),
    ...flavours('hcpNoSpace', 'practitioner'),
    ...flavours('healthcareElement', 'condition'),
    ...flavours('healthcareElementNoSpace', 'condition'),
    ...flavours('messageFactory', 'EHRLiteMessageFactory'),
    ...flavours('defaultMessageFactory', 'iCureEHRLiteMessageFactory'),
    sdk: 'ehr-lite-sdk',
    ...flavours('sdkName', 'ehr lite sdk'),
    SdkName: 'Ehr Lite SDK',
    CodeSdkName: 'EhrLite',
    ehrlite: true
});
