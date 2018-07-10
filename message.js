var express = require('express');
var app = express();
var fs = require('fs');
var io = require('socket.io')(http);
var exam = require('./socket');
var http = require('http').Server(app);
var ty = require('mongodb');
var MongoClient = ty.MongoClient;
var url = 'mongodb://hawkscode:test123@ds129801.mlab.com:29801/mychat_hawkscode';
var bodyParser = require ('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var session = require('client-sessions');


app.use(session({
        cookieName: 'session',
        secret: 'random_string_goes_here',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
      }));
app.use (bodyParser ());
var server = require ('http').createServer (app);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/images'));
app.engine('.html', require('ejs').__express);

var my_name="hawkscode";
var my_power=9001;

// Login TO DB==================================================================
app.post('/login',urlencodedParser,function(req,res){
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
  var dbo = db.db("mychat_hawkscode");
dbo.collection('customers').findOne({ username: req.body.name}, function(err, user) {
         if(user ===null){
           res.end("Login invalid");
        }else if (user.username === req.body.name && user.password === req.body.pass){


         req.session.user = user._id;
        console.log("req.session.user",req.session.user);
          //res.write();
          res.json(user)
          res.end();
       //res.render({profileData:user});
      } else {
        console.log("Credentials wrong");
        res.end("Login invalid");
      }
});
});
});


// Login TO support==================================================================
app.post('/supportlogin',urlencodedParser,function(req,res){
MongoClient.connect(url,{ useNewUrlParser: true }, function(errt, db) {
  if (errt) throw errt;
  var dbo = db.db("mychat_hawkscode");
dbo.collection('support').findOne({ username: req.body.name}, function(err, user) {
         if(user ===null){
           res.end("Login invalid");
        }else if (user.username === req.body.name && user.password === req.body.pass){


         req.session.admin = user._id;
        console.log("req.session.admin",req.session.admin);
          //res.write();
          res.json(user)
          res.end();
       //res.render({profileData:user});
      } else {
        console.log("Credentials wrong");
        res.end("Login invalid");
      }
});
});
});


app.post('/Change_seen_status',urlencodedParser,function(req,res){
MongoClient.connect(url,{ useNewUrlParser: true }, function(errt, db) {
  if (errt) throw errt;
  var dbo = db.db("mychat_hawkscode");
      var myquery = { conversation_id: new ty.ObjectID(req.body.convo),seen_status:0};
               var newvalues = { $set: { seen_status: 1 } };

                 dbo.collection("conversation_detail").updateMany(myquery, newvalues, function(errhj, yu) {

  res.end();
                });

});
});



// insert messages
app.post('/chat',urlencodedParser,function(req,res){
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
  var dbo = db.db("mychat_hawkscode");
 // var o_id = new ty.ObjectID(req.session.user);
dbo.collection('conversation').findOne({ customer: new ty.ObjectID(req.body.userId)}, function(err, user) {
         if(user ===null){
          console.log("yesdata");
          var newChatConversation = {customer:new ty.ObjectID(req.body.userId),admin:"yes",date:req.body.d};

            dbo.collection("conversation").insertOne(newChatConversation, function(erry, response) {
              if (erry) throw erry;
              console.log(response.ops[0]._id);
                
                if(response.ops[0]._id)
                {
                  var newChatText  = {from_message:new ty.ObjectID(req.body.userId),to_message:"admin",date:req.body.d,text_message:req.body.textm,seen_status:0,conversation_id:response.ops[0]._id};
                  
                  
                    dbo.collection("conversation_detail").insertOne(newChatText, function(errochat, responsenew) {
                        if (errochat) throw errochat;


                        res.end("fgsdjkgh");
                   });
                }
            });
        
      } else 
      {
              var newChatText  = {from_message:new ty.ObjectID(req.body.userId),to_message:"admin",date:req.body.d,text_message:req.body.textm,seen_status:0,conversation_id:user._id,new_message_status:0};
                  
                  
              dbo.collection("conversation_detail").insertOne(newChatText, function(errochat, responsenew) {
                  if (errochat) throw errochat;

               
                  res.end("Entry new");
             });
            
      }
});
});
});
// end


// support insert messages
app.post('/Supportchatinsert',urlencodedParser,function(req,res){
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
  var dbo = db.db("mychat_hawkscode");
 // var o_id = new ty.ObjectID(req.session.user);
dbo.collection('conversation').findOne({ customer: new ty.ObjectID(req.body.userId)}, function(err, user) {
         if(user ===null){
          console.log("yesdata");
          var newChatConversation = {customer:new ty.ObjectID(req.body.userId),admin:"yes",date:req.body.d};

            dbo.collection("conversation").insertOne(newChatConversation, function(erry, response) {
              if (erry) throw erry;
              console.log(response.ops[0]._id);
                
                if(response.ops[0]._id)
                {
                  var newChatText  = {from_message:"admin",to_message:new ty.ObjectID(req.body.userId),date:req.body.d,text_message:req.body.textm,seen_status:0,conversation_id:response.ops[0]._id};
                  
                  
                    dbo.collection("conversation_detail").insertOne(newChatText, function(errochat, responsenew) {
                        if (errochat) throw errochat;


                        res.end("fgsdjkgh");
                   });
                }
            });
        
      } else 
      {
              var newChatText  = {from_message:"admin",to_message:new ty.ObjectID(req.body.userId),date:req.body.d,text_message:req.body.textm,seen_status:0,conversation_id:user._id,new_message_status:0};
                  
                  
              dbo.collection("conversation_detail").insertOne(newChatText, function(errochat, responsenew) {
                  if (errochat) throw errochat;

               
                  res.end("Entry new");
             });
            
      }
});
});
});
// end



app.post('/newMsg', function (req, res){
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        var dbo = db.db("mychat_hawkscode");
        dbo.collection('conversation_detail').find({ to_message:new ty.ObjectID(req.session.user),new_message_status:0 }).toArray(function(errg, chatdata) 
               {
                  console.log("hjg",chatdata.length);

                 //res.end();
               // console.log("hjg",chatdata);
               
                if(chatdata.length>0)
                {
                for(var i=0;i<chatdata.length;i++)
                {
                  //var o_id = new ty.ObjectID(chatdata[i]._id);
                  console.log("chatdata._id",chatdata[i]._id);
                var myquery = { _id: chatdata[i]._id };
               var newvalues = { $set: { new_message_status: 1 } };

                 dbo.collection("conversation_detail").updateOne(myquery, newvalues, function(errhj, yu) {
                  
                  console.log("length",(chatdata.length));
                  if(i==((chatdata.length)))
                  {
                    res.json(chatdata)
                    res.end();
                  }
                  
               });
                   
               }
              }
              else
              {
                console.log("nothing");
                res.end();
              }
              
               });
              

      });
     });
   


app.post('/newMsgSupport', function (req, res){
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        var dbo = db.db("mychat_hawkscode");
        dbo.collection('conversation_detail').find({ to_message:"admin",new_message_status:0 }).toArray(function(errg, chatdata) 
               {
                  console.log("hjg",chatdata.length);
                 var finalArray = [];
                 //res.end();
               // console.log("hjg",chatdata);
               
                if(chatdata.length>0)
                {
                for(var i=0;i<chatdata.length;i++)
                {
                  
                  console.log("chatdata._id",chatdata[i]._id);
                var myquery = { _id: chatdata[i]._id };
               var newvalues = { $set: { new_message_status: 1 } };
                              
                 dbo.collection("conversation_detail").updateOne(myquery, newvalues, function(errhj, yu) {
                  
                  console.log("length",(chatdata.length));
                  if(i==((chatdata.length)))
                  {
                    res.json(chatdata)
                    res.end();
                  }
                  
               });
                  
               }
              }
              else
              {
                console.log("nothing");
                res.end();
              }
              
               });
              

      });
     });

app.get ('/', function (req, res){

    res.render('index.html');
    });

app.get ('/support', function (req, res){

    res.render('support/index.html');
    });

app.get ('/MyChat', function (req, res){
  
  if (req.session && req.session.user) 
       {
         
         var chatarraydfdg = ["fgh"];
        // get data 5b3f5e55b6df6b6612d798da
        MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        var dbo = db.db("mychat_hawkscode");

            var o_id = new ty.ObjectID(req.session.user);
          
        dbo.collection('customers').findOne({ _id:o_id }, function(err, user) 
        {
        
         console.log(user);
             if(user)
             {
              var fecthdata = {$or: [ { from_message:o_id }, { to_message:o_id } ]};
              dbo.collection('conversation_detail').find(fecthdata).toArray(function(errg, chatdata) 
               {
                
               console.log(chatdata);
            res.render('mychat.html',{data:user,chat:chatdata,test:chatarraydfdg}); 
              });
              }
              else
              {
                res.redirect('/'); 
              }
        });
      });
        // end
      } 
      else
      {
       
       res.redirect('/'); 
      }
  console.log("gh",req.session.user);
   
    });

app.get ('/SupportChat/:tagId', function (req, res){
  //req.session.destroy();
  if (req.session && req.session.admin) 
       {
         
         var chatarraydfdg = [];
        // get data 5b3f5e55b6df6b6612d798da
        MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        var dbo = db.db("mychat_hawkscode");

            var o_id = new ty.ObjectID(req.session.admin);
          
        dbo.collection('customers').find().toArray(function(err, user) 
        {
        
         
       // var mysort = { _id: -1 };
              dbo.collection('conversation').aggregate([
    { $lookup:
      {
        from: 'conversation_detail',
        localField: '_id',
        foreignField: 'conversation_id',
        as: 'lastData'
      }
    },
   

  ]).toArray(function(errcon, coversation) 
               {
                console.log("ankita",coversation.length);
                if(coversation.length)
                {
                  
              var newf ="";
                var count = 0;
                 var convob = '';
                
                  function fetchdata()
                {
                   console.log("count",count); 
                      console.log("coversation",coversation[count]._id); 

                       
                        var convob = coversation[count];
                         
                     //  var new_id =   conversation_id:coversation[count]._id ;
                 dbo.collection('conversation_detail').find({seen_status:0,conversation_id:coversation[count]._id,to_message:"admin"}).toArray(function (err23, result23) {
    if (err23) {

      //  next(err);
    } else {
        //console.log("coversation[count]",convob);
 
 var newf = {array:convob,count:result23.length};

          chatarraydfdg.push(newf);
          count=count+1;
        
          if(count<coversation.length)
          {
            

           fetchdata();
          }
          else{
            console.log('data success');
            console.log("chatarraydfdg",chatarraydfdg);
          }

    }
}); 
    

                } 
fetchdata();


                

//return false;
                  if(req.params.tagId==0)
                  {
            var convoData = coversation[0]._id;
            var usePara = coversation[0]._id;
          }
          else
          {
           var convoData = new ty.ObjectID(req.params.tagId);
           var usePara = req.params.tagId;
          }
           var fecthdata = {conversation_id:convoData};
           
              dbo.collection('conversation_detail').aggregate([
    { $lookup:
      {
        from: 'conversation',
        localField: 'conversation_id',
        foreignField: '_id',
        as: 'user'
      }

    },
      { "$match": fecthdata
       } 
  ]).toArray(function(errg, chatdata) 
               {

 
                     

              console.log(chatdata[0].user[0].customer);
                var o_id = new ty.ObjectID(chatdata[0].user[0].customer);
                
                dbo.collection('customers').findOne({ _id:o_id },function(gh, newuser) 
                   {
               
          
            res.render('support/mychat.html',{data:user,chat:chatdata,coversation:chatarraydfdg,userdata:newuser,count:0,convoData:usePara}); 
                   });
                
              });
               }
               else
               {
            res.render('support/mychat.html',{data:user,chat:'',coversation:chatarraydfdg,userdata:newuser,count:'',convoData:''}); 
              

               }
            });
            
        });
      });
        // end
      } 
      else
      {
       
       res.redirect('/support'); 
      }
   
    });

  
var server2 = http.listen(8080, () => {
    console.log("Well done, now I am listening on ", server2.address().port)
})

