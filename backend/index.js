// const cors = require('cors');
// const express = require('express');
// const mongoose = require('mongoose');
// const FormDataModel = require ('./models/FormData');
// require("dotenv").config();

// const app = express();
// app.use(express.json());
// app.use(cors());
// a
//  mongoose.connect("mongodb://localhost:27017/rani");

// app.post('/register', (req, res)=>{
//     // To post / insert data into database

//     const {email, password} = req.body;
//     FormDataModel.findOne({email: email})
//     .then(user => {
//         if(user){
//             res.json("Already registered")
//         }
//         else{
//             FormDataModel.create(req.body)
//             .then(log_reg_form => res.json(log_reg_form))
//             .catch(err => res.json(err))
//         }
//     })
    
// })

// app.post('/login', (req, res)=>{
//     // To find record from the database
//     const {email, password} = req.body;
//     FormDataModel.findOne({email: email})
//     .then(user => {
//         if(user){
//             // If user found then these 2 cases
//             if(user.password === password) {
//                 res.json("Success");
//             }
//             else{
//                 res.json("Wrong password");
//             }
//         }
//         // If user not found then 
//         else{
//             res.json("No records found! ");
//         }
//     })
// })

// const PORT = process.env.PORT
// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });





 const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');
require("dotenv").config();  // ✅ load .env

const app = express();
app.use(express.json());
app.use(cors());

// ✅ use env variable here instead of hardcoding
mongoose.connect(`${process.env.MONGO_URI}/rani`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  FormDataModel.findOne({ email })
    .then(user => {
      if (user) {
        res.json("Already registered");
      } else {
        FormDataModel.create(req.body)
          .then(log_reg_form => res.json(log_reg_form))
          .catch(err => res.json(err));
      }
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  FormDataModel.findOne({ email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("Wrong password");
        }
      } else {
        res.json("No records found! ");
      }
    });
});

app.get('/', (req,res)=> {
    res.send("hello from backend");
})

// ✅ PORT also comes from .env with fallback
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
