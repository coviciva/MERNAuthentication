const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//registracija

router.post("/", async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;

    //validacija

    if (!email || !password || !passwordVerify) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }

    //kratka lozinka

    if (password.length < 6) {
      return res
        .status(400)
        .json({ errorMessage: "Unesite lozinku dulju od 6 znakova." });
    }

    //lozinke nisu iste
    if (password !== passwordVerify) {
      return res.status(400).json({ errorMessage: "Lozinke se ne podudaraju" });
    }

    //user vec postoji
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errorMessage: "Email se vec koristi. Unesite novi." });
    }

    //hashiranje lozinke

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    //console.log(passwordHash);

    //spremanje novog korisnickog racuna u bazu
    const newUser = new User({
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    //potpisivanje tokena

    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    );
    //console.log(token);

    //send the token in a HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//log in

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //validacija

    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }
    //provjera ispravnosti emaila
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      //da napadac ne zna je li pogresan email ili lozinka (necemo rec sta je tocno krivo)
      return res.status(401).json({ errorMessage: "Wrong email or password" });
    }
    //provjera ispravnosti lozinke, usporedba s hash vr
    const passwordCorrect = bcrypt.compare(password, existingUser.passwordHash);
    if (!passwordCorrect) {
      return res.status(401).json({ errorMessage: "Wrong email or password" });
    }

    //potpisivanje tokena

    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );
    //console.log(token);

    //send the token in a HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//log out, izbrise se cookie

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

router.get("/loggedIn", (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.json(false);

    //validacija tokena
    jwt.verify(token, process.env.JWT_SECRET);

    res.send(true);

    next();
  } catch (err) {
    res.status(401).json(false);
  }
});

module.exports = router;
