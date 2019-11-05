const fs = require('fs'),
      glob = require('glob'),
      path = require('path');

const rootDir = path.join(__dirname, '../../');
const contentDir = path.join(__dirname, '../content');
const assetsDir = path.join(__dirname, '../assets/files');

[contentDir, assetsDir].forEach(dir => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.readdir(dir, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(dir, file), err => {
        if (err) throw err;
      });
    }
  });
})

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
    const filename = folder 
      .replace(/.$/, '')
      .replace(`${category}/`, '')
      .replace(/\/+/g, '-')
      .concat(`--${file}`);

    let fm = "---\n";
    fm += `title: ${title}\n`;
    fm += `show_in_list: ${filesToShowinList.includes(file)}\n`;
    fm += `folder_id: ${folderId}\n`;
    fm += `categories: ["${category}"]\n`;
    fm += `file_path: /files/${filename}\n`;
    fm += `file_name: ${file}\n`;
    fm += '---';

    fs.writeFileSync(path.join(contentDir, `${filename}.md`), fm);
    fs.copyFileSync(path.join(rootDir, folder, file), path.join(assetsDir, filename));
  })
});