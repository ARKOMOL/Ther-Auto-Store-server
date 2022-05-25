const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const express = require('express');
const app = express()
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 4000;

//midlleware 
app.use(cors());
app.use(express.json());

//==============main part=================



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hduli.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
   console.log('avc');
   const authHeader = req.headers.authorization;
   if (!authHeader) {
     return res.status(401).send({message: 'UnAuthorized Access'})
   }
  }
  
  /* =================== */
/* ======================================================= */
async function run(){
    try{
        await client.connect();
        const partsCollection = client.db('manufracter').collection('parts');
        const reviewsCollection = client.db('manufracter').collection('review');
        const userCollection = client.db('manufracter').collection('users');
        const orderCollection = client.db('manufracter').collection('orders');
        

 
          /* get data */

          app.get('/parts',async (req, res) => {
            const query = {};
           
            const cursor = partsCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts)
          }); 



          app.get('/user',async (req, res) => {
            const users = await userCollection.find().toArray();  
            res.send(users);
          });
        //   admin 

        app.put('/user/admin/:email', async (req, res) => {  
            const email = req.params.email;
            // console.log(email);
            const requester = req.decoded.email;
            console.log(requester);
            const requesterAccount = await userCollection.findOne({email: requester})
            if (requesterAccount.role === 'admin') {
              const filter = { email: email }; 
            const updateDoc = { 
              $set: {role:'admin'}, 
            };
            const result = await userCollection.updateOne(filter, updateDoc);
           res.send(result);
            }
            else{
              res.status(403).send({ message: 'Forbidden ' })
            }
           
            });
                


        /*   // admin role 
          app.get('/admin/:email', async (req, res) => {  
            const email = req.params.email;
            const user = await userCollection.findOne({email: email});
            const isAdmin = user.role === 'admin';
            res.send({admin: isAdmin})
          }) */

          //user
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
              // orders placed
              app.post('/order',async(req,res)=>{
                const orders = req.body;

                const result = await orderCollection.insertOne(orders);
                res.send(result)
              })

              // get order to user 
              app.get('/order',async(req,res)=>{
                const orderEmail = req.query.userEmail;
                const query = {order: orderEmail};
                const orderlist = await orderCollection.find(query).toArray();
                res.send(orderlist) 


              })
                               


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
