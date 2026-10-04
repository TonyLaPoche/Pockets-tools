import { readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

function render(svgPath, size, outPath) {
  const svg = readFileSync(svgPath)
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
  })
  writeFileSync(outPath, resvg.render().asPng())
}

render('public/favicon.svg', 192, 'public/pwa-192.png')
render('public/favicon.svg', 512, 'public/pwa-512.png')
render('public/icon-maskable.svg', 512, 'public/pwa-maskable-512.png')
render('public/favicon.svg', 180, 'public/apple-touch-icon.png')
