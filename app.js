//jshint esversion:6

const express = require('express')
const bodyparser = require('body-parser')
const utils = require(__dirname+'/public/js/utils')

const app = express()

let items = []
let listaDeListas = {}
const {listadefault,dayList,validaLista}  = utils;

listaDeListas[listadefault] = []
items.forEach((element)=>{
    listaDeListas[listadefault].push(element);
})

app.set('view engine', 'ejs') 
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static('public'))

app.get('/',(req,res)=>{

let today = new Date();
let urlObj = new URL(req.protocol+ '://'+req.get('host')+req.originalUrl  )
let lista = urlObj.searchParams.get('lista');
let day = dayList[today.getDay()];
let redirecturl ='';

redirecturl = '/' + (validaLista(lista)? ('?lista='+lista) : '')

if(validaLista(lista) && listaDeListas[lista]===undefined ){
    listaDeListas[lista] = []
}

res.render('index', {'kindOfDay':day,
                     'listaActual':(validaLista(lista)?lista:listadefault),
                     'redirecturl':redirecturl,
                     'listaDeListas':listaDeListas,
                     'listItems':listaDeListas[(validaLista(lista)?lista:listadefault)]});
});

app.post('/',(req,res)=>{
    let urlObj = new URL(req.protocol+ '://'+req.get('host')+req.originalUrl  )
    let lista = urlObj.searchParams.get('lista');
    let redirecturl ='';
    var item = req.body.newItem;
    listaDeListas[(validaLista(lista)?lista:listadefault)].push(item);
    redirecturl = '/' + (validaLista(lista)? ('?lista='+lista) : '')
    res.redirect(redirecturl)
})

app.post('/nuevalista',(req,res)=>{
    let urlObj = new URL(req.protocol+ '://'+req.get('host')+req.originalUrl  )
    let lista = urlObj.searchParams.get('lista');
    let redirecturl ='';
    var item = req.body.newItem;

    if(listaDeListas[item]===undefined ){
        listaDeListas[item]=[];
    }

    redirecturl = '/' + (validaLista(lista)? ('?lista='+lista) : '')
    res.redirect(redirecturl)
})

app.listen('3000',()=>{
    console.log('arriba por puerto 3000')
})