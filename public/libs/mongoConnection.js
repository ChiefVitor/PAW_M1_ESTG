var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://cluster0.mu5mp.mongodb.net/myFirstDatabase", 
    { useNewUrlParser: true, 
      useUnifiedTopology: true } 
  )
  .then(() => console.log("Connected to DB!"))
  .catch(() => console.log(" Error connecting to DB!"));

module.exports = mongoose;