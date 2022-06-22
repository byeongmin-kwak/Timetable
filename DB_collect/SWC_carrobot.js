const config = require('./config')
const mongoose = require("mongoose");
const { range } = require("express/lib/request");
const xlsx = require("xlsx");

const excelFile = xlsx.readFile("./GuideLine/소프트웨어융합학과_미래자동차.로봇 트랙 권장이수.xlsx");
const sheetName = excelFile.SheetNames[0];
const firstSheet = excelFile.Sheets[sheetName];
const jsonData = xlsx.utils.sheet_to_json(firstSheet);

var first_first = [];
var first_second = [];
var second_first = [];
var second_second = [];
var third_first = [];
var third_second = [];
var fourth_first = [];
var fourth_second = [];
var new_list = [];
function jason_to_arry() {
  for (var data in jsonData) {
    first_first.push(jsonData[data]['1학년 1학기']);
    first_second.push(jsonData[data]['1학년 2학기']);
    second_first.push(jsonData[data]['2학년 1학기']);
    second_second.push(jsonData[data]['2학년 2학기']);
    third_first.push(jsonData[data]['3학년 1학기']);
    third_second.push(jsonData[data]['3학년 2학기']);
    fourth_first.push(jsonData[data]['4학년 1학기']);
    fourth_second.push(jsonData[data]['4학년 2학기']);
  }
}
// jason -> array로 변경
function remove_null() {
  first_first = first_first.filter(function (item) {
    return item !== null && item !== undefined && item !== '';
  });
  first_second = first_second.filter(function (item) {
    return item !== null && item !== undefined && item !== '';
  });
  second_first = second_first.filter(function (item) {
    return item !== null && item !== undefined && item !== '';
  });
  second_second = second_second.filter(function (item) {
    return item !== null && item !== undefined && item !== '';
  });
  third_first = third_first.filter(function (item) {
    return item !== null && item !== undefined && item !== '';
  });
  third_second = third_second.filter(function (item) {
    return item !== null && item !== undefined && item !== '';
  });
  fourth_first = fourth_first.filter(function (item) {
    return item !== null && item !== undefined && item !== '';
  });
  fourth_second = fourth_second.filter(function (item) {
    return item !== null && item !== undefined && item !== '';
  });
  new_list.push(first_first);
  new_list.push(first_second)
  new_list.push(second_first)
  new_list.push(second_second);
  new_list.push(third_first)
  new_list.push(third_second);
  new_list.push(fourth_first);
  new_list.push(fourth_second);
}
jason_to_arry()
remove_null()


const connect = mongoose.connect(config.url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB : Succesfully Connected"))
  .catch((err) => console.log(err.message));


var express = require('express');

const { Subinfo } = require('./models/model');
var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://sugang.khu.ac.kr/core?attribute=lectListJson&lang=ko&loginYn=N&menu=1&p_major=A07337&p_year=2022&p_term=10&initYn=Y',
  'headers': {
    'Cookie': 'JSESSIONID=aHGSkYnn7ZmXH5Wgx8So3tatw4J7LyR5g98tqYffSUU7qPhC7FFjOaemFCb8UgU5.amV1c19kb21haW4vV0hfU3VnYW5nMQ==; WMONID=R84FN19dbP4'
  },
  formData: {
    'attribute': 'lectListJson',
    'lang': 'ko',
    'loginYn': 'N',
    'menu': '1',
    'p_major': 'A07308',
    'p_year': '2022',
    'p_term': '10',
    'initYn': 'Y'
  }
};
request(options, async function (error, response) {
  if (error) throw new Error(error);
  var jason = response.body
  var json = JSON.parse(jason)

  const data = {}

  for (var i in json["rows"]) {
    // console.log(json["rows"][i])
  }

  var x = 0, y = 0;
  for (var i = 0; i < new_list.length; i++) {
    var z = '필수';
    if (i % 2 == 0) {
      x++;
    }
    for (var j = 0; j < new_list[i].length; j++) {
        if (new_list[i][j] == '선택') {
            z = '선택';
            continue;
          }
      if (i % 2 == 0) {
        y = 1;
      } else {
        y = 2;
      }
      var subinfo = new Subinfo({
        campus: "국제",
        college: "소프트웨어융합대학",
        department: "소프트웨어융합학과_미래자동차.로봇",
        grade: x + "학년" + y + "학기",
        name: new_list[i][j],
        choice: z,
      })
      subinfo.save((err, result) => {
        if (err) {
          return err;
        } else {
          // console.log(result);
        }
      })
    }
  }
  for (var i in json["rows"]) {
    var obj = {};
    obj['time'] = json["rows"][i]["timetable"];
    obj['prof'] = json["rows"][i]["teach_na"];
    obj['credit'] = json["rows"][i]["unit_num"];
    obj['name'] = json["rows"][i]["subjt_name"];
    await Subinfo.findOne({department: "소프트웨어융합학과_미래자동차.로봇", name:obj['name']}).then((sub)=>{
      if(sub){
        var body={
          prof:obj['prof'],
          time:obj['time']
        }
        sub.credit=obj['credit']
        sub.subject.push(body);
        sub.save((err,result)=>{
          if(err){
            console.log(err)
          }else if(result){
            //console.log(result);
          }
        })
      }
    })
  }
});