const express = require('express');
const cors = require('cors');
const app = express();

//json web token 
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
app.use(cookieParser())


//mongodb
 const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
 require('dotenv').config()
 const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = 'mongodb+srv://limonroy19cse013:o0A8Z1bqIjmDzdra@cluster0.vttoy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// o0A8Z1bqIjmDzdra


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
    // await client.connect();

    ///create a collection of documents
    const booksCollection = client.db('booksInventory').collection('books');
    const borrowCollection = client.db('booksInventory').collection('borrow');
    const donateCollection =  client.db('booksInventory').collection('donate');
    const usersCollection= client.db("booksInventory").collection("users");
//insert a book post 
 app.post('/api/upload-book',async(req,res)=>{

  const data=req.body;

  //
  const result=await donateCollection.insertOne(data);
  res.send(result);
 })
 //insert a book post 
 app.post('/api/add-book',async(req,res)=>{

  const data=req.body;

  //
  const result=await booksCollection.insertOne(data);
  res.send(result);
 })

 //donation
 app.get("/api/donate", async (req, res) => {
  const cursor =donateCollection.find();
  const result = await cursor.toArray();
  res.send(result);
  });

 ////insert a book post 
 app.post('/api/borrow', async(req,res)=>{
  const newcart = req.body;
 
 const result = await borrowCollection.insertOne(newcart);
 res.send(result);
})

app.get("/api/borrow", async (req, res) => {
const cursor = borrowCollection.find();
const result = await cursor.toArray();
res.send(result);
});

 ///MOREdetail a book

 app.get("/api/more-detail/:id", async (req, res) => {
  const id=req.params.id;
 const query={
  _id : new ObjectId(id)
 }
  const result = await booksCollection.findOne(query) ;
  res.send(result);
});




////query
app.get('/api/all-books',async(req,res)=>{

 let query={};
 if(req.query?.category){
  query={category: req.query.category}
 }
 const result= await booksCollection.find(query).toArray();

  res.send(result);
 })

 

 
 


 ///update a books
// PUT route to update book quantity
app.put("/api/moredetail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { quantity } = req.body;

    // Find the book by ID
    const filter = { _id: new ObjectId(id) };
    const book = await booksCollection.findOne(filter);

    // If book not found, return an error
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Update the quantity
    const updateDoc = {
      $set: {
        quantity: quantity,
      },
    };

    // Save the updated book
    const result = await booksCollection.updateOne(filter, updateDoc);

    // Return a success message
    res.json({ message: "Book quantity updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
    
//delete a book
app.delete("/api/book/:id", async(req,res)=>{

  const id=req.params.id;

const filter ={ _id :new ObjectId(id)};
const result= await booksCollection.deleteOne(filter)
res.send(result);
})


  //signup role of users
  app.post('/api/users', async(req,res)=>{
    const users= req.body;
    console.log(users)

  const result = await usersCollection.insertOne(users);

  res.send(result);
  })


  app.get('/api/users',async(req,res)=>{

    const result=await usersCollection.find().toArray();
    res.send(result);
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



app.get('/',async(req,res)=>{
    res.send('server is running')
})

app.listen(port,()=>{
    console.log(port);
})