const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 4000;

//midlleware 
app.use(cors());
app.use(express.json());

//==============main part=================



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hduli.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

/* ======================================================= */
async function run(){
    try{
        await client.connect();
        const partsCollection = client.db('manufracter').collection('parts');
        const reviewsCollection = client.db('manufracter').collection('review');
        

 
          /* get data */

          app.get('/parts', async (req, res) => {
            const query = {};
            const cursor = partsCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts)
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