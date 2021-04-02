var Status;

function onConnectionLost() {
    console.log("connection lost");
    document.getElementById("status").innerHTML = "Connection Lost";
    //document.getElementById("status_messages").innerHTML = "Connection Lost";
    connected_flag = 0;
}

function onFailure(message) {
    console.log("Failed");
    //document.getElementById("status_messages").innerHTML = "Connection Failed- Retrying";
    setTimeout(MQTTconnect, 2000);
}

function onMessageArrived(r_message) {
    document.getElementById("out_messages").innerHTML = "";
    out_msg = r_message.payloadString;
    Status = r_message.payloadString;
    out_msg = out_msg;
    try {
        document.getElementById("out_messages").innerHTML += out_msg;
        if (out_msg == 'OFF') {
            document.getElementById("out_messages").style.color = 'red';
        } else
            document.getElementById("out_messages").style.color = 'green';
    } catch (err) {
        document.getElementById("out_messages").innerHTML = err.message;
    }
}

function onConnected(recon, url) {
    console.log(" in onConnected " + reconn);
}

function onConnect() {
    connected_flag = 1;
    document.getElementById("status").innerHTML = "Connected to " + host;
    console.log("on Connect " + connected_flag);
    //////////
    var stopic = 'tasmota/cmnd/tasmota-1/POWER';
    var sqos = parseInt(0);
    var soptions = {
        qos: sqos,
    };
    mqtt.subscribe(stopic, soptions);
    ///////////

}

function disconnect() {
    if (connected_flag == 1)
        mqtt.disconnect();
}

function MQTTconnect() {
    var clean_sessions = 'true';
    var user_name = 'mymqtt';
    console.log("clean= " + clean_sessions);
    var password = 'myras';

    if (clean_sessions = true)
        clean_sessions = true
    else
        clean_sessions = false

    //document.getElementById("status_messages").innerHTML = "";
    var s = '172.30.81.117';
    var p = '9001';
    if (p != "") {
        port = parseInt(p);
    }
    if (s != "") {
        host = s;
        console.log("host");
    }

    console.log("connecting to " + host + " " + port + "clean session=" + clean_sessions);
    console.log("user " + user_name);
    //document.getElementById("status_messages").innerHTML = 'connecting';
    var x = Math.floor(Math.random() * 10000);
    var cname = "orderform-" + x;
    mqtt = new Paho.MQTT.Client(host, port, cname);
    //document.write("connecting to "+ host);
    var options = {
        timeout: 3,
        cleanSession: clean_sessions,
        onSuccess: onConnect,
        onFailure: onFailure,

    };
    if (user_name != "")
        options.userName = 'mymqtt';
    if (password != "")
        options.password = 'myras';

    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.onConnected = onConnected;

    mqtt.connect(options);
    return false;
}


function send_message(st) {
    if (connected_flag == 0) {
        out_msg = "<b>Not Connected so can't send</b>"
        console.log(out_msg);
        return false;
    }
    var pqos = parseInt(1);
    if (pqos > 2)
        pqos = 0;
    var msg;
    if (st == 'ON') {
        msg = 'OFF';
    } else
        msg = 'ON';
    console.log(msg);
    var topic = 'tasmota/cmnd/tasmota-1/POWER';
    message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    message.qos = pqos;
    message.retained = true;
    mqtt.send(message);
    return false;
}