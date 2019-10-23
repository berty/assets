const fs = require('fs'),
      glob = require('glob'),
      path = require('path');

const rootDir = path.join(__dirname, '../../');
const contentDir = path.join(__dirname, '../content');
const assetsDir = path.join(__dirname, '../assets');

const options = {
  cwd: rootDir,
  nodir: true
};

const files = glob.sync('**/*', options);

files.forEach(file => {
  const filename = file
    .replace(path.extname(file), '')
    .replace(/\/+/g, '_')
    .replace(/\s+/g, '-')
    .toLowerCase();

  const category = file
    .replace(`/${path.basename(file)}`, '')
    .replace(/\/+/g, ' - ')
    .replace(/\_+/g,  ' ')
    .toLowerCase();

  const title = path.basename(file);

  const breadcrumbs = file
    .split('/')
    .map(crumb => `"${crumb}"`)

  let frontmatter = "---\n";
  frontmatter += `title: ${title}\n`;
  frontmatter += `categories: ["${category}"]\n`;
  frontmatter += `breadcrumbs: [${breadcrumbs}]\n`;
  frontmatter += `file: ${path.basename(file)}\n`;
  frontmatter += '---';

  fs.writeFileSync(path.join(contentDir, `${filename}.md`), frontmatter);

  fs.copyFileSync(path.join(rootDir, file), path.join(assetsDir, title));
});

// helpers
function titleCase(str) {
  str = str.toLowerCase().split(" ");
  let final = [];

  for (let word of str) {
    final.push(word.charAt(0).toUpperCase() + word.slice(1));
  }

  return final.join(" ");
}
