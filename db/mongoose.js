const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGODB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   // keepAlive: true,
//   useCreateIndex: true
//   // rejectUnauthorized:false
//   //keepAliveInitialDelay: 1000000,
//   //serverSelectionTimeoutMS: 500000,
//   //connectTimeoutMS: 1000000,
// });



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Server connected to MongoDb!');
    } catch (err) {
        console.error(err);
    }
};
connectDB();

module.exports = connectDB;

