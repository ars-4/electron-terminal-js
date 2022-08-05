const child_process = require('child_process');
const { ipcRenderer } = require('electron');
const inputBox = document.getElementById('inputBox');
const outputBox = document.getElementById('outputBox');
const path = document.getElementById('path');
let lastCommand = [];
let lastCommandsIndex = lastCommand.length - 1;

// Get Current Path
function get_current_path() {
    let cd = child_process.exec("cd");
    cd.stdout.on('data', (data) => {
        path.innerHTML = data;
    })
}

// Put Input Box on focus
function ibf() {
    inputBox.value = "";
    inputBox.focus();
    inputBox.scrollIntoView();
}

// Appender Function
const appender = (_msg, _color) => {
    let p = document.createElement('a');
    p.innerHTML = _msg;
    if (_color) {
        p.style.color = _color;
    }
    outputBox.appendChild(p);
}


// Run Process
const run_process = (_process) => {
    let command = child_process.exec(_process);
    lastCommand.push(_process);
    lastCommandsIndex = lastCommand.length - 1;
    get_current_path();
    let data_std = command.stdout.on('data', (data) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i] === "\n") {
                appender("\n" + "<br>");
            }
            else if (data[i] === " ") {
                appender("&nbsp;");
            }
            else if (data[i] === "\t") {
                appender("--------");
            }
            else {
                appender(data[i]);
            }
        }
    })

    command.stderr.on('data', (data) => {
        appender(data + "<br>", "red");
    })

    command.on('close', (code) => {
        appender("Command executed with code: " + code + "<br><br>", "yellow");
        ibf();
    })
}

// Exit on exit
function exit() {
    ipcRenderer.send('closeApp');
}

// Prevention to open CMD
function open_new_window() {
    ipcRenderer.send('newWindow');
}


// Input Function
function input_function(e) {
    if (e.value == "Enter" | e.keyCode == 13) {

        // cls
        if (inputBox.value === 'cls') {
            outputBox.innerHTML = "";
            ibf();
        }

        // Exit
        else if (inputBox.value === 'exit' | inputBox.value === 'quit') {
            exit();
            ibf();
        }

        // New Window
        else if (inputBox.value === 'start' | inputBox.value === 'Start') {
            open_new_window();
            ibf();
        }

        // Others
        else {
            run_process(inputBox.value);
        }

        console.log("Running");
    }
    else if (e.keyCode == 38) {
        if (lastCommandsIndex >= lastCommand.length) {
            lastCommandsIndex = lastCommand.length - 1;
            inputBox.value = lastCommand[lastCommandsIndex];
            lastCommandsIndex = lastCommandsIndex - 1;
        }
        else if (lastCommandsIndex < 0) { 
            lastCommandsIndex = lastCommand.length - 1;
            inputBox.value = lastCommand[lastCommandsIndex];
            lastCommandsIndex = lastCommandsIndex - 1;
        }
        else {
            inputBox.value = lastCommand[lastCommandsIndex];
            lastCommandsIndex = lastCommandsIndex - 1;
        }
    }
    else if (e.keyCode == 40) {
        if (lastCommandsIndex > lastCommand.length | lastCommandsIndex == lastCommand.length) {
            lastCommandsIndex = 0;
            inputBox.value = lastCommand[lastCommandsIndex];
            lastCommandsIndex = lastCommandsIndex + 1;
        }
        else if (lastCommandsIndex < 0) { 
            lastCommandsIndex = lastCommand.length - 1;
            inputBox.value = lastCommand[lastCommandsIndex];
            lastCommandsIndex = lastCommandsIndex + 1;
        }
        else {
            inputBox.value = lastCommand[lastCommandsIndex];
            lastCommandsIndex = lastCommandsIndex + 1;
        }
    }
    else {
        console.log(e.keyCode);
    }
}

get_current_path();
inputBox.focus();
