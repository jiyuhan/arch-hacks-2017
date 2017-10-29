var mysql = require('mysql');
var http = require('http');

var connection = mysql.createConnection({
  host: 'phly.c7jx0v6pormd.us-east-1.rds.amazonaws.com',
  user: 'phly',
  password: 'phlyisthebest',
  port: '3306',
  database : 'phly'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    isDatabaseConnected = true;
    console.log("connected");
});ß


var server = http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type': 'text/plain'});

    userInput = (req.url).split('?')[1];

    //
    if(userInput.split('&')[1]) userInput = userInput.split('&')[0];

    // crawl date from now until the day searched
    analyzeData(userInput, function(err, data) {
        var finalResult = mldata(data);
        res.write("result({\"date\":\"" + finalResult + "\",\"confidence\":" + 0 + "})");
        // res.write("result({\"date\":\"Sat Oct 14 2017 16:12:57 GMT-0500 (CDT)\",\"confidence\":0})");
        res.end();
    });
}).listen(4000);

var analyzeData = function (caseNumber, callback) {
    //TODO: implement the algorithm

    var sql = "SELECT * FROM `" + caseNumber + "`"
    connection.query(sql, function (err, result) {
        if (err)  callback(err, null);

        else callback(null, result);
    });
}
