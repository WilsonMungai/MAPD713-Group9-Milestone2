//seneca plugin 
var plugin = function(options) 
{
    var seneca = this;
    var getCount = 0;
    var postCount = 0;

    seneca.add({role: 'patient', cmd: 'add' }, function (msg, respond){
        this.make('patient').data$(msg.data).save$(respond);
        getCount = getCount++;
        postCount = postCount++;
        console.log('Request Count --> Get: ${getCount} Post: ${postCount}' );

    });

    seneca.add({role: 'patient', cmd: 'get'}, function (msg, respond){
        this.make('patient').load$(msg.data.patient_id, respond);
        getCount = getCount++;
        console.log('Request Count --> Get: ${getCount} Post: ${postCount}' );
    });

    seneca.add({role: 'patient', cmd: 'get-all'}, function(msg,respond){
        this.make('patient').list$({}, respond);
        getCount = getCount++;
        console.log('Request Count --> Get: ${getCount} Post: ${postCount}' );
    });
}

module.exports = plugin;

//call backs
var seneca = require("seneca")();
seneca.use (plugin);
seneca.use('seneca-entity');

seneca.add('role:patient, cmd: add-patient', function(args, done)
{
    console.log("********** add-patient");

    var patient =
    {
        patientname: args.patientname,
        patientphone: args.patientphone,
        patientaddress: args.patientaddress,
        patientage: args.patientage,
        patientgender: args.patientgender
    }

    console.log("--> patient: " + JSON.stringify(patient));
    seneca.act({ role: 'patient', cmd: 'add', data: patient }, function (err, msg) 
    {
        console.log(msg);
        done(err, msg);
    });

});

seneca.add('role:patient, cmd:get-patient', function (args, done) {
    console.log("--> cmd:get-patient, args.patient_id: " + args.patient_id);
    seneca.act({ role: 'patient', cmd: 'get', data: { patient_id: args.patient_id } }, function (err, msg) 
    {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:patient, cmd:get-all-patients', function (args, done) {
    console.log("--> cmd:get-all-patients");
    seneca.act({ role: 'patient', cmd: 'get-all' }, function (err, msg) 
    {
        console.log(msg);
        done(err, msg);
    });
});

// Initiliazed express 
seneca.act('role:web', {
    use: {
        prefix: '/patientderver',
        pin: { role: 'patient', cmd: '*' },
        map: 
        {
            'add-patient': { GET: true, POST: true},
            'get-patient': { GET: true},
            'get-all-patients': { GET: true},
        
        }
    }
})

//express web server
var express = require('express');
var app = express();
app.use(require("body-parser").json())
app.use(seneca.export('web'));

app.listen(3009)
console.log("Server listening on localhost:3009 ...");
console.log("----- Requests -------------------------");
console.log("http://localhost:3009/patientderver/add-patient?patientname=John&patientphone=41234567891&patientaddress=E1M9T1&patientage=80&patientgender=male");
console.log("http://localhost:3009/patientderver/get-patient?patient_id=g8fdpw");
console.log("http://localhost:3009/patientderver/get-all-patients");