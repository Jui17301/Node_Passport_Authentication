const express = require('express');
const router= require("./routes/index");
const userRouter= require("./routes/users");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const  MongoURI = require('./config/keys');
const flash = require('connect-flash');
const session = require('express-session')
const app = express();
const passport = require('passport')

// passport config
require('./config/passport')(passport);
// DB Config
const db = require('./config/keys').MongoURI;

// connect to mongo
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>{
   console.log("MongoDB is connected")
})
.catch((error)=>{
   console.log(error);
})
// Bodyparser
app.use(express.urlencoded({extended:false}));


// Express session
app.use(session({
   secret:'secret',
   resave :true,
   saveUninitialized:true,

}))
// Passport middileware
app.use(passport.initialize());
app.use(passport.session())

// connect flash
app.use(flash())

// Global Variables:

app.use((req,res,next)=>{
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
})

//routes
app.use('/',router)
app.use('/users',userRouter)
const PORT = process.env.PORT||5000;
// EJS
app.use(expressLayouts);
app.set('view engine','ejs');




app.listen(PORT,()=>{
  console.log(`Server is running at http://localhost:${PORT}`)
})