const JWT = require('jsonwebtoken');
const secret = "Guess@12345"

//to create token, get the user
function createToken(user){

    const payload ={
        _id : user._id,
        email : user.email,
        profileUrl : user.profileUrl,
        role : user.role
    };

    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createToken,
    validateToken
}