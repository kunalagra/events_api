// models/Event.js

import {model, models, Schema} from "mongoose";

const eventSchema = new Schema({
    event_name: String,
    city_name: String,
    date: Date,
    time: String,
    location: {
        type: {
          type: String,
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
});
eventSchema.index({ date: 1 });
eventSchema.index({ location: '2dsphere' });

export const Event = models?.Event || model('Event', eventSchema);