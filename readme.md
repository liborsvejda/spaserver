# Single Page Application server pro výukové účely.

Tento malý "framework" umí následující věci:
- pro url="/" vrací obsah souboru "index.html"
- pro url končící příponou souboru vrací obsah tohoto souboru i s odpovídajícím Content-typem
- vše ostatní jsou REST služby...
- nastavuje req.pathname na hodnotu url.parse(req.url).pathname
- pro GET metody nastavuje req.parameters na hodnotu url.parse(req.url, true).query
- pro POST metody nastavuje req.parameters na hodnotu JSON.parse(data), kde data je obsah body z požadavku
- po nastavení req.pathname a req.parameters zavolá odkazem předanou funkci processApi, ve které programátor provádí požadovanou funkčnost jednotlivých API 

Postup:
- do nové Node.js aplikace přidat modul spaserver: <pre>npm i https://github.com/liborsvejda/spaserver</pre>
- vytvořit index.html
- vytvořit index.js, do něj vložit import, nadefinovat funkci pro zpracování REST API a zavolat createSpaServer
<pre>
     const createSpaServer = require("spaserver").createSpaServer;
     
     const PORT = 8888;
     
     const API_STATUS_OK = 0;
     const API_STATUS_NOT_FOUND = -1;
     
     const DNY_V_TYDNU = ["Neděle","Pondělí","Úterý","Středa","Čtvrtek","Pátek","Sobota"]
     
     const API_HEAD = {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
     };
     
     function processApi(req, res) {
        res.writeHead(200, API_HEAD);
        let obj = {};
        if (req.pathname === "/denvtydnu") {
            obj.status = API_STATUS_OK;
            let dt = new Date();
            let denVTydnu = DNY_V_TYDNU[dt.getDay()];
            obj.datum = `${dt.getDate()}.${dt.getMonth()+1}.${dt.getFullYear()}`;
            obj.den = denVTydnu;
        } else {
            obj.status = API_STATUS_NOT_FOUND;
            obj.error = "API not found";
        }
        res.end(JSON.stringify(obj));
     }
     
     createSpaServer(PORT, processApi);
</pre> 

Příklad použití https://github.com/liborsvejda/spaserverexample
