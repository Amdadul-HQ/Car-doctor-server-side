/**
 * 1. install jwt & import-- const jwt = require("jsonwebtoken") in index.js in back-end
 * 2. jwt.sign(payload,secretToken,{expiresIn: '1h'})
 * 3. send it client side
 */

/***
 * HOW TO CREATE SECRET TOKEN
 * type terminal node
 * type => require('crypto').randomBytes(64).toString('hex')
 */

/**
 * HOW store in client side
 * *** memory => okay type
 * **** local storage => okay type
 * ***** Cookies => http only
 */

/**
 * How to set Cookies
 * set cookies http only
 * set the cookie like this
 * res
      .cookie('token',token,{
        httpOnly:true,
        sameSite:'none',
        secure:false
      })
      .send({success:true})

* cors
* set in tha app.use(cors({origin:['http://localhost:5173'],credentials:true}))
* set this on client side in axios.post('http://localhost:5000/jwt',user,{withCredentials:true})
*
* client side axios setting
 */