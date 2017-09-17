const mongoose = require('mongoose');



const TradeRequestSchema = new mongoose.Schema({
  requester: {
      type: String,
      required: true
  },
  recipient: {
      type: String,
      required: true
  },
  book:{
      type: String,
      required: true
    }
  });



module.exports = mongoose.model('Trade', TradeRequestSchema);
