const path = require("path");
const fs   = require("fs");
const Mustache = require("mustache")

function walk(src, dst, view) {
    fs.readdirSync(src).forEach(f => {
        const fullPathSrc = path.join(src, f);
        const fullPathDst = path.join(dst, f);
        if (fs.statSync(fullPathSrc).isDirectory()) return walk(fullPathSrc, fullPathDst, view);
        else {
            fs.writeFileSync(fullPathDst, Mustache.render(fs.readFileSync(fullPathSrc, { encoding: 'utf8', flag: 'r' }), {}))
        }
    });
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const flavours = (s, d) => ({
    [s]: d,
    [cap(s)]: cap(d),
    [s+'s']: d+'s',
    [cap(s)+'s']: cap(d)+'s',
})

walk("./sdks", "./medtech-sdk", {
    ...flavours('service', 'data sample'),
    ...flavours('hcp', 'healthcare professional'),
    ...flavours('sdk', 'medtech-sdk'),
    ...flavours('healthcareElement', 'healthcare element'),
    medtech: true
});

walk("./sdks", "./ehr-lite-sdk", {
    ...flavours('service', 'observation'),
    ...flavours('hcp', 'practitioner'),
    ...flavours('sdk', 'ehr-lite-sdk'),
    ...flavours('healthcareElement', 'condition'),
    ehrlite: true
});
