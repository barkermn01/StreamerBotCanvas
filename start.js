import http from "http";
import https from 'https'; 
import fs from 'fs';
import mime from 'mime';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const leftTrim = (str, chars) => str.replace(new RegExp("^[" + chars + "+]"), "");

const downloadFile = async (url, fileFullPath) =>{
    console.info('downloading file from url: '+url)
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {

            // chunk received from the server
            resp.on('data', (chunk) => {
                fs.appendFileSync(fileFullPath, chunk);
            });

            // last chunk received, we are done
            resp.on('end', () => {
                resolve('File downloaded and stored at: '+fileFullPath);
            });

        }).on("error", (err) => {
            reject(new Error(err.message))
        });
    })
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = ((config.webroot[0] === "." && config.webroot[0] === ".") ? config.webroot.replace("./", __dirname.replaceAll("\\", "/") + "/") : config.webroot) + "/";
// going to be used in the future to be a way of proxying arround stupid CORS
//const fileStore = ((config.fileStore[0] === "." && config.fileStore[0] === ".") ? config.fileStore.replace("./", __dirname.replaceAll("\\", "/") + "/") : config.fileStore) + "/";


const requestListener = async function (req, res) {
    let file = leftTrim(req.url, '/');
    if (file === "") {
        file = "index.html"
    }
    file = webRoot + file;

    try {
        const fileContent = fs.readFileSync(file);
        res.writeHead(200, { "Content-Type": mime.getType(file) });
        res.end(fileContent);
        return;
    } catch (e) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 File Not Found");
        return;
    }
};

const server = http.createServer(requestListener);
server.listen(config.port, config.host, () => {
    console.log(`Server is running on http://${config.host}:${config.port} make sure you add an OBS Browser to it!`);
});