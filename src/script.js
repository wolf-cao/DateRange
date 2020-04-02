let fs = require('fs')
let path = require('path')

let lessPath = path.join(process.cwd(), 'src')
let libPath = path.join(process.cwd(), 'lib')

fs.readFile(path.join(lessPath, 'index.less'), 'utf-8', (err, fileData) => {
  fs.writeFileSync(path.join(libPath, 'index.less'), fileData)
})
