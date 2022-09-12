const jwt = require('jsonwebtoken');
const express = require('express');
var morgan = require('morgan')

const app = express();
const pool = require("./db").default;

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

const authRouter = require("./routes/auth.routes");
const bookRouter = require("./routes/book.routes");
const rentRouter = require("./routes/rent.routes");
const userRouter = require("./routes/user.routes");

app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(morgan('combined'))

app.listen(process.env.PORT || 3000, ()=>{
  console.log('Server is up!');
})

app.use('/auth', authRouter);
app.use('/books', bookRouter);
app.use('/rents', rentRouter);
app.use('/users', userRouter);

app.get('/something', (req,res)=>{
  res.send({d: 'something'});
})