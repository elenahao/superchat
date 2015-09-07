/**
 * Created by elenahao on 15/9/7.
 */

var schedule = require("node-schedule");

var date = new Date(2015,8,7,11,35,0);

var j = schedule.scheduleJob(date, function(){

    console.log("执行任务");

});

j.cancel();

//var rule = new schedule.RecurrenceRule();
//
//rule.minute = 40;
//
//var j = schedule.scheduleJob(rule, function(){
//
//    console.log("执行任务");
//
//});