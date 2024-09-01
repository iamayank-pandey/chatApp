//Hadling uncaught Exception occur due to any reason.
process.on('uncaughtException', (error)=>{
    console.log(`ERROR: ${error.message}`);
    console.log('Shutting down the application due to Unhandled Exception');
        process.exit(1);
});

const app = require('./app');
require('./database');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

//handling the Unhandled Promise rejection
process.on('unhandledRejection', (error)=>{
    console.log(`ERROR: ${error.message}`);
    console.log(`ERROR: ${error}`);
    console.log(error)
    console.log('Shutting down the server due to Unhandeled promise Rejection');
    server.close(()=>{
        process.exit(1);
    });
});



// For pure node applications
// const server = http.createServer(function(req, res){
//     const pathname = req.url;
//     if(pathname === "/overview"){
//         res.end("From Overview route");
//     }else if(pathname === "/product"){
//         res.end("Hello from the serve");
//     }else{
//         res.writeHead(404, {
//             'Content-type': 'text/html',
//             'my-own-header': 'hello ji'
//         });
//         res.end("Not found!");
//     }
// });

// const url = require('url'); helps to extract query parameters from url string
// url.parse(req.url) => this will return an object with many usefull keys


// Instead of './dev-data/data.json' use `${__dirname}/dev-data/data.json` -> __dirname is the special variable which represent the current file path

// If you using any html template with Node then you need to place some special markers in html file and in your node application you can read that template and use string.replace method to replace those marker with the orginal data that you want.

// node js is made of V8 engine(cpp and js) and libuv(c++)
// Node js gives heavy task to threads in thread pool so main thread will not block but remember node is single threaded only, but libuv provide additional functionalities like event loop and thread pool.
// server.listen(8000, '127.0.0.1', () =>{
//     console.log("Server started!");
// });