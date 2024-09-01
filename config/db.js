const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        mongoose.connect(process.env.MONGO_URl)
        console.log('Database connected')
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB;