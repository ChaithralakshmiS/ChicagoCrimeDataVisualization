var lineReader = require('line-reader');

/**
* Send the contents of an HTML page to the client.
* @param fileName the name of the file containing the HTML page.
* @param result the HTTP result.
*/
function sendPage(fileName, result) {
  var html = '';

  // Read the file one line at a time.
  lineReader.eachLine(fileName,
    /**
    * Append each line to string html.
    * Send the contents of html to the client
    * after the last line has been read.
    * @param line the line read from the file.
    * @param last set to true after the last line.
    */
    function (line, last) {
      html += line + '\n';

      if (last) {
        result.send(html);
        return false;
      }
      else {
        return true;
      }
    });
}

/*
* GET home page.
*/
module.exports.home = function (request, result) {
  //sendPage('index.html', result);
  sendPage('search.html', result);
}

module.exports.search = function (request, result) {

  sendPage('search.html', result);
}

module.exports.details = function (request, result) {
  var zip = request.query.area;
  console.log(zip);
  result.send(zip);

  //sendPage('details.html', result);
}

module.exports.ssl = function (request, result) {
  sendPage('ssl.html', result)
}

module.exports.domestic = function (request, result) {
  sendPage('domestic.html', result)
}

module.exports.safeareas = function (request, result) {
  sendPage('safeareas.html', result)
}

module.exports.twenty_nineteen = function (request, result) {
  sendPage('2019.html', result)
}

/*
* GET Data from MongoDB
*/
module.exports.get_table_data = function (req, res) {
  //var date = req.query.date;
  var date = '[0-9]*\/[0-9]+\/20[1-9]*'
  // var MongoClient = require('mongodb').MongoClient;
  // var url = "mongodb://localhost:27017/";
  var MongoClient = require('mongodb').MongoClient;
  var assert = require('assert');

  var cloud = true;

  var mongodbHost = '127.0.0.1';
  var mongodbPort = '27017';

  var authenticate = '';
  //cloud
  if (cloud) {
    mongodbHost = 'ds155516.mlab.com';
    mongodbPort = '55516';
    authenticate = 'cagna_test:admin123@'
  }

  var mongodbDatabase = 'crime1';

  // connect string for mongodb server running locally, connecting to a database called test
  var url = 'mongodb://' + authenticate + mongodbHost + ':' + mongodbPort + '/' + mongodbDatabase;

  var MongoClient = require('mongodb').MongoClient;
  //	var url = "mongodb://localhost:27017/";
  var obj = {};
  
  var date = '[0-9]*\/[0-9]+\/20[1-9]*';
	  
  var query = { 'Date': { $gte: '04/01/2019', $lte: '04/21/2019' } };
  //var query = { "Date": { '$regex': date } };
  var dict_obj = {};
  var arr = [];

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("crime1");
    var info = dbo.collection("crimeDetails").find(query).toArray(function (err, result) {
      if (err) throw err;
      communityArea = result;
      const keys = Object.keys(communityArea);
      const entries = Object.values(communityArea);

      //console.log(keys);
      //console.log(entries);
      res.render('tables.ejs', { 'entries': entries });
    });
  });
};

/*
* Get the crime stats for a particular community
*/
module.exports.get_community_data = function (req, res) {
  //var date = req.query.date;
  var zip = req.query.area;
  var cloud = true;

  var mongodbHost = '127.0.0.1';
  var mongodbPort = '27017';

  var authenticate = '';
  //cloud
  if (cloud) {
    mongodbHost = 'ds155516.mlab.com';
    mongodbPort = '55516';
    authenticate = 'cagna_test:admin123@'
  }

  var mongodbDatabase = 'crime1';
  var MongoClient = require('mongodb').MongoClient;
  //var url = "mongodb://localhost:27017/";
  var url = 'mongodb://' + authenticate + mongodbHost + ':' + mongodbPort + '/' + mongodbDatabase;
  var ca;
  var my_list = [];

  var date = '[0-9]*\/[0-9]+\/20[1-9]*'
  var MongoClient = require('mongodb').MongoClient;
  //var url = "mongodb://localhost:27017/";

  var obj = {};
  var arr = [];


  MongoClient.connect(url, function (err, db) {

    if (err) throw err;
    var dbo = db.db("crime1");
    dbo.collection("zip_to_communityarea").find({}).toArray(function (err, result) {
      //  console.log('here');
      if (err) throw err;
      communityArea = result['0'];
      // console.log("the returned value is")
      // console.log(communityArea)
      // console.log("the result is")
      // console.log(result)
      // console.log('000000')
      const keys = Object.keys(communityArea);
      const entries = Object.entries(communityArea);
      const values = Object.values(communityArea)
      // console.log(keys)
      // console.log('-----')
      // console.log(values)
      // console.log(values[0])
      // console.log(values[0].length)
      // console.log(entries)
      for (var x = 0; x < entries.length; x++) {
        if (zip == entries[x][0]) {


          //ca = entries[x][1].toString()
          ca = entries[x][1]


        }
      }
      var number_array = []
      for (var x = 0; x < ca.length; x++) {
        number_array.push(Number(ca[x]))

      }

      var str_array = []
      for (var x = 0; x < ca.length; x++) {
        var r = ca[x].toString()
        r = r.replace(/^0+/, '')
        //console.log("the string array is")
        //console.log(r)

        str_array.push(r)


      }
      // console.log("the number array")
      // console.log(number_array)

      if (err) throw err;
      var dbo = db.db("crime1");
      mongodb_data = dbo.collection('crimeDetails');

      dict_obj = mongodb_data.distinct(
        "Primary Type",
        { "Date": { '$regex': date }, "Community Area": { $in: number_array } },
        function (err, docs) {
          if (err) {
            console.log("In err");
            console.log(err);
          }
          if (docs) {
            // console.log('docs')
            // console.log(docs);
            docs.forEach(function (key) {
              obj[key] = 0;

            });
            docs.forEach(function (key) {
              var query = { "Date": { '$regex': date }, "Primary Type": key, "Community Area": { $in: number_array } };
              //console.log(query)

              arr.push(new Promise((resolve, reject) => {
                //return
                dbo.collection("crimeDetails").find(query).count(function (err, count) {
                  obj[key] = obj[key] + count;


                  resolve();
                })
                return (obj);
                //ending

              }));
            });
            Promise.all(arr).then(function (result) {
              res.send({ "obj": obj, "areas":  number_array });
              db.close();
            });
          }

        });
    });

  });
};




//
module.exports.get_homicides = (req, res) => {
  //var date = '4/05/2019';

  var date = req.query.date;
  var date_split = date.split('/')

  var month = date_split[0]
  var year = date_split[2]

  //date =  '04\/[0-9]+\/2019'
  date = '04\/[0-9]+\/2019'
  //console.log(date)
  // var MongoClient = require('mongodb').MongoClient;
  // var url = "mongodb://localhost:27017/";
  var MongoClient = require('mongodb').MongoClient;
  var assert = require('assert');

  var cloud = true;

  var mongodbHost = '127.0.0.1';
  var mongodbPort = '27017';

  var authenticate = '';
  //cloud
  if (cloud) {
    mongodbHost = 'ds155516.mlab.com';
    mongodbPort = '55516';
    authenticate = 'cagna_test:admin123@'
  }

  var mongodbDatabase = 'crime1';

  // connect string for mongodb server running locally, connecting to a database called test
  var url = 'mongodb://' + authenticate + mongodbHost + ':' + mongodbPort + '/' + mongodbDatabase;

  var MongoClient = require('mongodb').MongoClient;
  //	var url = "mongodb://localhost:27017/";
  var dict_obj = {};
  var t_count = [];


  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("crime1");
    mongodb_data = dbo.collection('crimeDetails');
    var query = { "Date": { '$regex': date }, "Primary Type": "HOMICIDE" };



    mongodb_data.find(query).count(function (err, count) {
      if (err) {
        console.log("In err");
        console.log(err);
        res.send({ "error": err });
        //throw err;
      } else {
        //console.log("in the else")
        //console.log(count);
        t_count.push(count);
        res.send(t_count);
        db.close()
      }

    });
    //console.log("outside the function")
    //console.log(t_count)
    //res.send(t_count);
    //db.close();
  });

};



//
module.exports.get_highest_community = function (req, res) {

  var date = req.query.date;
  var date_split = date.split('/')

  var month = date_split[0]
  var year = date_split[2]

  //date = '04' + '\/[0-9]+\/' + year
  date = '04\/[0-9]+\/2019'
  //console.log("in the get_highest_community")
  //console.log(date)

  //var MongoClient = require('mongodb').MongoClient;
  //var url = "mongodb://localhost:27017/";
  var MongoClient = require('mongodb').MongoClient;
  var assert = require('assert');

  var cloud = true;

  var mongodbHost = '127.0.0.1';
  var mongodbPort = '27017';

  var authenticate = '';
  //cloud
  if (cloud) {
    mongodbHost = 'ds155516.mlab.com';
    mongodbPort = '55516';
    authenticate = 'cagna_test:admin123@'
  }

  var mongodbDatabase = 'crime1';

  // connect string for mongodb server running locally, connecting to a database called test
  var url = 'mongodb://' + authenticate + mongodbHost + ':' + mongodbPort + '/' + mongodbDatabase;

  var MongoClient = require('mongodb').MongoClient;
  //	var url = "mongodb://localhost:27017/";

  var obj = {};
  //beginning
  var obj2 = {};
  //ending
  var dict_obj = {};
  var arr = [];
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("crime1");
    mongodb_data = dbo.collection('crimeDetails');
    var query = { "Date": { '$regex': date } };

    dict_obj = mongodb_data.distinct(
      "Community Area",
      //'01/01/2016'
      //{},
      {},
      //{"Date": {'$regex': date}}, // query object
      function (err, docs) {
        if (err) {
          console.log("In err");
          console.log(err);
        }
        if (docs) {
          //console.log("the docs")
          //console.log(docs)
          docs.forEach(function (key) {
            //console.log("the key is")
            //console.log(key)
            obj[key] = 0;
            //console.log(obj)

          });
          docs.forEach(function (key) {
            //console.log("populating the thing")
            var query = { "Date": { '$regex': date }, "Community Area": key };
            arr.push(new Promise((resolve, reject) => {
              //return
              dbo.collection("crimeDetails").find(query).count(function (err, count) {
                obj[key] = count;
                //console.log(obj)
                resolve();
              })
              //beginning

              return (obj);
              //ending

            }));
          });
          Promise.all(arr).then(function (result) {
            //console.log(obj); //
            res.params = obj;
            res.send(obj);
            db.close();
          });
        }

      });
  });


};



module.exports.get_monthly_diff = (req, res) => {
  //var date = '4/05/2019';
  var date = req.query.date;
  //console.log(date)
  // var MongoClient = require('mongodb').MongoClient;
  // var url = "mongodb://localhost:27017/";
  var MongoClient = require('mongodb').MongoClient;
  var assert = require('assert');

  var cloud = true;

  var mongodbHost = '127.0.0.1';
  var mongodbPort = '27017';

  var authenticate = '';
  //cloud
  if (cloud) {
    mongodbHost = 'ds155516.mlab.com';
    mongodbPort = '55516';
    authenticate = 'cagna_test:admin123@'
  }

  var mongodbDatabase = 'crime1';

  // connect string for mongodb server running locally, connecting to a database called test
  var url = 'mongodb://' + authenticate + mongodbHost + ':' + mongodbPort + '/' + mongodbDatabase;

  var MongoClient = require('mongodb').MongoClient;
  //	var url = "mongodb://localhost:27017/";
  var dict_obj = {};
  var t_count = [];


  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("crime1");
    mongodb_data = dbo.collection('crimeDetails');
    var query = { "Date": { '$regex': date } };



    mongodb_data.find(query).count(function (err, count) {
      if (err) {
        console.log("In err");
        console.log(err);
        res.send({ "error": err });
        //throw err;
      } else {
        //console.log("in the else")
        //console.log(count);
        t_count.push(count);
        res.send(t_count);
        db.close()
      }

    });
    //console.log("outside the function")
    //console.log(t_count)
    //res.send(t_count);
    //db.close();
  });

};


module.exports.get_arrests = (req, res) => {
  //var date = '4/05/2019';
  var date = req.query.date;
  //console.log(date)
  // var MongoClient = require('mongodb').MongoClient;
  // var url = "mongodb://localhost:27017/";
  var MongoClient = require('mongodb').MongoClient;
  var assert = require('assert');

  var cloud = true;

  var mongodbHost = '127.0.0.1';
  var mongodbPort = '27017';

  var authenticate = '';
  //cloud
  if (cloud) {
    mongodbHost = 'ds155516.mlab.com';
    mongodbPort = '55516';
    authenticate = 'cagna_test:admin123@'
  }

  var mongodbDatabase = 'crime1';

  // connect string for mongodb server running locally, connecting to a database called test
  var url = 'mongodb://' + authenticate + mongodbHost + ':' + mongodbPort + '/' + mongodbDatabase;

  var MongoClient = require('mongodb').MongoClient;
  //	var url = "mongodb://localhost:27017/";
  var dict_obj = {};
  var t_count = [];


  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("crime1");
    mongodb_data = dbo.collection('crimeDetails');
    var query = { "Date": { '$regex': date }, "Arrest": "true" };



    mongodb_data.find(query).count(function (err, count) {
      if (err) {
        console.log("In err");
        console.log(err);
        res.send({ "error": err });
        //throw err;
      } else {
        //console.log("in the else")
        //console.log(count);
        t_count.push(count);
        res.send(t_count);
        db.close()
      }

    });
    //console.log("outside the function")
    //console.log(t_count)
    //res.send(t_count);
    //db.close();
  });

};


module.exports.get_crime_counts = function (req, res) {


  var date = req.query.date;
  var MongoClient = require('mongodb').MongoClient;
  //var url = "mongodb://localhost:27017/";
  var cloud = true;

  var mongodbHost = '127.0.0.1';
  var mongodbPort = '27017';

  var authenticate = '';
  //cloud
  if (cloud) {
    mongodbHost = 'ds155516.mlab.com';
    mongodbPort = '55516';
    authenticate = 'cagna_test:admin123@'
  }

  var mongodbDatabase = 'crime1';
  var url = 'mongodb://' + authenticate + mongodbHost + ':' + mongodbPort + '/' + mongodbDatabase;
  var obj = {};
  var dict_obj = {};
  var arr = [];
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("crime1");
    mongodb_data = dbo.collection('crimeDetails');
    var query = { "Date": { '$regex': date } };

    dict_obj = mongodb_data.distinct(
      "Primary Type",
      //'01/01/2016'

      { "Date": { '$regex': date } }, // query object
      function (err, docs) {
        if (err) {
          console.log("In err");
          console.log(err);
        }
        if (docs) {
          docs.forEach(function (key) {
            obj[key] = 0;

          });
          docs.forEach(function (key) {
            var query = { "Date": { '$regex': date }, "Primary Type": key };
            arr.push(new Promise((resolve, reject) => {
              //return
              dbo.collection("crimeDetails").find(query).count(function (err, count) {
                obj[key] = count;
                resolve();
              })

              return (obj)

            }));
          });
          Promise.all(arr).then(function (result) {
            //console.log(obj); //
            //beginning
            //res.send({"first": obj, "second": obj2});
            res.send(obj);
            //end
            //console.log('Cookies: ', req.cookies)
            //
            db.close();
          });
        }

      });
  });


};



//
module.exports.get_stack_data = function (req, res) {
  var date = req.query.date;
  console.log(date)
  var MongoClient = require('mongodb').MongoClient;
  //var url = "mongodb://localhost:27017/";
  var cloud = true;

  var mongodbHost = '127.0.0.1';
  var mongodbPort = '27017';

  var authenticate = '';
  //cloud
  if (cloud) {
    mongodbHost = 'ds155516.mlab.com';
    mongodbPort = '55516';
    authenticate = 'cagna_test:admin123@'
  }

  var mongodbDatabase = 'crime1';
  var url = 'mongodb://' + authenticate + mongodbHost + ':' + mongodbPort + '/' + mongodbDatabase;
  var obj = {};
  //beginning
  var obj2 = {};
  var obj3 = {};
  //ending
  var dict_obj = {};
  var arr = [];
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("crime1");
    mongodb_data = dbo.collection('crimeDetails');


    dict_obj = mongodb_data.distinct(
      "Community Area",
      //'01/01/2016'

      { "Date": { '$regex': date } }, // query object
      function (err, docs) {
        if (err) {
          console.log("In err");
          console.log(err);
        }
        if (docs) {
          console.log("in docs")
          console.log(docs)
          docs.forEach(function (key) {
            obj[key] = 0;
            //beginning
            obj2[key] = 0
            obj3[key] = 0
            //ending


          });
          docs.forEach(function (key) {
            var query = { "Date": { '$regex': date }, "Community Area": key };
            arr.push(new Promise((resolve, reject) => {
              //return
              dbo.collection("crimeDetails").find(query).count(function (err, count) {
                obj[key] = count; // total count of crime
                resolve();
              })
              return (obj)

            }));


          });
          //get the 5 most troubled areas
          Promise.all(arr).then(function (result) {
            console.log(obj); //

            console.log("outside")
            console.log(obj)
            var props = Object.keys(obj).map(function (key) {
              return { key: key, value: this[key] };
            }, obj);
            props.sort(function (p1, p2) { return p2.value - p1.value; });
            var topThree = props.slice(0, 5);
            var topThreeObj = props.slice(0, 5).reduce(function (obj, prop) {
              obj[prop.key] = prop.value;
              return obj;
            }, {});
            console.log("top 5")
            console.log(topThreeObj)


            //res.send(obj);
            //


            //res.send(obj);
            //beginning
            res.send({ topThreeObj });
            console.log("sent")
            //end
            //console.log('Cookies: ', req.cookies)
            //
            db.close();
          });
        }

      });
  });


};


module.exports.get_dashboard_data = function (req, res) {
  //console.log(req.body);
  //var date = req.body.datepicker; // for post
  var date = req.query.date;
  //console.log("My varaible date is:");
  //console.log(date);
  //console.log('-------');
  var MongoClient = require('mongodb').MongoClient;
  //var url = "mongodb://localhost:27017/";
  var cloud = true;

  var mongodbHost = '127.0.0.1';
  var mongodbPort = '27017';

  var authenticate = '';
  //cloud
  if (cloud) {
    mongodbHost = 'ds155516.mlab.com';
    mongodbPort = '55516';
    authenticate = 'cagna_test:admin123@'
  }

  var mongodbDatabase = 'crime1';
  var url = 'mongodb://' + authenticate + mongodbHost + ':' + mongodbPort + '/' + mongodbDatabase;
  var obj = {};
  //beginning
  var obj2 = {};
  //ending
  var dict_obj = {};
  var arr = [];
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("crime1");
    mongodb_data = dbo.collection('crimeDetails');
    var query = { "Date": { '$regex': '01/01/2016' } };

    dict_obj = mongodb_data.distinct(
      "Primary Type",
      //'01/01/2016'

      { "Date": { '$regex': date } }, // query object
      function (err, docs) {
        if (err) {
          console.log("In err");
          console.log(err);
        }
        if (docs) {
          docs.forEach(function (key) {
            obj[key] = 0;
            //beginning
            obj2[key] = 0
            //ending

          });
          docs.forEach(function (key) {
            var query = { "Date": { '$regex': date }, "Primary Type": key };
            arr.push(new Promise((resolve, reject) => {
              //return
              dbo.collection("crimeDetails").find(query).count(function (err, count) {
                obj[key] = count;
                resolve();
              })
              //beginning
              var query2 = { "Date": { '$regex': date }, "Primary Type": key, "Arrest": "true" }
              //return
              dbo.collection("crimeDetails").find(query2).count(function (err, count) {
                obj2[key] = count;
                resolve();
              })
              return (obj, obj2);
              //ending

            }));
          });
          Promise.all(arr).then(function (result) {
            //console.log(obj); //

            res.params = obj;
            //res.send(obj);
            //
            res.cookie('bar_chart', JSON.stringify(obj));

            //res.send(obj);
            //beginning
            res.send({ "first": obj, "second": obj2 });
            //end
            //console.log('Cookies: ', req.cookies)
            //
            db.close();
          });
        }

      });
  });


};


//db.crimeDetails.find({"Date": {'$regex': '06/20/2016'}},{"_id":-1,"Latitude":1,"Longitude":1,"Primary Type":1}).count()

module.exports.getLatLng = (req, res) => {
  var dateReq = '06/20/2016';
  var MongoClient = require('mongodb').MongoClient;
  //var url = "mongodb://localhost:27017/";
  var cloud = true;

  var mongodbHost = '127.0.0.1';
  var mongodbPort = '27017';

  var authenticate = '';
  //cloud
  if (cloud) {
    mongodbHost = 'ds155516.mlab.com';
    mongodbPort = '55516';
    authenticate = 'cagna_test:admin123@'
  }

  var mongodbDatabase = 'crime1';
  var url = 'mongodb://' + authenticate + mongodbHost + ':' + mongodbPort + '/' + mongodbDatabase;
  var obj = {};
  //beginning
  var obj2 = {};
  //ending
  var dict_obj = {};
  var latLng = []


  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("crime1");
    mongodb_data = dbo.collection('crimeDetails');
    var query = { "Date": { '$regex': `${dateReq}` } };
    var requiredFields = { "_id": -1, "Latitude": 1, "Longitude": 1, "Primary Type": 1 }


    mongodb_data.find(query, requiredFields).toArray(function (err, docs) {

      if (err) {
        console.log("In err");
        console.log(err);
        res.send({ "error": err });
        //throw err;
      } else {
        for (var j = 0; j < docs.length; ++j) {
          var position = {
            latitude: docs[j]['Latitude'],
            longitude: docs[j]['Longitude'],
            primaryType: docs[j]['Primary Type']
          }
          latLng.push(position)
        }


        res.send({ "coordinates": latLng });
        db.close();
      }


    })


  });

};
module.exports.get_arrrest_domestic = function (req, res) {
  console.log("in get_arrest_domestics")
  var date = req.query.date;
  var dict = req.query.dict;
  console.log("in get_arrest_domestics")
  console.log(date)
  console.log(dict)
  console.log(typeof dict)
  var MongoClient = require('mongodb').MongoClient;
  //var url = "mongodb://localhost:27017/";
  var cloud = true;

  var mongodbHost = '127.0.0.1';
  var mongodbPort = '27017';

  var authenticate = '';
  //cloud
  if (cloud) {
    mongodbHost = 'ds155516.mlab.com';
    mongodbPort = '55516';
    authenticate = 'cagna_test:admin123@'
  }

  var mongodbDatabase = 'crime1';
  var url = 'mongodb://' + authenticate + mongodbHost + ':' + mongodbPort + '/' + mongodbDatabase;
  var obj = {};
  var obj2 = {};
  var dict_obj = {};
  var arr = [];
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("crime1");
    mongodb_data = dbo.collection('crimeDetails');



    if (dict) {
      //   dict.forEach(function(key) {
      //     obj[key] = 0; //arrest
      //     obj2[key] = 0; // domestic
      //
      //   });
      Object.keys(dict).forEach(function (key) {
        console.log("in the for each loop")
        console.log(key)
        obj[key] = 0;
        obj2[key] = 0;

      });
      console.log("obj")
      console.log(obj)
      console.log("obj2")
      console.log(obj2)
      Object.keys(dict).forEach(function (key) {
        var query = { "Date": { '$regex': date }, "Community Area": key, "Arrest": "true" };
        arr.push(new Promise((resolve, reject) => {
          dbo.collection("crimeDetails").find(query).count(function (err, count) {
            obj[key] = count;
            resolve();
          })
          var query2 = { "Date": { '$regex': date }, "Community Area": key, "Domestic": "true" }
          dbo.collection("crimeDetails").find(query2).count(function (err, count) {
            obj2[key] = count;
            resolve();
          })
          return (obj, obj2);

        }));
      });

      Promise.all(arr).then(function (result) {
        console.log("the og dict:")
        console.log(dict)
        console.log(obj)
        console.log(obj2)
        res.send({ "total": dict, "arrest": obj, "domestic": obj2 });
        console.log("sent")

        db.close();
      });
    }

  });
};

//
