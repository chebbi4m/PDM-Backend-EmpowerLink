import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(

    {
        username:{
            type:String,
            required:true
        },
        firstname:{
            type:String,
            required:false
        },
        lastname:{
            type:String,
            required:false
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        adress:{
            type:String,
            required:false
        },
        description:{
            type:String,
            required:false
        },
        number:{
            type: Number,
            required: false,

        },
        followers: [],
        following: [],
        birthday:{
            type: Date

        },
        image:{
            type: String,
        },
        role:{
            type:String,
            enum: ['user', 'admin'],
            default: 'admin',

        },
        banned:{
            type: String,
            enum: ['active', 'banned'],
            default: 'active',
           

        },
        banduration:{
            type: String,
            enum: ['', '2 months', '4 months', '6 months', '1 year', 'permanent'],
            default: '',

        },
        reason:{
            type: String,

        },
        verifierd:{
            type: Boolean,
            default: false,

        },
        restcode:{
            type: String,
            required: false,
        },

    },
    {
        timestamps: true
    }
);
export default model('User', userSchema);
