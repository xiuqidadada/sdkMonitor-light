rollup -c --bundleConfigAsCjs

uglifyjs dist/index.cjs.js -c -m -o  dist/index.cjs.js

uglifyjs dist/index.esm.js -c -m -o dist/index.esm.js

uglifyjs dist/index.js -c -m -o dist/index.js

