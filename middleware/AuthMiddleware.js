
const jwt = require('jsonwebtoken');
module.exports=(req,res,next)=>{
    let Token = req.headers['token'];
    jwt.verify(Token,'SecretKey1234567890',(error,decode)=>{
        if (error) {
            // console.log(Token);
            res.status(401).json({status:"unauthorized"});
        } else {
            let email = decode['data'];
            // console.log(email)
            req.headers.email = email;
            next();
        }
    })
}