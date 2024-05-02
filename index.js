const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.get('/',(req,res)=> {
    res.send('Car Doctor is Server')
})

app.listen(port,()=>{
    console.log(`Car Doctor Running on ${port}`);
})