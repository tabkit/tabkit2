# Extension Development
This document will explain stuff required to develop this extension.  

## Environments

### Browser
You should have
- [Palemoon](https://www.palemoon.org/download.shtml) (Windows/Linux) - the latest version this extension supports  
  Portable Version Recommended (for extension development)
- [White Star](https://dbsoft.org/whitestar.php) (MacOS) - the latest version this extension supports  

### Version Control System - Git
- [Git for Windows](https://gitforwindows.org)
- [Git for Windows but from Git Official Website](https://git-scm.com/download/windows)
- [Git for Mac via Homebrew](https://formulae.brew.sh/formula/git)

### Git GUI (Optional) 
I use [Source Tree](https://www.sourcetreeapp.com) personally  
but feel free to use other GUI or simply stick to command line.

### Command Line App
For MacOS, `Terminal` works but I use `iTerms` personally.  
Up to you to pick what you want to use.  

For Windows I use [Cmder](https://cmder.net)  
Let me know if you think there is a better choice  

### Node JS + Yarn
[Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com)  
I think both Windows and MacOS should be able to install the above  


## Browser Setup

### Profile Creation
You probably want to use a different profile than the default one for extension development.  
This can be done via
- Install [Profile Switcher](https://addons.palemoon.org/addon/profile-switcher/)
- Start the application with arguments
  - (MacOS) `open White\ Star.app --args --ProfileManager`
  - (Windows) `PaleMoon.exe --ProfileManager` (I haven't tested this so might be wrong)
  - (Linux) I have no idea
- Create a new profile

### Project Setup 1
Then you will have to clone the project code to your local computer first
It would be something like `git pull` (Or just use the GUI)
More steps before we really setup the browser:  
- Enter the project folder
- Create a folder `build` (if it doesn't exist)
- Copy the full path to that folder `build` (We will refer it as `Path A` later)

### Profile Setup
Now we can setup the created profile:
- Locate the folder for the created profile
  - (Windows) For portable it should be the `Data` folder, dig around until you find `Profiles`
  - (MacOS) `~/Library/Application Support/Pale Moon/Profiles/{Profile-Folder-Name}`
- In **profile folder** (The one with unique name under `Profiles`)
  - Create folder `extensions` if it doesn't exist, and enter it
  - Create an empty file named `tabkit2@pikachuexe.amateur.hk` (the ID for this extension)
  - Edit the created file and input `Path A`, and **Save the file**

### Project Setup 2
- Open "Command Line App"  
- Enter the project folder (`cd`?)  
- `yarn`
- `npm run dev` (This will run a foreground process, blocking your input until you press Ctrl+C)
- You can `Ctrl+C` to exit before testing the environment

### Testing
- Start Palemoon/White Star
- Choose the profile created/setup
- Install Tab Kit (it should prompt you to install)


## Development
Every time you want to make changes and preview, you need to
- Update code in `src` (**Not** `build` which stores processed files generated from `src`)
- Run `npm run dev` and **do not exit** (so that it keeps `build` updated when anything in `src` changed)
- Start Palemoon/White Star with correct profile to preview changes


## Release
This should probably be done by project owner(s)  
In case you want to try building your own:
- Update version number and/or other stuff in `src/install.rdf`
- `npm run release`
- Find the built XPI file(s) in folder `product`

