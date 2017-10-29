var smoothie = new SmoothieChart();
smoothie.streamTo(document.getElementById("mycanvas"), 1000);

// Data
var line1 = new TimeSeries();
//var line2 = new TimeSeries();

// Add a random value to each line every second
var setData = function(time, data) {
    setInterval(function() {
        line1.append(time, data);
        //line2.append(time, data);
    }, 1000);
}

//First test for the browsers support for WebSockets
if (!window.WebSocket) {
    //If the user's browser does not support WebSockets, give an alert message
    alert("Your browser does not support the WebSocket API!");
} else {
    var socket = new WebSocket("ws://127.0.0.1:8000/");
    socket.onmessage = event => {
        console.log(event.data);
        setData(event.data.split(',')[0], event.data.split(',')[1]);
        socket.send("ready");
    }
}

// Add to SmoothieChart
smoothie.addTimeSeries(line1);
