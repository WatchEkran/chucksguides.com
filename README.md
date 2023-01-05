This repo is the source code for [chucksguides.com](https://chucksguides.com).

## Prerequisites

The following software is needed if you are updating the HTML version of the PDFs:

- [pdf2htmlEX](https://github.com/coolwanglu/pdf2htmlEX) - converts PDF files to HTML
- [cwebp](https://developers.google.com/speed/webp/download) - converts JPG/PNG images to the more efficient .webp format

## How to generate HTML version of PDF guide

Run this command:

```bash
pdf2htmlEX guide.pdf index.html --split-pages 1 --page-filename %d.page.html --bg-format svg --embed cfijO --optimize-text 1 --dest-dir output --turn-off-ligatures 1 --external-hint-tool=ttfautohint
```

|Parameter|Explanation|
|-|-|
|`guide.pdf`|Input PDF file.|
|`index.html`|Name to save the entry HTML file as.|
|`--split-pages 1`|Splits each page into its own partial HTML file. If this is off, then all the pages will get added to the entry HTML file, which will then load the background image for every page all at once.|
|`--page-filename`|Filename to save the pages as. `%d` is the placeholder for the page number, and we save it as `.page.html` so that it's easy to search for the pages using the wildcard `*.page.html`.|
|`--bg-format svg`|Saves the background images as SVGs. Other possible choices are PNG and JPG, but we use SVG for the reasons mentioned below.|
|`--embed cfijO`|Shorthand for create external files for CSS, fonts, images, and Javascript, but embed the outline. There's a bug with pdf2htmlEX where an external outline file isn't loaded.|
|`--optimize-text 1`|Reduces the number of DOM nodes created in the output HTML. There's not much of a reduction, but better than nothing.|
|`--dest-dir output`|Folder to save the output into, otherwise it's dumped into the current folder.|
|`--turn-off-ligatures 1`|Adds CSS to disable ligatures. When certain characters (like `ft`) are close enough to each other, pdf2htmlEX will convert it to a ligature, but none of the guides use ligatures and don't use fonts that support ligatures, so without this option some of the text will become invisible.|
|`--external-hint-tool=ttfautohint`|Use `ttfautohint` as the font hinting tool. Doesn't seem to make much of a difference compared to without this parameter or when compared to `auto-hint 1`, but it's recommended by pdf2htmlEX.|

pdf2htmlEX is fairly fast but single-threaded. To batch convert a lot of PDFs simultaneously, you can use [GNU Parallel](https://www.gnu.org/software/parallel/) to run multiple jobs at once:

```bash
ls *.pdf | parallel 'pdf2htmlEX {} --split-pages 1 --page-filename %d.page.html index.html --bg-format svg --embed cfijO --optimize-text 1 --dest-dir {.} --turn-off-ligatures 1 --external-hint-tool=ttfautohint'
```

Adding `--dry-run` will show the commands it will run instead of running them:

```bash
ls *.pdf | parallel --dry-run 'pdf2htmlEX {} --split-pages 1 --page-filename %d.page.html index.html --bg-format svg --embed cfijO --optimize-text 1 --dest-dir {.} --turn-off-ligatures 1 --external-hint-tool=ttfautohint'
```

#### Why SVG instead of PNG or JPG

Some of the guides have large embedded images that are shrunken down to fit on the page, or have images that are greater than 72 DPI. For example, the aircraft cutaway diagrams tend to be high resolution. pdf2htmlEX has a DPI setting, but for PNG and JPG it will always create a 72 DPI image; the DPI setting only sets the image size. This means that to preserve the same quality as the original image in the PDF, the DPI needs to be really high, like 300-400 DPI. Not only will this create huge file image sizes, but only some images need this, not all of them, so in most cases we'd be needlessly scaling an image up, just to account for the few images that actually need the higher resolution.

SVG on the other hand has these advantages:

1. The original image will be embedded in the SVG, so if the original image was lower resolution, it doesn't get scaled up, and if it's higher resolution, it's preserved.
2. There are a lot of vector graphics in the PDFs (arrows, boxes, circles), which are preserved as vectors with SVG, keeping them nice and sharp at any resolution. This is particularly important for mobile, where people may zoom into the page a lot.
3. Although the original images are base64-encoded, which will increase the file size by 25-33%, the CDN (CloudFlare) will compress SVGs using brotli before serving them, bringing the actual served file size down quite a bit. In testing with brotli compression enabled, the final size of all the HTML files is only about 5-10% larger than the PDF version, and this is assuming someone loads every single page. 