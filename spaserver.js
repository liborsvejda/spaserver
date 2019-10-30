const http = require("http");
const url = require("url");
const fs = require("fs");
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

let srv;

const encodeStrings = function(o) {
    for (let a in o) {
        let v = o[a];
        if (typeof v === "object") {
            encodeStrings(o[a]);
        } else if (typeof v === "string") {
            o[a] = entities.encode(v);
        }
    }
}

const fileRequested = function(req, res) {
    let q = url.parse(req.url, false);
    let fileName = q.pathname;
    if (fileName == "/") {
        fileName = "/index.html";
    }
    if (fileName.lastIndexOf(".") < 0 || fileName.lastIndexOf(".") < fileName.length - 6) { //pozadavek nema priponu souboru
        return false;
    }
    if (fileName.charAt(0) === '/') {
        fileName = fileName.substr(1);
    }
    if (!fs.existsSync(fileName)) {
        console.error(`File ${fileName} not exists.`);
        res.writeHead(404);
        res.end();
        return true;
    }
    let contentType = "application/octet-stream";
    if (fileName.toLowerCase().endsWith(".html")) {
        contentType = "text/html";
    } else if (fileName.toLowerCase().endsWith(".css")) {
        contentType = "text/css";
    } else if (fileName.toLowerCase().endsWith(".js")) {
        contentType = "text/javascript";
    } else if (fileName.toLowerCase().endsWith(".jpg") || fileName.endsWith(".jpeg")) {
        contentType = "image/jpeg";
    } else if (fileName.toLowerCase().endsWith(".png")) {
        contentType = "image/png";
    } else if (fileName.toLowerCase().endsWith(".pdf")) {
        contentType = "application/pdf"
    };
    let file = fs.createReadStream(fileName);
    file.on('open', function () {
        res.writeHead(200, {'Content-Type': contentType});
        file.pipe(res);
    });
    file.on('end', function () {
        res.end();
    });
    file.on('error', function () {
        console.error(`Error reading file ${fileName}.`);
        res.writeHead(500);
        res.end();
    });
    return true;
}

//nastavi pathname do req.pathname
//nastavi vstupni parametry do req.parameters pro GET i POST pozadavky
//a zavola fci processApipredanou odkazem
exports.createSpaServer = function(port, processApi) {
    srv = http.createServer((req, res) => {
        //pozadavek na home page
        if (req.url === "/") {
            fs.readFile('index.html', function (err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
            return;
        }
        //pozadavek na staticky soubor
        if (fileRequested(req, res)) {
            return;
        }
        //vse ostatni krome souboru budou REST sluzby
        let q = url.parse(req.url, true);
        req.pathname = q.pathname;
        if (req.method === 'POST') {
            let data = "";
            req.on('data', function (chunk) {
                try {
                    data += chunk;
                } catch (e) {
                    console.error(e);
                }
            })
            req.on('end', function () {
                req.rawBody = data;
                if (data) {
                    try {
                        req.parameters = JSON.parse(data);
                        encodeStrings(req.parameters);
                        processApi(req, res);
                    } catch (e) {
                        console.error(e);
                    }
                }
            })
        } else {
            req.parameters = q.query;
            encodeStrings(req.parameters);
            processApi(req, res);
        }
    }).listen(port);

    console.log(`Server běží na adrese http://localhost:${port}...`);

    return srv;
};

