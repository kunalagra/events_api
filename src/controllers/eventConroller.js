const Event = require('../models/Event');
const axios = require('axios');

const csvToJson = require('convert-csv-to-json');

exports.getEventss = async (req, res) => {
    try {
        const { latitude, longitude, date, page = 1 } = req.query;
        if (!latitude || !longitude || !date) {
            return res.status(400).json({ error: 'Latitude, longitude, and date are required parameters' });
        }
        
        const pageSize = 10
        const skip = (page - 1) * pageSize;
        
        // Filters document in the range and sort by date and location
        let events = await Event.find({
            date: { $gte: new Date(date), $lte: new Date(new Date(date).getTime() + 14 * 24 * 60 * 60 * 1000) },
        })
        .sort({ date: 1 , location: 1 })
        
        const totalEvents = events.length
        events = events.slice(skip, skip + pageSize)
        
        
        // Create and Fetch All Promises together
        const promises = [];
        events.forEach(event => {
            promises.push(axios.get(`https://gg-backend-assignment.azurewebsites.net/api/Weather?code===&city=${event.city}&date=${event.date.toISOString().split('T')[0]}`));
            promises.push(axios.get(`https://gg-backend-assignment.azurewebsites.net/api/Distance?code===&latitude1=${latitude}&longitude1=${longitude}&latitude2=${event.location.coordinates[1]}&longitude2=${event.location.coordinates[0]}`));
        });
        let wdRes;
        try {
            wdRes = await Promise.all(promises);
        } catch (err) {
            console.error('Error fetching weather and distance data:', err);
            return res.status(500).json({ error: 'Error fetching weather and distance data' });
        }
        
        const eventDetails = [];
        for (let i = 0; i < wdRes.length; i += 2) {
            const weatherData = wdRes[i].data.weather;
            const distanceData = wdRes[i + 1].data.distance;
            const eventIndex = i / 2;
            
            eventDetails.push({
                event_name: events[eventIndex].name,
                city_name: events[eventIndex].city,
                date: events[eventIndex].date.toISOString().split('T')[0],
                weather: weatherData,
                distance_km: parseFloat(distanceData),
            });
        }
        
        // Once again sort data by date and distance
        eventDetails.sort((a, b) => {
            const dateComparison = new Date(a.date) - new Date(b.date);
            if (dateComparison !== 0) {
                return dateComparison;
            }
            return a.distance_km - b.distance_km;
        });
        
        const data = {
            events: eventDetails,
            page: parseInt(page),
            pageSize: pageSize,
            totalEvents: totalEvents,
            totalPages: Math.ceil(totalEvents / pageSize)
        }
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error });
    }
};

exports.createEvents = async (req, res) => {
    try{
        let eventsData;
        if (req.is('json')) {
            eventsData = req.body;
        } else if (req.is('multipart/form-data')) {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            // Convert CSV into JSON format
            const csvData = req.file.buffer.toString();
            eventsData = csvToJson.fieldDelimiter(',').csvStringToJson(csvData);            
        } else {
            res.status(400).json({ message: 'Unsupported request type' });
        }
        
        const events = eventsData.map(event => {
            if (!event.event_name || !event.city_name || !event.date || !event.latitude || !event.longitude) {
                throw new Error('Incomplete event data');
            }
            return new Event({
                name: event.event_name,
                city: event.city_name,
                date: new Date(event.date),
                location: {
                    type: 'Point',
                    coordinates: [event.longitude, event.latitude]
                }
            });
        });          
        await Event.insertMany(events)
        res.send({
            message: 'Inserted Events into DB!'
        })
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error });
    }
};