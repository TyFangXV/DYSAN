const mongoose = require("mongoose");


const serverRegistrySchema = new mongoose.Schema({

    _id : {
        type : Number,
        required : true
    },
    name : {
        type :  String,
        required : true
    },
    time_zone : {
        type : String, 
        required :  true
    },
    channelId : {
        type : Number,
        required : true
    }
},
{_id: false}
)



module.exports = mongoose.model("serverRegistry", serverRegistrySchema);