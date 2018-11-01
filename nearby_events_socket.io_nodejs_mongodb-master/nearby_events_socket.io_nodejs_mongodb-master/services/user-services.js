
var users = require('../database_models').users;
var mongoose = require('mongoose');

exports.addUser = function(user, res,next) {

  if (user.auth_type == "google") {


    mongoose.model('users').findOne({"google.id":user.id}, function (err, obj) {

      if (obj == null) {

        var display_pic = user.profile_pic;
        if(user.profile_pic == null){
          display_pic = "https://firebasestorage.googleapis.com/v0/b/tripwise-155511.appspot.com/o/profile_pictures%2FDefault%2Fdefault_pic.png?alt=media&token=ac05c0fd-143e-444a-ab74-67df62f5b5df";
        }

        var newUser = new users({
          name: user.name,
          email: user.email,
          evnts: user.evnts,
          contacts: user.contacts,
          google: [{
            id: user.id,
            token: user.token,
            name: user.name,
            email: user.email,
            dp: user.profile_pic,
            auth_code: user.auth_code
          }],
          messages: user.messages,
          comments: user.comments,
          profile_pic: display_pic,
          online: user.online,
          socket_id: user.socket_id
        });


        newUser.save(function (err) {
          if (err) {
            console.log("error :" + err);
            res.end("error" + newUser._id)

          } else {
            console.log("new_userID :" + newUser._id);
            res.end("success" + newUser._id)
          }

        });
      } else {
        console.log("Existing UserId :" + obj._id);
        res.end("success" + obj._id)
      }
    })
  };
}

