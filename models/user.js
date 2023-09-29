//schema for users in blog app 
const { randomBytes,createHmac } = require('crypto');   //package of node , for hashing of password
const {Schema, model} = require('mongoose');
const { createToken } = require("../utils/auth");

const userSchema = new Schema({

    name :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    salt : {
        type : String,
    },
    password : {
        type : String,
        required : true,
    },
    profileUrl : {
        type : String,
        default : '/images/dp.png'
    },
    role :{
        type : String,
        enum : ["USER", "ADMIN"],
        default : "USER"
    }
});

//middleware, creates a hash password for user 
userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashPassword = createHmac('sha256', salt).update(user.password).digest("hex")

    this.salt = salt;   //replace orignal salt 
    this.password = hashPassword;   //set hashed password

    next();
});


userSchema.static("matchPassword", async function (email, password) {

      const user = await this.findOne({ email });
      if (!user) throw new Error("User not found!");
  
      const salt = user.salt;
      const hashedPassword = user.password;
  
      const checkHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
  
      if (hashedPassword !== checkHash)  //check for validate password
        throw new Error("Incorrect Password");
  
      const token = createToken(user);  //create token for user
      return token;
    }
  );


const User = new model('userBlog', userSchema);
module.exports = User