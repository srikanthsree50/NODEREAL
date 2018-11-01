
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({

  name  	    : String,
  email 	    : { type: String, unique: true,required:true },
  status      : {type :String,default : ""},
  user_location:{type :String,default : ""},
  events       : [],
  contacts    : [],

  google      : [{
    id:String,
    token:String,
    name:String,
    email:String
  }],

  messages    : [],
  comments    : [],
  profile_pic : String,
  online      : Boolean,
  socket_id   : String,
  fcm_token   : String,
  current_location :{latitude:String,longitude:String}

});
var users = mongoose.model('users',UserSchema);


var MsgSchema = new mongoose.Schema({
  from      :String,
  msg       :String,
  key       :String,
  status    :String,
  from_name :String,
  msg_id    :String,
  to        :String,
  to_name   :String,
  date      :String
});

var msg = mongoose.model('msg',MsgSchema);

var EventSchema = new mongoose.Schema({

  name:String,
  event_description:String,
  starts_date :String,
  created_date:String,
  ends_date :String,
  starts_time:String,
  ends_time:String,
  location:String,
  has_expenses:String,
  public_vs_private:String,
  latlang:{
            'type': {type: String, enum: ["Point"], default: "Point"},
            coordinates: { type: [Number], default: [0,0]}
  },
  date:String,
  created_by:String,
  creator_name:String,
  event_type:String,   //"custom","movie","party","dinner","meetup","coffee"
  members:[{ contact_id: String, name :String, joined_at: String, status: String ,event_id:String}],
  live_members:[{contact_id:String,name:String}],
  images:[{image_id:String,contact_id:String,event_id: String,event_name: String,status: String ,url:String,date:String }],
  expenses:[{
    event_id:String,
    expense_name:String,
    expense_amount:Number,
    expense_bearer_name:String,
    expense_bearer_id:String,
    expense_type:String,
    date:String
  }],
  displayImage:String,
  comments:[],
  comments_count:Number,
  members_count:Number,
  live_members_count:Number,
  images_count:Number,
  expenses_count:Number,
  status : String

});

EventSchema.index({latlang:'2dsphere'},function (err) {
  if(err){console.log(err)}
});

var evnt = mongoose.model('evnt',EventSchema);


var LikeSchema = new mongoose.Schema({
  likeBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  score: Number
});
var like = mongoose.model('like',LikeSchema);


module.exports = {
  users :users,
  msg : msg,
  evnt : evnt,
  like :like
};
