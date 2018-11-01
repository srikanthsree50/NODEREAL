var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var schemas = require('./../database_models');
Account=schemas.users;
var passport = require('passport');
require('../config/passport')(router,passport);
var request = require('request').defaults({encoding:null});

var userService = require('../services/user-services');

/* GET home page. */
// router.get("/", function (req, res) {
//     res.sendFile(global.appRoot+'/views/chat/client.html')
// })

router.post("/sign_up", function (req,res) {
  userService.addUser(req.body,res,function (err) {
    if(err){
      res.end(err.toString());
    }
  });
});


router.get("/join/:event_id",function (req,res) {
  console.log(req.params.event_id);
});

router.get("/names",function (req,res) {
  schemas.users.find({'google.email':{$regex:".*"}},{'google.$':1,_id:0},function(err,result){
    if(err){}else{res.send(result);}
  })
});


router.post("/update_fcm_token", function (req,res,next) {
  var object = req.body;
  console.log(object)
  console.log(object.fcm_token);
  console.log(object.contact_id);
  schemas.users.update(
    {_id: object.contact_id },
    {
      '$set': {fcm_token: object.fcm_token}
    }, function (err,response) {
      if(err){
        console.log("FCM UPDATE ERROR :"+err);
        res.end(err.toString())
      }else {
        res.end("success")
      }
    });
  console.log(object.contact_id + " updated with fcm_token "+ object.fcm_token);
});

router.get("/profile_pic/:id",function (req,res) {
  mongoose.model('users').findOne({_id:req.params.id},function (err,obj) {
    if(obj!=null){
      console.log(obj.profile_pic);
      request.get(obj.profile_pic,function (err,response,body) {
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(body);
      });

    }
  })
});

router.get("/getUserLocationAndStatus/:id",function (req,res) {
  mongoose.model('users').findOne({_id:req.params.id},function (err,obj) {
    if(obj!=null){
      console.log(obj.user_location + "  " + obj.status);

      var result = {
        "user_location":obj.user_location,
        "status":obj.status
      };
      res.send(result);
      res.end();
    }
  });
});


router.get("/event_displayPictures/:event_id",function (req,res) {

  console.log("fetching dp of " + req.params.event_id);
  mongoose.model('evnt').findOne({_id:req.params.event_id},function (err,obj) {

    if(obj!=null){
      console.log(obj.displayImage);

      request.get(obj.displayImage,function (err,response,body) {
        console.log(body);
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(body);

      });

    }
  })
});

router.get("/users", function (req, res) {
  mongoose.model('users').find(function (err, users) {
    if (err)throw err;
    res.send(users)
  })
});

router.get("/event/:event_id", function (req, res) {
  mongoose.model('evnt').find({_id:req.params.event_id},function (err, event) {
    if (err) res.send (err);
    else res.send(event)
  })
});




router.get("/events", function (req, res) {
  mongoose.model('evnt').find(function (err, events) {
    if (err) res.send(err);
    var output = "";
    for (var i = 0; i < events.length; i++) {
      output += events[i].toString() + "</br></br></br>"
    }
    res.send(output)

  })
});

router.get("/users/:email",function (req,res) {
  console.log(req.params.email);
  mongoose.model('users').findOne({email:req.params.email},function(err,obj) {
    if(obj==null){
      res.end("not found")
    }else {
      res.end(obj._id.toString())
    }

  })

});
router.get("/messages", function (req, res) {
  mongoose.model('msg').find(function (err, msgs) {

    if (err)throw err;
    else  res.end(msgs);

  })

});



router.get("/object_id", function (req, res) {
  res.writeHead(200);
  res.end(new mongoose.Types.ObjectId().toString());
})

router.get("/remove_all_events", function (req, res) {
  schemas.evnt.remove({},function (req,res) {
  });
  res.writeHead(200);
  res.end("all events removed!")
  // res.send('DELETE request to homepage');

})


router.get("/remove_all_users", function (req, res) {
  schemas.users.remove({},function (req,res) {
  });
  res.writeHead(200);
  res.end("all users removed!")
  // res.send('DELETE request to homepage');

})

router.get("/error", function (req, res) {

  res.writeHead(400);
  res.end("error")
  // res.send('DELETE request to homepage');

});

router.get("/remove_user_events/:contact_id",function (req,res) {
  mongoose.model("users").update({_id:req.params.contact_id},{'$set':{events:[]}},function (err,obj) {
    if(err){res.send("user not found")}else {
      res.send("removed");
      res.end();
    }
  })
});




router.get("/AroundYou/:contact_id/:counter", function (req, res) {

  mongoose.model('users').findOne({_id:req.params.contact_id},function (err,obj) {

    if(err){
      res.end("none");
    } else{

      if(obj!=null){

            console.log(obj.current_location);

            mongoose.model('evnt').find(
              {

                latlang: {  '$near':
                                    {
                                      '$geometry': {  type:'Point',coordinates:[  obj.current_location.longitude , obj.current_location.latitude ]  },
                                      'spherical':true
                                    }
                          },

                public_vs_private:"public"


              }).skip((req.params.counter-1)*5).limit(5).exec(function(err,NearbyEvents) {

                  if(err){
                    console.log("error :" + err );
                    res.end("none");
                  }else {
                    for(i=0;i<NearbyEvents.length;i++){

                      NearbyEvents[i].status = "join";

                      for (j=0;j<NearbyEvents[i].members.length;j++){
                        if(NearbyEvents[i].members[j].contact_id === req.params.contact_id){
                          NearbyEvents[i].status = "joined";
                        }
                      }

                      NearbyEvents[i].comments = undefined;
                      NearbyEvents[i].images = undefined;
                      NearbyEvents[i].members = undefined;
                      NearbyEvents[i].live_members = undefined;
                      NearbyEvents[i].comments_count=undefined;
                      NearbyEvents[i].live_members_count=undefined;
                      NearbyEvents[i].images_count=undefined;
                      NearbyEvents[i].expenses_count=undefined



                    }
                    console.log("Sending ",NearbyEvents);
                    res.send(NearbyEvents);
                    res.end();
                  }
                }
              )

      }else{
        res.end("none");
        console.log("user does not exist for contact_id :" + req.params.contact_id);
      }

    }

  });

});

router.get("/UserEvents/:contact_id/:counter", function (req, res) {

  mongoose.model('users').findOne({_id: req.params.contact_id}, function (err, obj) {

    counter = req.params.counter;

    if (err) {
      res.end("none");
    } else {

      if (obj != null) {

        console.log(obj.events.slice(counter * 10 - 5, counter * 10));

        mongoose.model('evnt').find(

          {
            public_vs_private: "public",
            _id: obj.events.slice(counter * 10 - 10, counter * 10)
          },

          function (err, Events) {

            if (err) {

              console.log("error finding events for user_id",err);
              res.end();

            } else {
              console.log("Sending ", Events);

              for(i=0;i<Events.length;i++){
                Events[i].comments = undefined;
                Events[i].images = undefined;
                Events[i].members = undefined;
                Events[i].live_members = undefined;
                Events[i].comments_count=undefined;
                Events[i].live_members_count=undefined;
                Events[i].images_count=undefined;
                Events[i].expenses_count=undefined
              }

              res.send(Events);
              res.end();

            }

          });


      } else {
        res.end("none");
        console.log("user does not exist for contact_id :" + req.params.contact_id);
      }

    }

  });

});

router.get("/getEvent/:event_id/:contact_id", function (req, res) {

  mongoose.model('evnt').findOne({_id:req.params.event_id},function (err,obj) {

    if (err) {
      res.end("none");
      console.log("error finding event",req.params.event_id)
    }else{

      obj.status = "join";
      for(i=0;i<obj.members.length;i++){
        if(obj.members[i].contact_id === req.params.contact_id){
          obj.status = "joined"
        }
      }

      obj.live_members = undefined;
      obj.members= undefined;
      obj.images = undefined;
      obj.comments = undefined;

      res.send(obj);
      res.end();
    }

  });
});

router.get("/members/:event_id/:counter", function (req, res) {

  mongoose.model('evnt').findOne({_id:req.params.event_id},function (err,obj) {

    if (err) {
      res.end("none");
      console.log("error finding members for event",req.params.event_id)
    }else{
      res.send(obj.members.slice(req.params.counter*10,(req.params.counter*10)+10));
      res.end();
    }



  });
});

router.get("/comments/:event_id/:counter", function (req, res) {

  mongoose.model('evnt').findOne({_id:req.params.event_id},function (err,obj) {

    if (err) {
      console.log("No comments for event ",req.params.event_id)
      res.end("none")
    }else{
      res.send(obj.comments.reverse().slice(req.params.counter*20,(req.params.counter*20)+20));
      res.end();

    }

  });
});


router.get("/images/:event_id/:counter", function (req, res) {

  mongoose.model('evnt').findOne({_id:req.params.event_id},function (err,obj) {

    if (err) {
      console.log("No images for event ", req.params.event_id )
      res.end("none")
    } else{
      //res.send(obj.images)
      res.send(obj.images.reverse().slice(req.params.counter*6,(req.params.counter*6)+6));
      res.end();

    }

  });
});




//// user registration



// route for home page


// route for login form
// route for processing the login form
// route for signup form
// route for processing the signup form

// route for showing the profile page

// route for logging out
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// facebook routes
// twitter routes

// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect : '/api/error'
  }),
  function(req, res) {
    res.json(req.user);
  }

);



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}




module.exports = router;

