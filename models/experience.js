import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const experienceSchema = new Schema(
    {
        experienceId:{
            type:Number,
            required:true
        },
        communityId:{
            type:Number,
            required:true
        },
        title:{
            type:String,
        },
        creationDate: {
            type: Date
        },
        image: {
            type: String
        },
        text: {
            type: String,
            required: true
        },
        username:{
            type:String,
            required:true
        }

    },
    {
        timestamps: true
    }
)
export default model('Experience', experienceSchema);