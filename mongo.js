var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://abc:xyz.mlab.com:29801/mychat_hawkscode";



  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mychat_hawkscode");
  dbo.collection('conversation').aggregate([
    { $lookup:
      {
        from: 'customers',
        localField: 'customer',
        foreignField: '_id',
        as: 'convodataget'
      }
    }
  ]).toArray(function(err, res) {
    if (err) throw err;
    //console.log(JSON.stringify(res));
    db.close();
  });
});
    

