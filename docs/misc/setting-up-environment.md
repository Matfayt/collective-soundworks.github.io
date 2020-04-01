# Setting Up an Environment

How to set up an environment to get started with `soundworks`.

## Install Node.js

### Mac OSX

1. Open [https://nodejs.org/en/](`https://nodejs.org/en/`) in your favorite browser (which shall not be Safari).
2. Download the LTS (Long Term Support) version.
3. Follow the instructions... 
4. When done, open a Terminal (cf. `Applications/Utilities/Terminal.app`) and type:

```
node -v
```

Press "Return" and you should see:

```
v12.16.1
```

(...or whatever Node.js version you just installed)

5. Done!

## Install Build Tools

For some applications you will need tools to compile code, etc.

### Mac OSX

1. Open a Terminal (in `Applications/Utilities/Terminal.app`) and type:

```
xcode-select --install
```

2. Click "Install" in the pop-up window and wait...
3. Done!

## Install a Text Editor

Pick a text editor of your choice, popular text editor nowadays seems to be
- Sublime Text 3 - [download](https://sublimetext.com/3) - _tells you from time to time that it would be nice to buy a license, but that's all_
- VSCode - [download](https://code.visualstudio.com/) - _probably a good idea if your are on windows_
- Atom - [download](https://atom.io/)

### Sublime Text 3 - Advanced Configuration

If you just want to run an application, you can stop here.
These are just the author preferences, do whatever is best for you.

#### Package Control

Package control allows to install new packages and extends sublime text,
follow instruction [here](https://packagecontrol.io/installation).

#### EcmaScript Syntax

It nice to install a new package to support new JavaScript language features:

1. In Sublime type: `cmd + shift + p`
2. Type "Install" in the dialog box, select "Package Control: Install Package"
3. Search for the "Ecmascript Syntax" package and install it

#### Sublime Settings

Go to `Preferences > Settings`, paste the following in the `Preferences.sublime-settings - User` file and save (`cmd + s`):

```json
{
  "caret_style": "blink",
  "color_scheme": "Packages/Color Scheme - Default/Monokai.sublime-color-scheme",
  "default_line_ending": "unix",
  "ensure_newline_at_eof_on_save": true,
  "font_size": 10,
  "highlight_line": true,
  "ignored_packages":
  [
    "Markdown",
    "Vintage"
  ],
  "index_files": false,
  "rulers":
  [
    80
  ],
  "show_encoding": true,
  "show_full_path": true,
  "show_line_endings": true,
  "tab_size": 2,
  "translate_tabs_to_spaces": true,
  "tree_animation_enabled": false,
  "trim_trailing_white_space_on_save": true,
  "word_wrap": true
}
```
