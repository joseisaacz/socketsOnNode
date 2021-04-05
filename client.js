const { Socket } = require('net');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})
const END = 'END';


const error = (error) => {
    console.error(error);
    process.exit(1);
}

const connect = (host, port) => {
    console.log(`Connecting to ${host}:${port}`);
    const socket = new Socket();
    socket.connect({ host, port });
    socket.setEncoding('utf-8');

    socket.on('connect', () => {
        console.log('Connected');

        readline.question('Choose your username-> ', (username) => {
            socket.write(username);
            console.log(`Type any message, type ${END} to finish`);
        });

        readline.on('line', (line) => {
            socket.write(line);
            if (line === END) {
                socket.end();
            }

        });
        socket.on('data', (data) => {
            console.log(data);
        });
    });

    socket.on('close', () => process.exit(0));
    socket.on('error', (error) => error(error.message));

}

const main = () => {
    if (process.argv.length !== 4) {
        error(`Usage: node ${__filename} host port`);
    }
    let [, , host, port] = process.argv;
    if (isNaN(port)) {
        error(`Invalid port ${port}`);
    }
    port = Number(port);
    connect(host, port);
    console.log(`${host}:${port}`);
}

if (require.main === module) {
    main();
}