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