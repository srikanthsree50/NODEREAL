var mongoose = require('mongoose');
var FCM = require('fcm-node');
var server_key ="AAAAqXK2D3A:APA91bFC-kpxvLeljA_aXB9Iyngr7LE4NmXEQKuUVOQ7_mZTPm3WqvDoAPO6Ky5uuhbgU5yEVE1KCeLz5kz8KpzecT95ac35hGyKOzFyyMJdP8QZPGTE1xt13MSlpxM7Zvdr1Jo-Si_V";
//var api_key = "AIzaSyCzJJLUZ_KtNkjCziInpAME789QiZlfxa0";
var fcm = new FCM(server_key);

module.exports.controller = function (app,io,schemas) {

  io.on('connection', function (socket) {
    socket.emit("connected");
    console.log("a user just connected")

    socket.on("update_socket_id",function(contact_id){
      schemas.users.update(
        {_id: contact_id},
        {
          '$set': {socket_id: socket.id,online:true}
        }, function (err) {
          if(err){console.log(err)}
        });
      console.log(contact_id + " connected with socket_id "+ socket.id);
    });

    socket.on('disconnect', function () {

      schemas.users.update(
        {socket_id: socket.id},
        {
          '$set': {online:false}
        }, function (err) {
          if(err){console.log(err)}
        });
      console.log("user disconnected with socket_id "+ socket.id);

    });

    socket.on('chat message', function (message) {

      console.log(socket.handshake.session);
      socket.emit('chat message', message);
      new schemas.msg({from: socket.id, msg: message}).save(function (err, data) {
        if (err) throw err;
        console.log('message: ' + message);
      })

    });

    socket.on("update_location",function(contact_id,lat,long){

      schemas.users.update({_id: contact_id},{

        '$set':{
            current_location:{
              latitude:lat,
              longitude:long
          }
        }

      },function (err) {
        if(err){
          console.log("error updating location")
        }
      })
    },function (err) {
      if(err){console.log("error getting location")}
    });

    socket.on('fetch_profile_pic',function (contact_id) {

      schemas.users.findOne({_id:contact_id},function (err,user) {

        if(err){
          console.log(err);
        }
        var pic =  {
                              contact_id:contact_id,
                              profile_pic :user.profile_pic

        };
        socket.emit("profile_pic",pic,function (err) {
          console.log(err)
        });
      });

    });


    socket.on("update_profile_pic",function (contact_id,pic_url) {

        console.log(contact_id,pic_url);
        schemas.users.findOneAndUpdate({_id:contact_id},{$set:{profile_pic:pic_url}},{new:true},function (err,user) {
          if(err){
            console.log(err);
          }else {
            socket.emit("profile_pic_updated");

            console.log(user);
          }
        })

    });

    socket.on("update_event_pic",function (event_id,pic_url) {

      console.log(event_id,pic_url);

      schemas.evnt.findOneAndUpdate({_id:event_id},{$set:{displayImage:pic_url}},{new:true},function (err,user) {
        if(err){
          console.log(err);
        }else {
          socket.emit("event_pic_updated");

          console.log(user);
        }
      })

    });

    socket.on('join',function (event_id,contact_id,name) {

      console.log("Requested for event :" ,event_id);

      var already_joined = false;

      ///XXX - Done ; ( TO DO )
      /// Write Logic here to check whether user already joined event before. if joined simply emit event without
      ///  adding another member to event.

      schemas.evnt.findOne({_id:event_id},function (err,event) {

        var event_name = event.name;
        for(i=0;i<event.members.length;i++){
          if( event.members[i].contact_id == contact_id){
            already_joined = true;
          }
        }

        if(already_joined == true){

          console.log("Member already joined before");
        /*  var object = JSON.parse(JSON.stringify(event));
          socket.emit("new_members",object.members);
          object.comments =  undefined;
          object.members  =  undefined;
          object.images   =  undefined;
          object.live_members = undefined;
          socket.emit("new_event", object);*/




        }else {
          add_user_to_event(event_name)
        }


      });

      function add_user_to_event(event_name) {

        var member = {

          contact_id:   contact_id,
          joined_at:    new Date(),
          status   :    "joined",
          event_id :    event_id,
          name     :    name,
          event_name :  event_name

        };

        schemas.evnt.findOneAndUpdate({_id:event_id},
          {
            '$push': {  members: member},
            '$inc':  {  members_count: 1}

          },{new: true},

          function(err, obj){

            if(err){
              console.log("Something wrong when updating data!");
              socket.emit("status_changed","failed try again",event_id);
            } else {

              var object = JSON.parse(JSON.stringify(obj));
              member["type"]="members";

              socket.emit("new_members",object.members);
              object.comments =  undefined;
              object.members  =  undefined;
              object.images   =  undefined;
              object.live_members = undefined;
              object.status   =  "joined";
              socket.emit("new_event", object);


              socket.emit("status_changed","joined",event_id);

              for (i =0;i< obj.members.length;i++){

                if(obj.members[i].contact_id === contact_id){
                  console.log("equal");

                }else {

                  schemas.users.findOne({_id:obj.members[i].contact_id},function (err,user) {

                    if(user.online ==true){
                      console.log("sending notification to ",user.name ,"at socket_id ",user.socket_id);
                      io.to(user.socket_id).emit("new_member",member);

                    }else{
                      console.log("user is offline");

                      var notification_new_member = {
                        "data":member,
                        to: user.fcm_token,
                        content_available: true,
                        priority:"high"

                      };

                      fcm.send(notification_new_member, function(err, response){
                        if (err) {
                          console.log("Something has gone wrong!");
                        } else {
                          console.log("Sent with message with response: ", response);
                        }
                      });
                    }


                  });
                  console.log("not equal")

                }
              }


              console.log("live members ",obj.live_members);

              for (i =0;i< obj.live_members.length;i++){


                  schemas.users.findOne({_id:obj.live_members[i].contact_id},function (err,user) {
                    console.log("user found" ,user);

                    if(user !=null){

                      if(user.online == true){

                        console.log("sending notification to ",user.name ,"at socket_id ",user.socket_id);
                        io.to(user.socket_id).emit("new_live_member",member);

                      }
                    }else {
                      console.log("live user not found")
                    }

                  });


                }






              schemas.users.findOneAndUpdate({_id:contact_id},
                {
                  '$push':{
                    evnets:event_id.toString()
                  }
                },function (err) {
                  if(err){
                    console.log("failed to add event_id to user")
                  }
                });



            }

          });
      }


    });



 /*   socket.on("decline_event",function (event_id,contact_id) {

      console.log("Requested to decline event invitation :", event_id, contact_id);
      schemas.evnt.update(

        {_id: event_id,"members.contact_id":contact_id},
        {
          '$set': {"members.$.status":"declined"},

        }, function (err) {

          if(err){console.log(err) }else {
            acceptOrDecline("declined",event_id,contact_id)
          }

        })
    });

    socket.on("accept_event",function (event_id,contact_id,name) {

      console.log("Requested to accept event invitation :", event_id, contact_id);
      schemas.evnt.update(

        {_id: event_id,"members.contact_id":contact_id},
        {
          '$set': {"members.$.status":"joined"},

        }, function (err) {
          if(err){console.log(err)} else {
            acceptOrDecline("joined",event_id,contact_id,name)
          }

        })



    });

    function acceptOrDecline(s,id,contact_id,name) {


      var aord_obj = {

        event_id: id,
        status: s,
        contact_id:contact_id,
        type:"status_change",
        name:name

      };

      socket.emit("acceptOrDecline", aord_obj);

      schemas.evnt.findOne({_id:id},function (err,event) {

        aord_obj["event_name"]= event.name;

        if(err){
          console.log(err)
        }

        for (i =0;i< event.members.length;i++){

          //console.log(event.members[i].contact_id ,"-" , contact_id);

          if(event.members[i].contact_id === contact_id){

            console.log("equal");

          }else {

                  schemas.users.findOne({_id:event.members[i].contact_id},function (err,user) {

                    console.log("user found",user);
                    if(user.online == true){

                      console.log("sending notification to ",user.name ,"at socket_id ",user.socket_id);
                      io.to(user.socket_id).emit("acceptOrDecline",aord_obj);

                    }else{

                      var aord_notif = {
                        "data":aord_obj,
                        to: user.fcm_token,
                        content_available: true,
                        priority:"high"
                      };

                      fcm.send(aord_notif, function(err, response){
                        if (err) {
                          console.log("Something has gone wrong!");
                        } else {
                          console.log("trying to send");
                          console.log("Sent with message with response: ", response);
                        }
                      });
                    }

                  });

                  console.log("not equal")
          }
        }

      });

    }
*/

    socket.on("get_user_public_events",function (contact_id,counter) {


      socket.emit("user_public_events",events);

    });

    socket.on("add_live_member",function (objecct) {

      var member = {
        "contact_id":objecct["contact_id"],
        "name":objecct["name"]
      };


      schemas.evnt.findOneAndUpdate({_id: objecct["event_id"] },
        {
          '$push': {
            live_members: member
          },
          '$inc': {live_members_count: 1},

        }, {new: true},

        function (err, obj) {
          if (err) {
            console.log("Something wrong when adding a live member ! - " + err);
          }else {
            console.log("live member added " + objecct)
          }
        });

    });

    socket.on("remove_live_member",function (objecct) {

      var member = {
        "contact_id":objecct["contact_id"],
        "name":objecct["name"]
      };

      schemas.evnt.findOneAndUpdate({_id: objecct["event_id"]},
        {

          '$pull': {
            live_members: member,
          },
          '$inc': {live_members_count: -1},

        },

        function (err, obj) {
          if (err) {
            console.log("Something wrong when removing a live member ! - " + err);
          }else {
            console.log("live member removed")
          }
        });

    });

    function  sendStatusMessage(message) {

      message.status = "sent";

      schemas.users.findOne({_id:message.from},function (err,user) {

        if(err){
          console.log("source - can't find the specific user - sending msg_status");
        }else {

          if(user!=null){
            if (user.online == true) {
              io.to(user.socket_id).emit("msg_status_sent", message);
            }
          }else {
            console.log("source - can't find the specific user - sending msg_status");
          }
        }
      });

    }

    function  sendOpponentMessage(message) {

      schemas.users.findOne({_id: message.to},function (err,user) {

        if(err){
          console.log("can't find the specific user - personal message");
        }else {

          if(user!=null){

            if (user.online == true) {

              console.log("target - user is online");
              io.to(user.socket_id).emit("new_msg", message);

              sendStatusMessage(message);

            } else {

              console.log(" target - user is offline");

              var msg = {
                "data": message,
                to: user.fcm_token,
                content_available: true,
                priority: "high"
              };

              fcm.send(msg, function (err, response) {
                if (err) {

                  console.log(" target - Something has gone wrong!",err);

                } else {
                  console.log(" target - Sent with message with response: ", response);
                  sendStatusMessage(message);

                }
              });


            }
          }else {
            console.log("can't find the specific user - personal message");
          }


        }

      });

    }

    socket.on("update_status_or_location",function(object){

      schemas.users.update({_id: object['contact_id']},{

        '$set':{

          status:object['status'],
          user_location:object['user_location']

        }

      },function (err) {
        if(err){
          console.log("error updating city")
        }else {
          schemas.users.findOne({_id:object['contact_id']},function (err,user) {
            if(err){console.log("can't find user after updating loc or status")}
            else {if(user==null){console.log("user is null after updating loc or status")}
            else {
              var user_profile = {
                'contact_id':user._id,
                'name':user.name,
                'email':user.email,
                'status':user.status,
                'user_location':user.user_location,
                'fcm_token':user.fcm_token
              };
              socket.emit("updated_loc_or_status",user_profile);
              console.log("location or status updated for user - ",user_profile);
            }}
          });

        }
      })
    },function (err) {
      if(err){console.log("error getting city")}
    });

    socket.on("newMessage",function (object) {


      var new_message = new schemas.msg ({

        from      :object["from"],
        key       :object["key"],
        msg       :object["msg"],
        from_name :object["from_name"],
        msg_id    :object["msg_id"],
        to        :object["to"],
        to_name   :object["to_name"],
        status    :object["status"],
        date      :object["date"]

      });

      console.log( new_message);

      sendOpponentMessage(new_message);

      new_message.save(function (err,data) {
        if(err){
          console.log("error saving personal message");
        }else {
          console.log("message saved")
        }
      });


    });

    socket.on('JSON', function (object) {

      /*
         TO DO FOLLOWING FOUR FUNCTIONS - CHECKING FOR NEW ELEMENTS.

       json structure
       {

       type       : "check_for_comments"
       contact_id : "user_id"
       events     : {

                     {'event_id',
                     'date(String)'

                     },

                    }
       }

       fetch new comments if any after the data and emit to particular socket as new_comment. if multiple emit in a loop.
       check below how emitting comment.

       same goes for the rest.

       */

      if(object['type']=="check_for_comments"){

      }


      if(object['type']=="check_for_images"){

      }


      if(object['type']=="check_for_expenses"){

      }


      if(object['type']=="check_for_members"){

      }


      if(object['type']=="check_for_msgs"){

      }





      function emit_expense(object) {

        socket.emit("new_expense",object);
        console.log("expense emitted!")

      }

      function emit_comment(object){

        socket.emit("new_comment",object);  // check here how emitting comment
        console.log("comment emitted!")

      }


      if(object['type'] == "newImage" ){

        console.log(object);


        new_image = {
          type : "images",
          image_id :object['image_id'],
          event_id: object['event_id'],
          url: object['url'],
          date: object['date'],
          contact_id:object['contact_id'],
          status : "loading",
          from_name:object["from_name"]

        };

        schemas.evnt.update(

          {_id: object['event_id']},
          {
            '$push': {images: new_image},
            '$inc': {images_count: 1}
          }, function (err) {

            if(err){console.log(err)}


            schemas.evnt.findOne({_id:object['event_id']},function (err,event) {

              console.log("event",event);

              if(err){
                console.log(err)
              }

              new_image["event_name"] = event.name;

              for (i =0;i< event.members.length;i++){

                console.log(event.members[i].contact_id ,"-" , object["contact_id"]);

                if(event.members[i].contact_id === object["contact_id"]){

                  console.log("equal");

                }else {

                  schemas.users.findOne({_id:event.members[i].contact_id},function (err,user) {

                    console.log("user found" ,user);

                    if(user.online == true){

                      console.log("user is online");
                      console.log("sending notification to ",user.name ,"at socket_id ",user.socket_id);
                      io.to(user.socket_id).emit("new_image", new_image);

                    }else {

                      console.log("user is offline");

                      var message = {
                        "data":new_image,
                        to: user.fcm_token,
                        content_available: true,
                        priority:"high"
                      };

                      fcm.send(message, function(err, response){
                        if (err) {
                          console.log("Something has gone wrong!");
                        } else {
                          console.log("trying to send");
                          console.log("Sent with message with response: ", response);
                        }
                      });


                    }
                  });

                  console.log("not equal")
                }
              }

              for (i =0;i< event.live_members.length;i++){

                console.log(event.live_members[i].contact_id ,"-" , object["contact_id"]);

                if(event.live_members[i].contact_id === object["contact_id"]){

                  console.log("equal");

                }else {

                  schemas.users.findOne({_id:event.live_members[i].contact_id},function (err,user) {

                    console.log("user found" ,user);

                    if(user.online == true){

                      console.log("user is online");
                      console.log("sending notification to ",user.name ,"at socket_id ",user.socket_id);
                      io.to(user.socket_id).emit("new_live_image", new_image);

                    }
                  });

                }
              }

            });

          })

      }

      if (object['type'] == "createEvent") {

        console.log("creating new event ", object);

        var default_imag = "https://firebasestorage.googleapis.com/v0/b/tripwise-155511.appspot.com/o/event_displayPictures%2FDefault%2Fdefault_placeholder.png?alt=media&token=4803a2bf-49fb-4ca3-9241-4e377a8d757d";

          if ( object['event_type'] == "custom"){

           default_imag ="https://firebasestorage.googleapis.com/v0/b/tripwise-155511.appspot.com/o/event_displayPictures%2FDefault%2Fdefault_placeholder.png?alt=media&token=4803a2bf-49fb-4ca3-9241-4e377a8d757d";
          }
          if ( object['event_type']== "movie"){

            default_imag = "https://firebasestorage.googleapis.com/v0/b/tripwise-155511.appspot.com/o/event_displayPictures%2FDefault%2Fmovie_placeholder.jpg?alt=media&token=8ea0fdd1-2c46-4133-9f82-999abfc37abc";
          }
          if ( object['event_type'] == "party"){

            default_imag =  "https://firebasestorage.googleapis.com/v0/b/tripwise-155511.appspot.com/o/event_displayPictures%2FDefault%2Fparty_placeholder.jpg?alt=media&token=e7e31289-c076-4302-9be8-4a215545c591";
          }
          if ( object['event_type'] == "meetup"){

            default_imag =  "https://firebasestorage.googleapis.com/v0/b/tripwise-155511.appspot.com/o/event_displayPictures%2FDefault%2Fmeetup_placeholder.jpg?alt=media&token=b0d82c78-a47f-4ff7-9e71-1e982d9d761c";
          }
          if ( object['event_type'] == "trip"){

            default_imag =  "https://firebasestorage.googleapis.com/v0/b/tripwise-155511.appspot.com/o/event_displayPictures%2FDefault%2Ftravel_placeholder.jpg?alt=media&token=ccb9a1a2-8474-4bc3-9b5f-a9d4a9786568";
          }



        var new_event = new schemas.evnt({

          name:               object['name'],
          displayImage     :  default_imag,
          event_description:  object['event_description'],
          public_vs_private:  object['public_vs_private'],
          created_date:       object['created_date'],
          creator_name:       object['creator_name'],
          created_by:         object['created_by'],
          event_type:         object['event_type'], //"custom","movie","party","dinner","meetup","coffee"
          starts_date:        object["from_date"],
          ends_date  :        object["until_date"],
          starts_time:        object['from_time'],
          ends_time:          object['until_time'],
          location:           object['location'],
          status  :           "joined"

        });

        new_event.save(function (err, data) {

          if (err) {
            throw err;
          } else {

            new_member = {

              contact_id: object['created_by'],
              joined_at: new Date(),
              status: "joined",
              event_id: data._id,
              name: object["user_name"]

            };


            schemas.evnt.findOneAndUpdate({_id: data._id},
              {
                '$push': {
                  members: {
                    contact_id:   object["created_by"],
                    joined_at:    new Date(),
                    status:       "joined",
                    event_id:     data._id,
                    name:         object['user_name']
                  }
                },
                '$inc': {members_count: 1},

                '$set':{

                  latlang:{
                    'type':"Point",
                    coordinates:[object['lang'],object['lat']]
                  }
                }

              }, {new: true},

              function (err, obj) {
                if (err) {
                  console.log("Something wrong when updating data! - " + err);
                }

                socket.emit("new_members", obj.members,function (err) {
                  if(err){console.log(err)}
                });

                obj.comments =    undefined;
                obj.members =     undefined;
                obj.images =      undefined;
                obj.live_members = undefined;
                obj.status =      "joined";

                console.log(obj);

                socket.emit("new_event", obj);


              });

            schemas.users.findOneAndUpdate({_id:object['created_by']},
            {
              '$push':{
                events:data._id.toString()
              }
            },function (err) {
              if(err){
                console.log("failed to add event_id to user")
              }
            });

          }
        });

      }

      if (object['type'] == "comment") {

        console.log(object);

        self_comment = {

          type :"comments",
          from_name: object['from_name'],
          from_id: object['from'], // contact_id
          date: object['date'],
          text: object['text'],
          to  : object['to'], // this is event_id
          event_name:object['event_name'],
          comment_id :object['comment_id'],
          status:"sent"

        };

        new_comment = {

          type :"comments",
          from_name: object['from_name'],
          from_id: object['from'], // contact_id
          date: object['date'],
          text: object['text'],
          to  : object['to'], // this is event_id
          event_name:object['event_name'],
          comment_id :object['comment_id'],
          status :"received"

        };

        schemas.evnt.update(

          {_id: object['to']},
          {
            '$push': {comments: new_comment},
            '$inc': {comments_count: 1}

          }, function (err) {

            if(err){console.log(err)} else {

              schemas.evnt.findOne({_id:object['to']},function (err,event) {

                if(err){
                  console.log(err)
                }else {

                  if(event!=null){

                    for (i =0;i< event.members.length;i++){

                      console.log(event.members[i].contact_id ,"-" , object["from"]);

                      if(event.members[i].contact_id === object["from"]){

                        console.log("equal");

                      }else {

                        schemas.users.findOne({_id:event.members[i].contact_id},function (err,user) {

                          if(err){ console.log(err) }else {
                            console.log("user found" ,user);

                            if(user.online == true){

                              console.log("user is online");
                              console.log("sending notification to ",user.name ,"at socket_id ",user.socket_id);
                              io.to(user.socket_id).emit("new_comment", new_comment);

                            }else {

                              console.log("user is offline");
                              console.log(new_comment)

                              var message = {
                                to: user.fcm_token,
                                content_available: true,
                                priority:"high",
                                "data":new_comment
                                // "data": {
                                //   type :"comment",
                                //   text: object['text'],
                                //   from_name: object['from_name'],
                                //   event_name:object['event_name'],
                                //   time: new Date(),
                                //   comment_id :object['comment_id'],
                                //   to: object['to'],
                                //   from_id:object['from']
                                //
                                // }
                              };

                              fcm.send(message, function(err, response){
                                if (err) {
                                  console.log("Something has gone wrong!");
                                  console.log(err,response)
                                } else {
                                  console.log("trying to send");
                                  console.log("Sent with message with response: ", response);
                                }
                              });
                            }
                          }



                        });

                        console.log("not equal")
                      }
                    }

                    for (i =0;i< event.live_members.length;i++){

                      if(event.live_members[i].contact_id === object["from"]){

                        console.log("equal");

                      }else {

                        schemas.users.findOne({_id:event.live_members[i].contact_id},function (err,user) {

                          if(user!=null){

                            if(user.online == true ){

                              console.log("user is online");
                              console.log("sending live notification to ",user.name ,"at socket_id ",user.socket_id);
                              io.to(user.socket_id).emit("new_live_comment", new_comment);

                            }

                          }

                        });

                        console.log("not equal")
                      }
                    }


                  }

                }

              });

            }

          })
      }

      if (object['type'] == "addExpense") {

        console.log(object);

        new_expense = {
          type :"expenses",
          expense_name: object['expense_name'],
          expense_amount:object["expense_amount"],
          expense_bearer_id: object['expense_bearer_id'], // contact_id
          date: object["date"],
          expense_bearer_name: object['expense_bearer_name'],
          event_id : object['event_id'], // this is event_id
          expense_type: object["expense_type"],
          expense_id:object["expense_id"]

        };

        schemas.evnt.update(

          {_id: object['event_id']},
          {
            '$push': {expenses: new_expense},
            '$inc': {expenses_count: 1}
          }, function (err) {
            if(err){console.log(err)} else{

            }

            emit_expense(new_expense);

            schemas.evnt.findOne({_id:object['event_id']},function (err,event) {

              console.log("event",event);

              if(err){
                console.log(err)
              } else{

              }

              new_expense['event_name'] = event.name;

              for (i =0;i< event.members.length;i++){

                console.log(event.members[i].contact_id ,"-" , object["expense_bearer_id"]);

                if(event.members[i].contact_id === object["expense_bearer_id"]){

                  console.log("equal");

                }else {

                  schemas.users.findOne({_id:event.members[i].contact_id},function (err,user) {

                    console.log("user found" ,user);

                    if(user.online == true){

                      console.log("user is online");
                      console.log("sending notification to ",user.name ,"at socket_id ",user.socket_id);
                      io.to(user.socket_id).emit("new_expense", new_expense);

                    }else {

                      console.log("user is offline");

                      var message = {
                        to: user.fcm_token,
                        content_available: true,
                        priority:"high",
                        "data":new_expense
                      };

                      fcm.send(message, function(err, response){
                        if (err) {
                          console.log("Something has gone wrong!");
                        } else {
                          console.log("trying to send");
                          console.log("Sent with message with response: ", response);
                        }
                      });
                    }
                  });

                  console.log("not equal")
                }
              }

            });

          })
      }



    }, function (err) {
      console.log(err)
    });


  });
}
