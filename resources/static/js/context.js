const child_process = require('child_process');

const run_process = (_process) => {
    let command = child_process.exec(_process);
    let data_std = command.stdout.on('data', (data) => {
        console.log(data);
    })
    command.stderr.on('data', (data) => {
        console.log(data);
    })
    command.on('close', (code) => {
        console.log("Command executed with code: " + code);
    })
}


module.exports.run_process = run_process;