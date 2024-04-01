const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: String,
    city: String,
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

module.exports = mongoose.models?.Event || mongoose.model('Event', eventSchema);