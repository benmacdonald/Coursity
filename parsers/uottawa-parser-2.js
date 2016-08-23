


_locationRegex = /\b[A-Z]{3,5}\s[A-Z0-9]{4}\b/;
_courseRegex = /\b[A-Z]{3}[1-9]{1}[0-9]{3}[A-Z]?\b/;
_courseRegexLookAhead = /(?=\b[A-Z]{3}[1-9]{1}[0-9]{3}[A-Z]?\b)/g;
_timeRegexLookAhead = /(?=\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+[0-9]{1,2}:[0-9]{2}\s+to\s+[0-9]{2}:[0-9]{2}\s+[A-Za-z]*\b)/g;
_timeRegex = /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+([0-9]{1,2}:[0-9]{2})\s+to\s+([0-9]{2}:[0-9]{2})\s+([A-Za-z]*)\b/;
_professorRegex = /\b(([A-Za-z.])*\s([A-Za-z.])*)+\b/;
_semesterRegex = /([0-9]{2}\s[A-Z]{1}[a-z]{2,8})\sto\s([0-9]{2}\s[A-Z]{1}[a-z]{2,8})\s([0-9]{4})/; 
_dateRegex = /\b[0-9]{2}\s[A-Z]{1}[a-z]{2,8}\b/g;

function parse(text) {
  var timetable = [];
  // Split lines by course code
  var courses = text.split(_courseRegexLookAhead);
  for (var i = 0; i < courses.length; i++) {
    var courseText = courses[i];
    var semester = _semesterRegex.exec(courseText);
    var course = _courseRegex.exec(courseText);
    if (!course || !semester) continue;
    // Split lines by class sections (find individual times, and we're assuming here that each
    // class section HAS a time...hopefully)
    var classes = courseText.split(_timeRegexLookAhead);
    for (var j = 0; j < classes.length; j++) {
      var professor = _professorRegex.exec(classes[j]);
      var time = _timeRegex.exec(classes[j]);
      var where = _locationRegex.exec(classes[j]);
      if (!professor || !time || !where) continue;
      // Build object for this section and push it to the timetable array
      var obj = {};
      obj['course_code'] = course[0];
      obj['semester_start'] = Date.parse(semester[1] + ' ' + semester[3]);
      obj['semester_end'] = Date.parse(semester[2] + ' ' + semester[3]);
      obj['where'] = where[0];
      obj['day'] = time[1]; 
      obj['start_time'] = time[2];
      obj['end_time'] = time[3];
      obj['class_type'] = time[4];
      timetable.push(obj);
    }
  }
  return timetable;
}

var fs = require('fs')
  , filename = process.argv[2];
  fs.readFile(filename, 'utf8', function(err, data) {
      if (err) throw err;
      console.log(parse(data));
  });
