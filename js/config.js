var CNF_MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9leWdvbGF3IiwiYSI6ImNqZzZ0bGk2NTM1dDMycW82d2preTI4a3IifQ.VYQSU09wayEKUQqZFVRSQQ';
var CNF_MAPZEN_KEY = 'Mapbox Key Goes Here';
var CNF_ANALYTIC_KEY = 'Google Analytics Key Goes Here';

var CNF_ADMIN_EMAIL= 'Admin Email Goes Here';
var CNF_FEEDBACK_SUBJECT = 'SF Crime Data Feedback';

$(document).ready(function() {
$("#mail_to").html('<a href="mailto:' + CNF_ADMIN_EMAIL +'?subject=' +CNF_FEEDBACK_SUBJECT+'">' + 'Send Feedback' + '<'+'/a>');
});
