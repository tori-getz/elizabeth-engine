const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = require("electron");
const { exec } = require("child_process");
const AnsiToHTML = require("ansi-to-html");
const prompt = require("electron-prompt");
const uniqid = require("uniqid");

let PROJECT_FILE_DIR = "";
let PROJECT_DIR = "";
let PROJECT_FILE = {};
let CODE_DIRECTORY = "";

const fs = require("fs");
const path = require('path');
const isDev = require('electron-is-dev');

const convert = new AnsiToHTML({ newline: true });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "/preload.js"
    }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.webContents.openDevTools();
  mainWindow.setMenuBarVisibility(false)
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("open_project", (event, arg) => {
  console.log("Open project: " + arg);

  PROJECT_FILE_DIR = path.resolve(arg);
  CODE_DIRECTORY = path.resolve(arg, "Code");
  PROJECT_DIR = path.resolve(arg, "Project.json");
  
  console.log("Project file: " + PROJECT_DIR);

  if (fs.existsSync(PROJECT_DIR)) {
    console.log("Project file founded");

    try {
      const rawData = fs.readFileSync(PROJECT_DIR, "utf-8");
      console.log("Raw Project file - " + rawData);

      const PROJECT_FILE = JSON.parse(rawData);
      console.log("Project File: " + PROJECT_FILE);

      console.log("Send in UI...");
      event.reply("load_project", { type: "found", payload: PROJECT_FILE });
    } catch (e) {
      console.log(e);
      event,reply("load_project", { type: "error", payload: e });
    }
  } else {
    console.log("Project file not found");
    event.reply("load_project", { type: "notfound" });
  }
});

ipcMain.on("run_build", (event, message) => {
  console.log("Run build...");
  exec(`cd ${PROJECT_FILE_DIR} && elizabeth-cli build`, (err, stdout, stderr) => {
    if (!err) {
      if (!stderr) {
        console.log("stdout:");
        console.log(stdout);
        event.reply("logs", { type: "stdout", logs: convert.toHtml(stdout) });
      } else {
        console.log("stderr: ");
        console.log(stderr);
        event.reply("logs", { type: "stderr", logs: convert.toHtml(stderr) });
      }
    } else {
      console.log("err: ");
      console.log(err);
      event.reply("logs", { type: "err" });
    }
  });
});

ipcMain.on("save_project", (event, message) => {
  console.log("Save project file...");
  console.log("Project file:");
  console.log(message);
  
  const rawProjectFile = JSON.stringify(message);

  console.log("Raw Project file:");
  console.log(rawProjectFile);

  console.log("Unlink old Project.json...");

  fs.unlinkSync(PROJECT_DIR);

  console.log("Create new Project.json...");
  
  fs.writeFileSync(PROJECT_DIR, rawProjectFile);

  event.reply("logs", { type: "stdout", logs: "Reload Project.json:\n\n" + rawProjectFile });
});

ipcMain.on("sprite_add", (event, message) => {
  console.log("Add sprite...");

  prompt(
    {
      title: "Sprite add",
      label: "Name",
      value: "",
      type: "input"
    }
  )
  .then(spriteName => {
    console.log(`Sprite name: ${spriteName}`);
    prompt(
      {
        title: "Sprite add",
        label: "Path",
        value: "",
        type: "input"
      }
    )
    .then(spritePath => {
      console.log(`Sprite path: ${spritePath}`);

      event.reply("new_sprite", { name: spriteName, path: spritePath });
    });
  });
});


ipcMain.on("sprite_edit", (event, message) => {
  prompt(
    {
      title: "Sprite edit",
      label: "Path",
      value: "",
      type: "input"
    }
  )
  .then(response => event.reply("edit_path", response));
});

ipcMain.on("open_code", (event, file) => {
  let fileToOpen = path.resolve(CODE_DIRECTORY, file);
  
  console.log(`Open file ${fileToOpen}...`);

  let fileData = fs.readFileSync(fileToOpen, "utf-8");

  event.reply(`${file}_opened`, fileData);
});

ipcMain.on("save_code", (event, file) => {
  let fileToSave = path.resolve(CODE_DIRECTORY, file.name);

  fs.writeFileSync(fileToSave, file.data);
});

ipcMain.on("add_code", (event, message) => {
  console.log("Add new code");

  prompt({
    title: "Add code file",
    label: "Name",
    type: 'input'
  })
  .then(fileName => {
    if (fileName !== "" && fileName !== null) {
      console.log("Name:" + fileName);
      prompt({
        title: "Add code file",
        label: "Type",
        type: 'select',
        selectOptions: [ "Please, select", "Joy handler", "Code" ]
      })
      .then(fileType => {
        let codeInProject = {
          id: uniqid(),
          name: fileName,
          path: `${fileName}.c`,
          type: `none`
        };

        if (fileType == 1) {
          codeInProject.type = "joyhandler";
          console.log("Type: Joy Handler");
        }

        if (fileType == 2) {
          codeInProject.type = "code";
          console.log("Type: Code");
        }

        console.log(codeInProject);

        let fileToAdd = path.resolve(CODE_DIRECTORY, `${codeInProject.path}`);
        let data = `//\n// ${codeInProject.path}\n//\n//  Generated by Elizabeth Engine\n//`;

        console.log("Write C file...");
        fs.writeFileSync(fileToAdd, data);

        event.reply("added_code", codeInProject);
      });
    }
  });
});

ipcMain.on("delete_code", (event, message) => {
  console.log(`Delete ${message}...`);
  
  let fileToDelete = path.resolve(CODE_DIRECTORY, message);

  fs.unlinkSync(fileToDelete);
});

ipcMain.on("edit_code", (event, message) => {
  console.log(`Edit code... ID=${message.id}`);
  console.log(message);
  
  prompt({
    title: "Rename code file",
    label: "Name",
    type: 'input'
  })
  .then(fileName => {
    if (fileName !== "" && fileName !== null) {
      console.log("Name: " + fileName);

      console.log("Rename C file...");

      let OldPath = path.resolve(CODE_DIRECTORY, message.path);
      let NewPath = path.resolve(CODE_DIRECTORY, `${fileName}.c`);

      let oldFileData = fs.readFileSync(OldPath, 'utf-8');

      fs.unlinkSync(OldPath);
      fs.writeFileSync(NewPath, oldFileData);

      let renamedFile = {
        id: message.id,
        type: message.type,
        name: fileName,
        path: `${fileName}.c`
      };

      event.reply("updated", renamedFile);
    }
  });
});
