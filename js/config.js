var CNF_MAPBOX_TOKEN = 'Mapbox key goes here';
var CNF_MAPZEN_KEY = 'Mapzen key goes here';
var CNF_ANALYTIC_KEY = 'Google Analytics key goes here';

var CNF_ADMIN_EMAIL= 'Admin Email Goes goes Here';
var CNF_FEEDBACK_SUBJECT = 'SF Crime Data Feedback';

$(document).ready(function() {
$("#mail_to").html('<a href="mailto:' + CNF_ADMIN_EMAIL +'?subject=' +CNF_FEEDBACK_SUBJECT+'">' + 'Send Feedback' + '<'+'/a>');
});
