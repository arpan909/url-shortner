const express= require('express');
const app=express();
require('./db/mongoose');
const Data=require('./models/data');
const hbs=require('hbs');
const path=require('path');
const helmet=require('helmet');
const morgan= require('morgan');
const {nanoid}= require('nanoid');
const publicPath=path.join(__dirname,'/public');

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set('view engine','hbs');
app.use(express.static('./public'));
app.set('views',publicPath);

var urls;

app.get('',async (req,res)=>{
   
    try {
        urls= await Data.find({});   
    } catch (error) {
        res.send(error);
    }
    console.log(urls);
    res.render("home",{urls});
})
//Get the short url by id
app.get('/:id',async (req,res)=>{
    const {id:alias}=req.params;
    try {
        const data=await Data.findOne({alias});
        if(!data){
            console.log(urls);
            return res.render('home',{msg:"No URL Found!",urls:urls});
        }
        res.redirect(data.url);
    } catch (error) {
      
        res.render('home',{msg:"No URL Found!",urls:urls});
    }
});

//Post The Url
app.post('/url',async (req,res,next)=>{
    var {alias,url}=req.body;
    if(!alias){
        alias=nanoid(5);
    }
    if(!url.includes('https:/')){
        url="https://"+url;
    }
    const data=new Data({alias,url});
    try {
        await data.save();
        res.redirect('/');
    } catch (error) {
        if(error.message.startsWith('E11000')){
            error.message="Alias is in Use!";
        }
        next(error);
    }

})

app.use((error,req,res,next)=>{
    if(error.status){
        res.status(error.status);
    }
    else{
        res.status(500);
    }
    res.render("home",{msg:"Alias in Use!",urls:urls});
    
});
app.listen(3000,()=>{console.log("Server Started At 3000!");});