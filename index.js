const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
const express = require('express');
const app = express()
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const port = process.env.PORT || 4000;

//midlleware 
app.use(cors());
app.use(express.json());

//==============main part=================



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hduli.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: 'Forbidden access' })
      }
      req.decoded = decoded;
      next();
    });
  }
  
  /* =================== */
/* ======================================================= */
async function run(){
    try{
        await client.connect();
        const partsCollection = client.db('manufracter').collection('parts');
        const reviewsCollection = client.db('manufracter').collection('review');
        const userCollection = client.db('manufracter').collection('users');
        

 
          /* get data */

          app.get('/parts', async (req, res) => {
            const query = {};
            const cursor = partsCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts)
          }); 



          app.get('/user', async (req, res) => {
            const users = await userCollection.find().toArray();  
            res.send(users);
          });
        //   users 

        app.put('/user/admin/:email',verifyJWT, async (req, res) => {  
            const email = req.params.email;
            const requester = req.decoded.email;
            const requesterAccount = await userCollection.findOne({email: email});
            if (requesterAccount.role === 'admin') {
                const filter = { email: email }; 
            const updateDoc = { 
              $set: {role:'admin'},
            };
            const result = await userCollection.updateOne(filter, updateDoc);
           res.send(result);
            }
            else{
                res.status(403).send({message:'forbidden'});
            }
            
          });

          //admin
          app.put('/user/:email', async (req, res) => {  
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email }; 
            const options = { upsert: true };
            const updateDoc = { 
              $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
          const token =jwt.sign({email:email},process.env.ACCECSS_TOKEN_SECRET,{expiresIn: '1h'})
            res.send({result,token});
          });
  
   
          /* add products */
          app.post('/parts',async (req,res)=>{
            const newParts= req.body;
            const result = await partsCollection.insertOne(newParts);
            res.send(result);
    
        })
          
          /* get Review*/

          app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
          });

          //purchase product
          app.get('/purchase/:id',async (req,res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const purchasePart = await partsCollection.findOne(query);
            res.send(purchasePart); 
        });


         /*===================Manage all items(delete)======================*/

    app.delete('/purchase/:id', async (req,res)=>{
        const id = req.params.id;
        const query ={_id: ObjectId(id)};
        const deletePart = await partsCollection.deleteOne(query);
        res.send(deletePart);
    })

    }
    finally{
        
    }

}

run().catch(console.dir);


//==============main part=================



app.get('/',(req,res)=>{
    res.send('Hey i m  running and waiting for you')
})


app.listen(port,()=>{
    console.log('server is running in runnig ',port);
})




// after porcees 

/* 
const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');


//midlleware 
app.use(cors());
app.use(express.json());

//================Connet to Cluster============== 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8c3ja.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{

    }
    finally{
        
    }

}

run().catch(console.dir);


//==============================================


app.get('/',(req,res)=>{
    res.send('john is running and waiting for you')
})


app.listen(port,()=>{
    console.log('john is running in runnig ',port);
})


*/