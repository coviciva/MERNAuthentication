const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); //ucitava varijable iz .env u process.env
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config(); //cita .env datoteku

//set up server

const app = express();
const PORT = process.env.PORT || 5000; //prvo za heroku, drugo lokalno
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

app.use(express.json()); //za prepoznavanje dolaznog zahtjeva
//ako postoje cookieji parsirat ce ih u request.cookies
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
//app.get("/test", (req, res) => {
//  res.send("Radi!");
//});

//connect to mongoDB

mongoose.connect(
  process.env.MDB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Spojeno na MongoDB!");
  }
);

//set up routes

app.use("/auth", require("./routers/userRouter"));
app.use("/customer", require("./routers/customerRouter"));
