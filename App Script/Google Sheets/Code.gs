var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getActiveSheet();
var lastRow = sheet.getLastRow();
var lastColumn = sheet.getLastColumn();

// Calendar to output requests
var calendar = CalendarApp.getCalendarById('otkbaqcllp0of7ecqdijv3d6sc@group.calendar.google.com');

/////////////////////////
function getEvents() {
 
  var lastDateOfYear = new Date(new Date().getFullYear(), 11, 31); // JavaScript counts months from 0 to 11. January is 0. December is 11.
  var events = calendar.getEvents(new Date(), lastDateOfYear); // new Date() = today
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //add event to sheet
  for(var i = 0; i < events.length; i++) {
    var start = events[i].getStartTime();
    var end = events[i].getEndTime();
    
    spreadSheet.getRange(i+2, 4).setValue(start);
    spreadSheet.getRange(i+2, 4).setNumberFormat("dd/mm/yyyy h:mm:ss");
    spreadSheet.getRange(i+2, 5).setValue(end);
    spreadSheet.getRange(i+2, 5).setNumberFormat("dd/mm/yyyy h:mm:ss");
  }
  initialize();
}
//////////////////////////

// Creates an object from the last form submission
function Submission(row){
  this.timestamp = sheet.getRange(row, 1).getValue();
  this.name = sheet.getRange(row, 2).getValue();
  this.code = sheet.getRange(row, 3).getValue();
  this.email = sheet.getRange(row, 6).getValue();
}

// Check for conflicting events
function getConflicts(request) {
  var conflicts = calendar.getEvents(request.date, request.endTime);
  if (conflicts.length < 1) {
    request.status = "New";
  } else {
    request.status = "Conflict";
    sheet.getRange(lastRow, lastColumn - 1).setValue("Reject");
    sheet.getRange(lastRow, lastColumn).setValue("Sent: Conflict");
  }
}

// Convert data of status and notified columns into array
function StatusObject(){
  this.statusArray = sheet.getRange(1, lastColumn -1, lastRow, 1).getValues();
  this.notifiedArray = sheet.getRange(1, lastColumn, lastRow, 1).getValues();
  this.statusArray = [].concat.apply([], this.statusArray);
  this.notifiedArray = [].concat.apply([], this.notifiedArray);
}

// Get the index of the row that has had a status change
function getChangeIndex(statusChange){
  statusChange.index = statusChange.notifiedArray.indexOf("");
  statusChange.row = statusChange.index + 1;
  if (statusChange.index == -1){
    return;
  } else if (statusChange.statusArray[statusChange.index] != "") {
    statusChange.status = statusChange.statusArray[statusChange.index];
    sheet.getRange(statusChange.row, lastColumn).setValue("Sent: " + statusChange.status);
    statusChange.notifiedArray[statusChange.index] = "update";
  } else {
    statusChange.status = statusChange.statusArray[statusChange.index];
    statusChange.notifiedArray[statusChange.index] = "no update";
  }
}

// Draft contents for emails depending on needed message
function draftEmail(request){
  request.buttonLink = "https://forms.gle/1bN5btKnpty2Syh76"
  request.buttonText = "New Request";
  switch (request.status) {
    case "New":
      request.subject = "Request for " + request.dateString + " Appointment Received";
      request.header = "Request Received";
      request.message = "Once the request has been reviewed you will receive an email updating you on it.";
      break;
    case "New2":
      request.email = "nasroones@gmail.com";
      request.subject = "New Request";
      request.header = "Request Received";
      request.message = "A new request needs to be reviewed.";
      request.buttonLink = "https://docs.google.com/spreadsheets/d/1NZwZAOeOUb79wip1p_ocW9hyJsowQq-F8YB56wQPbNo/edit#gid=425055638";
      request.buttonText = "View Request";
      break;
    case "Approve":
      request.subject = "Confirmation: Appointment for " + request.dateString + " has been scheduled";
      request.header = "Confirmation";
      request.message = "Your appointment has been scheduled.";
      break;
    case "Conflict":
      request.subject = "Conflict with " + request.dateString + " Appointment Request";
      request.header = "Conflict";
      request.message = "There was a scheduling conflict. Please reschedule.";
      request.buttonText = "Reschedule";
      break;
    case "Reject":
      request.subject = "Update on Appointment Requested for " + request.dateString;
      request.header = "Reschedule";
      request.message = "Unfortunately the request times does not work. Could "+
        "we reschedule?";
      request.buttonText = "Reschedule";
      break;
  }
}

// Creates a calendar event using the submitted data
function updateCalendar(request){
  var event = calendar.createEvent(
    request.name,
    request.date,
    request.endTime
    )
}

// Send Email
function sendEmail(request){
  MailApp.sendEmail({
    to: request.email,
    subject: request.subject,
    htmlBody: makeEmail(request)
  })
}

function sendEmailAdmin(request){
  MailApp.sendEmail({
    to: request.email,
    subject: request.subject,
    htmlBody: makeEmailAdmin(request)
  })
}

// --------------------  Main Functions ---------------------
function onFormSubmission(){
  var request = new Submission(lastRow);
  console.log(request)
  /////
  var value = SpreadsheetApp.getActiveSheet().getRange(lastRow, 1).getValue();
  var t = value.getTime().toString(36);
  sheet.getRange(lastRow, 3).setValue(t)
  request.code = t;

//////////////////////////////
var statusChange = new StatusObject();
  getChangeIndex(statusChange);
  var mail = new Submission(statusChange.row);
  mail.email = "nasroones@gmail.com";
  mail.subject = "New Request";
  mail.header = "Request Received";
  mail.message = "A new request needs to be reviewed.";
  mail.buttonLink = "https://docs.google.com/spreadsheets/d/1NZwZAOeOUb79wip1p_ocW9hyJsowQq-F8YB56wQPbNo/edit#gid=425055638";
  mail.buttonText = "View Request";
  console.log(mail)
  sendEmailAdmin(mail);

  // getConflicts(request);
  // draftEmail(request);
  // Logger.log(request.status);
  // sendEmail(request);
  // if (request.status == "New"){
  //   request.status = "New2";
  //   draftEmail(request);
  //   sendEmail(request);
  // }
  // initialize();
}

// Triggered function to check if any status has changed
function onEdit(){
  initialize();
  var statusChange = new StatusObject();
  while (true){
    getChangeIndex(statusChange);
    if (statusChange.index == -1){
      return;
    } else {
      var request = new Submission(statusChange.row);
      if (statusChange.status){
        request.status = statusChange.status;
        if (statusChange.status == "Approve"){
          //updateCalendar(request);
        }
        draftEmail(request);
        sendEmail(request);
      }
    }
  }
}

//----------- RTDB-------------//

function getEnvironment() {
 var environment = {
   spreadsheetID: "1NZwZAOeOUb79wip1p_ocW9hyJsowQq-F8YB56wQPbNo",
   firebaseUrl: "https://authemticationonweb-default-rtdb.firebaseio.com/"
 };
 return environment;
}



// Delete all the existing triggers for the project
function deleteTriggers() {
 var triggers = ScriptApp.getProjectTriggers();
 for (var i = 0; i < triggers.length; i++) {
   ScriptApp.deleteTrigger(triggers[i]);
 }
}

// Initialize
function initialize(e) {
 writeDataToFirebase(getEnvironment().spreadsheetID);
}

// Write the data to the Firebase URL
function writeDataToFirebase(sheetID) {
 var ss = SpreadsheetApp.openById(sheetID);
 SpreadsheetApp.setActiveSpreadsheet(ss);
 //createSpreadsheetEditTrigger(sheetID);
 var sheets = ss.getSheets();
 for (var i = 0; i < sheets.length; i++) {
   importSheet(sheets[i]);
   SpreadsheetApp.setActiveSheet(sheets[i]);
 }
}

// A utility function to generate nested object when
// given a keys in array format
function assign(obj, keyPath, value) {
 lastKeyIndex = keyPath.length - 1;
 for (var i = 0; i < lastKeyIndex; ++i) {
   key = keyPath[i];
   if (!(key in obj)) obj[key] = {};
   obj = obj[key];
 }
 obj[keyPath[lastKeyIndex]] = value;
}

// Import each sheet when there is a change
function importSheet() {
 var sheet = SpreadsheetApp.getActiveSheet();
 var name = sheet.getName();
 var data = sheet.getDataRange().getValues();

 var dataToImport = {};

  for (var i = 1; i < data.length; i++) {
   dataToImport[data[i][0]] = {};
   for (var j = 0; j < data[0].length; j++) {
    assign(dataToImport[data[i][0]], data[0][j].split("__"), data[i][j].toString());
    //assign(dataToImport[data[1][0]], data[0][3].split("__"), sheet.getRange(2, 4).getValue());
    //assign(dataToImport[data[1][0]], data[0][4].split("__"), sheet.getRange(2, 5).getValue());
    //  console.log(data[i][0],data[0][j])
    //  console.log(i,j)
    //console.log(data[i][j].toString())
   }
 }

 var token = ScriptApp.getOAuthToken();

 var firebaseUrl =
   getEnvironment().firebaseUrl + "/" + name;
 var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, token);
 base.setData("", dataToImport);
}

