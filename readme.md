# Single Page Application server pro výukové účely.

Tento malý "framework" umí následující věci:
- pro url="/" vrací obsah souboru "index.html"
- pro url končící příponou souboru vrací obsah tohoto souboru i s odpovídajícím Content-typem
- vše ostatní jsou REST služby...
- nastavuje req.pathname na hodnotu url.parse(req.url).pathname
- pro GET metody nastavuje req.parameters na hodnotu url.parse(req.url, true).query
- pro POST metody nastavuje req.parameters na hodnotu JSON.parse(data), kde data je obsah body z požadavku
- stringy v req.parameters zabezpečuje proti XSS
- po nastavení req.pathname a req.parameters zavolá odkazem předanou funkci processApi, ve které programátor provádí požadovanou funkčnost jednotlivých API 

Postup:
- do nové Node.js aplikace přidat modul spaserver: <pre>npm i https://github.com/liborsvejda/spaserver</pre>
- vytvořit index.html
- vytvořit index.js, do něj vložit import, nadefinovat funkci pro zpracování REST API 
a zavolat createSpaServer s dvěma parametry: prvním je port, na kterém server poběží, a druhým je odkaz na funkci zpracovávající API  

Příklad použití https://github.com/liborsvejda/spaserverexample
