
/* IMPORTS */
const fs=require('fs'); 
const http = require('http');
const url=require('url');



const replaceTemplate=(temp,product)=>{
    let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output=output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output=output.replace(/{%PRICE%}/g,product.price);
    output=output.replace(/{%FROM%}/g,product.from);
    output=output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%DESCRIPTION%}/g,product.description);
    output=output.replace(/{%ID%}/g,product.id);
    if(!product.organic)output=output.replace(/{%NOT_ORGANIC%}/g,`not-organic`);
    return output;
}

const overview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const product = fs.readFileSync(`./templates/product.html`,'utf-8');
const tempCard= fs.readFileSync(`./templates/template-card.html`,'utf-8');
const data=fs.readFileSync(`./dev-data/data.json`,'utf-8');
const productData=JSON.parse(data);
const s = http.createServer((request,response)=>{
    // const amit=(request.url);
    const query=url.parse(request.url,true).query.id;
    const pathname=url.parse(request.url,true).pathname;

    ///// overview page
    if(pathname==='/' || pathname==='/overview'){
        response.writeHead(200,{'Content-type':'text-html'});
        const cardsHtml=productData.map(el=>(replaceTemplate(tempCard,el))).join('');
        const output=overview.replace(`{%PRODUCT_CARDS%}`,cardsHtml);
        response.end(output);
    }

    ////// product page
    else if(pathname==='/product'){
        const end=replaceTemplate(product,productData[query]);
        response.end(end);
    }

    /////// API
    else if(pathname=='/api'){
        response.writeHead(200);
        response.end(data);
        console.log(productData);
    }
    else{
        response.writeHead(404);
        response.end('Page Not Found!!!');
    }
})
s.listen(8000,()=>{
    console.log("Listening...");
});