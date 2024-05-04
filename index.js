const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors({origin:['http://localhost:5173'],credentials:true}))
app.use(express.json())
app.use(cookieParser())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p2unx4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("carDB");
    const serviceCollection = database.collection("service");
    const bookingCollection = database.collection("booking");


    // Auth related api
    app.post('/jwt',async(req,res)=> {
      const user = req.body
      console.log(user);
      const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECREAT,{expiresIn:'1h'})
      res
      .cookie('token',token,{
        httpOnly:true,
        sameSite:'strict',
        secure:false
      })
      .send({success:true})
    })

    // service related api
    app.get('/service',async(req,res) => {
       const cursor = serviceCollection.find()
       const result = await cursor.toArray()
       res.send(result)
    })

    app.get('/service/:id',async (req,res)=> {
      const id = req.params.id;
      const query = {
        _id:new ObjectId(id)
      }
      const option = {
        projection:{title:1,price:1,service_id:1,img:1,status:1}
      }
      const result = await serviceCollection.findOne(query,option)
      res.send(result)
    })

    app.post('/booking',async(req,res)=> {
      const order = req.body;
      const result = await bookingCollection.insertOne(order)
      res.send(result)
    })
    
    app.get('/booking',async(req,res)=> {
      let query = {}
      console.log('tok tok token',req.cookies.token);
        if(req.query?.email){
          query ={
            email: req.query.email
          }
        }
        const result = await bookingCollection.find(query).toArray()
        res.send(result)
    })

    app.delete('/booking/:id',async(req,res)=>{
      const id = req.params.id;
      const query ={
        _id :new ObjectId(id)
      }
      const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })

    app.patch('/booking/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {
        _id:new ObjectId(id)
      }
      const updatedBooking = req.body;
      console.log(updatedBooking);
      const upDoc = {
        $set:{
          status:updatedBooking.status
        }
      }
      const result = await bookingCollection.updateOne(query,upDoc)
      res.send(result)
    })












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=> {
    res.send('Car Doctor is Server')
})

app.listen(port,()=>{
    console.log(`Car Doctor Running on ${port}`);
})