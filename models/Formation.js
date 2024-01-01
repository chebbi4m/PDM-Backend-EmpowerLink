import {Schema, model} from 'mongoose';

const FormationSchema = new Schema(
    {
        title: {
            default: 'title',
            type: String,
        },
        nbPlace: {
            default: 0,
            type: Number,
        },
        nbParticipant: {
            default: 1,
            type: Number,
        },
        views: {
            default: null,
            type: Number,
        },
        description: {
            default: 'description',
            type: String,
        },
        startDate: {
            default: new Date(),
            type: Date,
        },
        endDate: {
            default: new Date(),
            type: Date,
        },
        price: {
          required: true,
          default: 10,
          type: Number,
        },
        meetLink: {
            type: String,
        },
        image: {
            default: 'image',
            type: String,
        },
        participants: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
    },
    {
        timestamps: {currentTime: () => Date.now()},
    }
);

export default model('Formation', FormationSchema);