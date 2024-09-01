const bcrypt = require('bcryptjs');
const{Schema, model} = require('mongoose');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/default.png"
    },
    role:{
        type: String,
        enum: ["USER", "Admin"],
        default:"USER"
    }
},{timestamps: true});

userSchema.pre('save',async function(next){

    if(!this.isModified('password')){
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

userSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword,this.password);
    return isMatch;
}

module.exports = model('User',userSchema);