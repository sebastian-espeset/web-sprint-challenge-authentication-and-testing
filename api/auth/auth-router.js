const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require('../users/users-model')

//isValid middleware
function isValid(user) {
  return Boolean(user.username && user.password);
}
//token maker
const makeToken = ( userObject ) =>{
  const payload = {
    subject:userObject.id,
    username:userObject.username
  }
  const options ={
    expiresIn:"200s"
  }
  return jwt.sign(payload,"secret", options);
}
//middleware for checking username exists in database
const checkUserInDb = async (req,res,next) =>{
  try{
      const rows = await Users.findBy({username:req.body.username})
      if(!rows.length){
          next()
      }else{
          res.status(401).json("username taken")
      }
  }catch(error){
      res.status(500).json(`server error:${error}`)
  }
}
router.post('/register',(req, res) => {
  const credentials = req.body;

  if(isValid(credentials)){
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    credentials.password=bcryptjs.hashSync(credentials.password,rounds)
    Users.add(credentials)
      .then(user=>{
        res.status(201).json(user)
      })
      .catch(error=>{
        res.status(500).json("username taken")
      })
  }else{
    res.status(400).json("username and password required");
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', (req, res) => {
  const {username,password}=req.body;

  if(isValid(req.body)){
    Users.findBy({username:username})
      .then(([user])=>{
        if(user && bcryptjs.compareSync(password,user.password)){
          const token = makeToken(user);
          res.status(200).json({
            message:`welcome ${user.username}`,
            token:token
          })
        }else{
          res.status(401).json(`invalid credentials`)
        }
      })
  }else{
    res.status(400).json(`username and password required`)
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
