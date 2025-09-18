const mongoose=require('mongoose')
const connectDB=async(URL)=>{
    mongoose.connection.on('connected',()=>{
        console.log('database connected')
    })
    return await mongoose.connect(URL)
}
module.exports=connectDB;