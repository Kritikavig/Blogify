//Generic middleware for authentication, check the cookie coming from user 

const { validateToken } = require("../utils/auth");

function checkForAuth(cookie){

    return (req,res,next)=>{

        const userCookie = req.cookies[cookie];
        if(!userCookie){
            return next();
        }

        try {
            const userPayload = validateToken(userCookie);  //validate cookie value
            req.user = userPayload;

        } catch (error) {}

        return next();
    }
}

module.exports = {
    checkForAuth
}