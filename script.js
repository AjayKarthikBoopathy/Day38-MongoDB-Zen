// Day38-Zen

// Design database for Zen class programme
// collections - users, codekata, attendance, topics, tasks, company_drives, mentors

// Find all the topics and tasks which are thought in the month of October:-
db.batch_details.find( { "topics_covered.orderDate": { $gte: ISODate("2023-10-01T10:03:46.000Z"), 
$lte: ISODate("2023-10-30T10:03:46.000Z") } } ).forEach(function(data){console.log(data.batch, data.topics_covered)})


// Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020:-
db.new_companies.find( { "orderDate": { $gte: ISODate("2023-10-15T10:03:46.000Z"), 
$lte: ISODate("2023-10-30T10:03:46.000Z") } } ).forEach(function(data){console.log(data.company_name)})


// Find all the company drives and students who are appeared for the placement:-
db.students.aggregate([
  {
    '$unwind': {    //splits array into each single document
      'path': '$interviews'
    }
  }, {
    '$lookup': {
      'from': 'new_companies', 
      'localField': 'interviews', 
      'foreignField': 'company_name', 
      'as': 'result'
    }
  }, {
    '$project': {   //target specification
      'name': 1, 
      'interviews': {
        '$map': {
          'input': '$result', 
          'as': 'interview', 
          'in': {
            'company_name': '$$interview.company_name'
          }
        }
      }
    }
  }
]).forEach(function(data){console.log(`Name: ${data.name} Company: ${data.interviews[0].company_name}`)})


// Find the number of problems solved by the user in codekata:-
db.students.find({}).forEach(function(data){console.log(`User:- ${data.name}  Codekata:- ${data.codekata}`)})


// Find all the mentors with who has the mentee's count more than 15:-
db.batch_details.aggregate([
  {
    '$unwind': {    
      'path': '$batch'
    }
  }, {
    '$lookup': {
      'from': 'students', 
      'localField': 'batch', 
      'foreignField': 'batch', 
      'as': 'result'
    }
  }, {
    '$project': {   
      'name': 1, 
      'batch': {
        '$map': {
          'input': '$result', 
          'as': 'student', 
          'in': {
            'name': '$$student.name',
            'batch': '$$student.batch'
          }
        }
      }
    }
  }
]).forEach(function(data)
{
  if (data.batch[0].name.length > 3) {    //more than 3 students
    console.log(data.name)
  }
}
)


// Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020:-
db.students.aggregate([
  {
    '$unwind': {    
      'path': '$batch'
    }
  }, {
    '$lookup': {
      'from': 'batch_details', 
      'localField': 'batch', 
      'foreignField': 'batch', 
      'as': 'result'
    }
  }, {
    '$project': {   
      'name': 1, 
      'topics_attended': 1,
      'batch': {
        '$map': {
          'input': '$result', 
          'as': 'student', 
          'in': {
            'covered_topics': '$$student.topics_covered.topic_name'
            
          }
        }
      }
    }
  }
]).forEach(function(data)
{
  if (data.batch[0].covered_topics.length != data.topics_attended.length) {
    console.log(data.name)
  }
}
)


// Data
// inserting companies
db.new_companies.insertMany([
  {
      "company_name": "Amazon",
      orderDate: new ISODate("2023-10-17T14:10:30Z")
  },
  {
      "company_name": "Google",
      orderDate: new ISODate("2023-11-10T14:10:30Z")
  },
  {
      "company_name": "Zoho",
      orderDate: new ISODate("2023-10-25T14:10:30Z")
  },
  {
      "company_name": "Wipro",
      orderDate: new ISODate("2023-10-28T14:10:30Z")
  },
  {
      "company_name": "TCS",
      orderDate: new ISODate("2023-10-14T14:10:30Z")
  }
])

db.new_companies.find( { orderDate: { $gt: ISODate("2023-10-27T10:03:46.000Z") } } )


// inserting batches
db.batch_details.insertMany([
    {
      "batch":"B40WD",
      "name":"sanjay",
      "topics_covered":
      [{"topic_name": "Javascript", orderDate: new ISODate("2023-10-05T14:10:30Z") },
       {"topic_name": "Promise", orderDate: new ISODate("2023-10-14T14:10:30Z") },
       {"topic_name": "React", orderDate: new ISODate("2023-10-18T14:10:30Z") }, 
       {"topic_name": "Node", orderDate: new ISODate("2023-10-22T14:10:30Z") }, 
       {"topic_name": "Mongodb", orderDate: new ISODate("2023-10-27T14:10:30Z") }, 
       {"topic_name": "AWS", orderDate: new ISODate("2023-11-08T14:10:30Z") }]
    },
    {
      "batch":"B41WD",
      "name":"Ragav",
      "topics_covered":
      [{"topic_name": "Javascript", orderDate: new ISODate("2023-10-14T14:10:30Z") },
       {"topic_name": "Promise", orderDate: new ISODate("2023-10-18T14:10:30Z") },
       {"topic_name": "React", orderDate: new ISODate("2023-10-22T14:10:30Z") }, 
       {"topic_name": "Node", orderDate: new ISODate("2023-10-27T14:10:30Z") }, 
       {"topic_name": "Mongodb", orderDate: new ISODate("2023-11-08T14:10:30Z") }]
    },
    {
      "batch":"B42WD",
      "name":"Sangeetha",
      "topics_covered":
      [{"topic_name": "Javascript", orderDate: new ISODate("2023-10-18T14:10:30Z") },
       {"topic_name": "Promise", orderDate: new ISODate("2023-10-22T14:10:30Z") },
       {"topic_name": "React", orderDate: new ISODate("2023-10-27T14:10:30Z") }, 
       {"topic_name": "Node", orderDate: new ISODate("2023-11-08T14:10:30Z") }]
    },
    {
      "batch":"B43WD",
      "name":"Chandran",
      "topics_covered":
      [{"topic_name": "Javascript", orderDate: new ISODate("2023-10-22T14:10:30Z") },
       {"topic_name": "Promise", orderDate: new ISODate("2023-10-27T14:10:30Z") },
       {"topic_name": "React", orderDate: new ISODate("2023-11-08T14:10:30Z") }]
    },
    {
      "batch":"B44WD",
      "name":"Suraj",
      "topics_covered": 
      [{"topic_name": "Javascript", orderDate: new ISODate("2023-10-27T14:10:30Z") },
       {"topic_name": "Promise", orderDate: new ISODate("2023-11-08T14:10:30Z") }]
    }
  ])

db.batch_details.find( { "topics_covered.orderDate": { $lt: ISODate("2023-10-10T10:03:46.000Z") } } )


  
  // inserting students 
  db.students.insertMany([
    {
      "name":"Prasanth",
      "batch":"B44WD",
      "qualification":"B.E",
      "experience" : 2,
      "interviews": [ "Wipro" ],
      "topics_attended": [ "Javascript", "Promise" ],
      "taskCompletion":75,
      "codekata": 150,
      "attendance": "95%",
      "gender":"male"
    },
    {
      "name":"Ajay",
      "batch":"B42WD",
      "qualification":"BCA",
      "experience" : 5,
      "interviews": [ "Amazon", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node" ],
      "taskCompletion":80,
      "codekata": 145,
      "attendance": "90%",
      "gender":"male"
    },
    {
      "name":"Abdur",
      "batch":"B43WD",
      "qualification":"BCA",
      "experience" : 3,
      "interviews": [ "Amazon", "Zoho", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React" ],
      "taskCompletion":55,
      "codekata": 140,
      "attendance": "87%",
      "gender":"male"
    },
    {
      "name":"Anitha",
      "batch":"B40WD",
      "qualification":"B.COM",
      "experience" : 1,
      "interviews": [ "Amazon", "Google", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node", "Mongodb", "AWS" ],
      "taskCompletion":45,
      "codekata": 100,
      "attendance": "60%",
      "gender":"female"
    },
    {
      "name":"Anirutha",
      "batch":"B41WD",
      "qualification":"BSC",
      "experience" : 4,
      "interviews": [ "Amazon", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node", "Mongodb" ],
      "taskCompletion":90,
      "codekata": 80,
      "attendance": "50%",
      "gender":"female"
    },
    {
      "name":"Sivakumar",
      "batch":"B44WD",
      "qualification":"B.E",
      "experience" : 2,
      "interviews": [ "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise" ],
      "taskCompletion":65,
      "codekata": 120,
      "attendance": "84%",
      "gender":"male"
    },
    {
      "name":"Aswin",
      "batch":"B42WD",
      "qualification":"BCA",
      "experience" : 5,
      "interviews": [ "Amazon", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node" ],
      "taskCompletion":80,
      "codekata": 110,
      "attendance": "77%",
      "gender":"male"
    },
    {
      "name":"Balaji",
      "batch":"B43WD",
      "qualification":"BCA",
      "experience" : 3,
      "interviews": [ "Amazon", "Google", "Zoho", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React" ],
      "taskCompletion":55,
      "codekata": 90,
      "attendance": "65%",
      "gender":"male"
    },
    {
      "name":"Vijipriya",
      "batch":"B40WD",
      "qualification":"B.COM",
      "experience" : 1,
      "interviews": [ "Amazon", "Google", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node", "Mongodb" ],
      "taskCompletion":45,
      "codekata": 110,
      "attendance": "88%",
      "gender":"female"
    },
    {
      "name":"Sharmila",
      "batch":"B41WD",
      "qualification":"BSC",
      "experience" : 4,
      "interviews": [ "Amazon", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node", "Mongodb" ],
      "taskCompletion":90,
      "codekata": 150,
      "attendance": "60%",
      "gender":"female"
    },
    {
      "name":"Venkat",
      "batch":"B44WD",
      "qualification":"B.E",
      "experience" : 2,
      "interviews": [ "Wipro" ],
      "topics_attended": [ "Javascript", "Promise" ],
      "taskCompletion":55,
      "codekata": 140,
      "attendance": "70%",
      "gender":"male"
    },
    {
      "name":"Jeeva",
      "batch":"B42WD",
      "qualification":"BCA",
      "experience" : 5,
      "interviews": [ "Amazon", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node" ],
      "taskCompletion":60,
      "codekata": 70,
      "attendance": "88%",
      "gender":"male"
    },
    {
      "name":"Sathya",
      "batch":"B43WD",
      "qualification":"BCA",
      "experience" : 4,
      "interviews": [ "Amazon", "Zoho", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React" ],
      "taskCompletion":55,
      "codekata": 75,
      "attendance": "80%",
      "gender":"male"
    },
    {
      "name":"Anitha",
      "batch":"B40WD",
      "qualification":"B.COM",
      "experience" : 1,
      "interviews": [ "Amazon", "Google", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node", "Mongodb", "AWS" ],
      "taskCompletion":45,
      "codekata": 120,
      "attendance": "90%",
      "gender":"female"
    },
    {
      "name":"Anirutha",
      "batch":"B41WD",
      "qualification":"BSC",
      "experience" : 4,
      "interviews": [ "Amazon", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node" ],
      "taskCompletion":90,
      "codekata": 130,
      "attendance": "76%",
      "gender":"female"
    },
    {
      "name":"Vimal",
      "batch":"B44WD",
      "qualification":"B.E",
      "experience" : 2,
      "interviews": [ "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise" ],
      "taskCompletion":75,
      "codekata": 124,
      "attendance": "82%",
      "gender":"male"
    },
    {
      "name":"Nalin",
      "batch":"B42WD",
      "qualification":"BCA",
      "experience" : 5,
      "interviews": [ "Amazon", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React" ],
      "taskCompletion":80,
      "codekata": 106,
      "attendance": "69%",
      "gender":"male"
    },
    {
      "name":"Navin",
      "batch":"B43WD",
      "qualification":"BCA",
      "experience" : 3,
      "interviews": [ "Amazon", "Google", "Zoho", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise" ],
      "taskCompletion":55,
      "codekata": 90,
      "attendance": "60%",
      "gender":"male"
    },
    {
      "name":"Radhika",
      "batch":"B40WD",
      "qualification":"B.COM",
      "experience" : 1,
      "interviews": [ "Amazon", "Google", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node", "Mongodb", "AWS" ],
      "taskCompletion":45,
      "codekata": 137,
      "attendance": "87%",
      "gender":"female"
    },
    {
      "name":"Ramya",
      "batch":"B41WD",
      "qualification":"BSC",
      "experience" : 4,
      "interviews": [ "Amazon", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node", "Mongodb" ],
      "taskCompletion":90,
      "codekata": 144,
      "attendance": "89%",
      "gender":"female"
    },
    {
      "name":"Jeeva",
      "batch":"B44WD",
      "qualification":"B.E",
      "experience" : 2,
      "interviews": [ "Wipro" ],
      "topics_attended": [ "Javascript" ],
      "taskCompletion":75,
      "codekata": 140,
      "attendance": "80%",
      "gender":"male"
    },
    {
      "name":"Srider",
      "batch":"B42WD",
      "qualification":"BCA",
      "experience" : 5,
      "interviews": [ "Amazon", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node" ],
      "taskCompletion":80,
      "codekata": 147,
      "attendance": "82%",
      "gender":"male"
    },
    {
      "name":"Sathya",
      "batch":"B43WD",
      "qualification":"BCA",
      "experience" : 3,
      "interviews": [ "Amazon", "Zoho", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React" ],
      "taskCompletion":55,
      "codekata": 104,
      "attendance": "74%",
      "gender":"male"
    },
    {
      "name":"Anitha Kaladharan",
      "batch":"B40WD",
      "qualification":"B.COM",
      "experience" : 1,
      "interviews": [ "Amazon", "Google", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node", "Mongodb", "AWS" ],
      "taskCompletion":45,
      "codekata": 97,
      "attendance": "86%",
      "gender":"female"
    },
    {
      "name":"Aswini",
      "batch":"B41WD",
      "qualification":"BSC",
      "experience" : 4,
      "interviews": [ "Amazon", "Zoho", "TCS", "Wipro" ],
      "topics_attended": [ "Javascript", "Promise", "React", "Node", "Mongodb" ],
      "taskCompletion":90,
      "codekata": 138,
      "attendance": "78%",
      "gender":"female"
    },
    ])