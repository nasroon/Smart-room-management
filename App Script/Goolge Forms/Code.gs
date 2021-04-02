function getRoom() {
  var spreadsheetId = '1NZwZAOeOUb79wip1p_ocW9hyJsowQq-F8YB56wQPbNo';
  var rangeName = 'A2:F';
  var values = Sheets.Spreadsheets.Values.get(spreadsheetId, rangeName).values;
  if (!values) {
    Logger.log('No data found.');
  } else {
    for (var row = 0; row < values.length; row++) {
      Logger.log(' - %s',values[values.length-1][1]);
      return values[values.length-1][1];
    }
  }
}

function getEmail() {
  var spreadsheetId = '1NZwZAOeOUb79wip1p_ocW9hyJsowQq-F8YB56wQPbNo';
  var rangeName = 'A2:F';
  var values = Sheets.Spreadsheets.Values.get(spreadsheetId, rangeName).values;
  if (!values) {
    Logger.log('No data found.');
  } else {
    for (var row = 0; row < values.length; row++) {
      Logger.log(' - %s', values[values.length-1][5]);
      return values[values.length-1][5];
    }
  }
}
function test(){
//  getEvents();
//  addEvents();
  var mail = getEmail();
  var room = getRoom();
  if(room == 'R100')
    onEditR100(mail);
//  else if(room == 'R301')
//    onEditR301(mail);
  
}

function onEditR100(mail) {
 var rule = shareCalendar( 'otkbaqcllp0of7ecqdijv3d6sc@group.calendar.google.com',
                          mail,'writer');
};

//function onEditR301(mail) {
// var rule = shareCalendar( '474roep8hehd8i442kef5aqkl8@group.calendar.google.com',
//                          mail,'writer');
//};

function shareCalendar( calId, user, role ) {
  role = role || "reader";

  var acl = null;

  // Check whether there is already a rule for this user
  try {
    var acl = Calendar.Acl.get(calId, "user:"+user);
  }
  catch (e) {
    // no existing acl record for this user - as expected. Carry on.
  }

  if (!acl) {
    // No existing rule - insert one.
    acl = {
      "scope": {
        "type": "user",
        "value": user
      },
      "role": role
    };
    var newRule = Calendar.Acl.insert(acl, calId);
  }
  else {
    // There was a rule for this user - update it.
    acl.role = role;
    newRule = Calendar.Acl.update(acl, calId, acl.id)
  }

  return newRule;
}