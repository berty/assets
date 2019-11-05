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
  ignore: ['_archives/**', 'docs/**', 'LICENSE', 'README.md']
};

const folders = glob.sync('**/', options);

folders.forEach(folder => {
  
  const files = fs
    .readdirSync(path.join(rootDir, folder), { withFileTypes: true })
    .filter(item => !item.isDirectory())
    .map(file => file.name)

  const mainFile = files
    .find(file => file.startsWith('1_'));

  const folderId = folder
    .replace(/.$/, '')
    .replace(/\/+/g, '-');

  const category = folder
    .split('/')[0];

  const filesToShowinList = mainFile
    ? [mainFile]
    : files;

  files.forEach(file => {
    const title = path.basename(file);

    let fm = "---\n";
    fm += `title: ${title}\n`;
    fm += `show_in_list: ${filesToShowinList.includes(file)}\n`;
    fm += `folder_id: ${folderId}\n`;
    fm += `categories: ["${category}"]\n`;
    fm += `file_path: /files/${file}\n`;
    fm += `file_name: ${file}\n`;
    fm += '---';

    fs.writeFileSync(path.join(contentDir, `${title}.md`), fm);
    fs.copyFileSync(path.join(rootDir, folder, file), path.join(assetsDir, file));
  })
});