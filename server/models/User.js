import mongoose from "mongoose";
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true,minlength:2,maxlength:60},email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true},passwordHash:{type:String,required:true,select:false}},{timestamps:true}); export default mongoose.model("User",schema);
