const fs = require('fs'),
      glob = require('glob'),
      path = require('path');

const rootDir = path.join(__dirname, '../../');
const contentDir = path.join(__dirname, '../content');
const assetsDir = path.join(__dirname, '../assets/files');

if (!fs.existsSync(assetsDir)){
  fs.mkdirSync(assetsDir, { recursive: true });
}

if (!fs.existsSync(contentDir)){
  fs.mkdirSync(contentDir, { recursive: true });
}

const options = {
  cwd: rootDir,
  nodir: true,
  ignore: ['_archives/**/*', 'docs/**/*', 'LICENSE', 'README.md']
};

const files = glob.sync('**/*', options);

files.forEach(file => {
  const filename = file
    .replace(path.extname(file), '')
    .replace(/\/+/g, '_')
    .replace(/\s+/g, '-')
    .toLowerCase();

  const title = path.basename(file);

  const breadcrumbs = file
    .split('/')
    .map(crumb => `"${crumb}"`);

  const category = breadcrumbs[0];

  let frontmatter = "---\n";
  frontmatter += `title: ${title}\n`;
  frontmatter += `categories: [${category}]\n`;
  frontmatter += `breadcrumbs: [${breadcrumbs}]\n`;
  frontmatter += `file_path: /files/${path.basename(file)}\n`;
  frontmatter += `file_name: ${path.basename(file)}\n`;
  frontmatter += '---';

  fs.writeFileSync(path.join(contentDir, `${filename}.md`), frontmatter);
  fs.copyFileSync(path.join(rootDir, file), path.join(assetsDir, title));
});