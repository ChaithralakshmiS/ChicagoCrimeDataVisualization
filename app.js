var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var lineReader = require('line-reader');
var index = require('./app_server/routes/index');
var app = express();
var ctrlMain = require("./app_server/controllers/main");
//View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session( {secret: "String for encrypting cookies." } ));

//
app.get('/community', ctrlMain.get_community_data);
app.get('/homicide', ctrlMain.get_homicides);
app.get('/comminuty/total', ctrlMain.get_highest_community);
app.get('/monthly', ctrlMain.get_monthly_diff);
app.get('/arrests', ctrlMain.get_arrests);
app.get('/crime', ctrlMain.get_crime_counts);
app.get('/tables', ctrlMain.get_table_data);
app.get('/stack', ctrlMain.get_stack_data);
app.get('/arrest/domestic', ctrlMain.get_arrrest_domestic);

//

app.use('/', index);

module.exports = app;
app.listen(3000);
