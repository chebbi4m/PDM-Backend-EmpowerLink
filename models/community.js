import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const communitySchema = new Schema(
    {
        communityId:{
            type:Number,
            required:true
        },
        name:{
            type:String,
            required: true
        },
        creationDate: {
            type: Date
        },
        image: {
            type: String
        },
        objectif: {
            type: String,
            required: true
        },
        category:{
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
export default model('Community', communitySchema);
