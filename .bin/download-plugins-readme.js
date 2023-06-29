import fs from 'node:fs';
import path from 'node:path';

import fetch from 'node-fetch';

const plugins = {
  'Platform Init': { name: 'soundworks-plugin-platform-init', branch: 'main' },
  'Position': { name: 'soundworks-plugin-position', branch: 'v4' },
  'Filesystem': { name: 'soundworks-plugin-filesystem', branch: 'v4' },
  'Scripting': { name: 'soundworks-plugin-scripting', branch: 'v4' },
};

// // github urls are in the form
// // https://raw.githubusercontent.com/collective-soundworks/soundworks-plugin-position/v4/README.md

const sortedKeys = Object.keys(plugins).sort();

const menuEntries = [];

for (let pluginName of sortedKeys) {
  const plugin = plugins[pluginName];
  const url = `https://raw.githubusercontent.com/collective-soundworks/${plugin.name}/${plugin.branch}/README.md`;

  const res = await fetch(url);
  const readme = await res.text();

  // insert link to github repo, to be fixed
  // build error:
  // ReferenceError: document is not defined

  // const lines = readme.split('\n');
  // let githubLink = `https://github.com/collective-soundworks/${plugin.name}`;
  // if (plugin.branch !== 'main') {
  //   githubLink += `/tree/${plugin.branch}`;
  // }

  // const githubIcon = `<p><sc-icon icon="github" href="${githubLink}"></sc-icon></p>`;
  // lines.splice(1, 0, githubIcon);
  // const processedReadme = lines.join('\n');

  const filename = plugin.name
    .replace('soundworks-plugin-', '');

  const pathname = path.join('plugins', `${filename}.md`);

  fs.writeFileSync(pathname, readme);

  menuEntries.push({
    text: pluginName,
    link: `/plugins/${filename}`,
  });
}

const sidebarContent = `\
// file generated by .bin/download-plugins-readme.js
export default {
  text: 'Plugins',
  items: ${JSON.stringify(menuEntries, null, 2)},
};
`;

const sidebarPathname = path.join('.vitepress', 'sidebar-plugins.js');
fs.writeFileSync(sidebarPathname, sidebarContent);
