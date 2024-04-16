const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const app = express();
const PORT = 3000;
app.use(express.json());
const corsOptions = {
    origin: "*",
  };
app.use(cors(corsOptions));
app.post('/new-question', async(req, res) =>{
    try {
        const question = await Question.create(req.body)
        res.status(200).json(question)
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})
app.post('/punch/:APIKEY/:ClientSecretKey/:EE/:Time/:type/:job', async(req, res) =>{
  const {APIKEY} = req.params;
  const {ClientSecretKey} = req.params;
  const {EE} = req.params;
  const {Time} = req.params;
  const {type} = req.params;
  const {job} = req.params;
  const bodydata ={
    "EmployeeNumber": EE,
    "PunchType": type,
    "TimePunch": Time,
    "CostCenter1": null,
    "CostCenter2": null,
    "CostCenter3": null,
    "CostCenter4": null,
    "CostCenter5": null,
    "Job": job,
    "Task": null,
    "Quantity": 10,
    "EntryDetails": null,
    "Note": null,
    "ISExplicit": true,
    "PunchID": null,
    "PayWithCheckDate": null,
    "PayWithRunNumber": null
  }
  try {
    const response = await fetch('https://developer.fingercheck.com/api/v1/Punch/AddPunch',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'APIKEY': APIKEY,
          'ClientSecretKey': ClientSecretKey,
      },
      body: JSON.stringify(bodydata)
    })
    const data = await response.json()
    res.json(await data)
      
  } catch (error) {
      console.log(error.message);
      res.status(500).json({message: error.message})
  }
})
app.post('/punchtool/file/:APIKEY/:ClientSecretKey', async(req, res) =>{
  const {APIKEY} = req.params;
  const {ClientSecretKey} = req.params;
  const bodydata = req.body;
  try {
    const response = await fetch('https://developer.fingercheck.com/api/v1/Punch/AddPunchs',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'APIKEY': APIKEY,
          'ClientSecretKey': ClientSecretKey,
      },
      body: JSON.stringify(bodydata)
    })
    const data = await response.json()
    res.status(200).json(await data)
      
  } catch (error) {
      console.log(error.message);
      res.status(500).json({message: error.message})
  }
})
app.post('/punchtool/:APIKEY/:ClientSecretKey', async(req, res) =>{
  const {APIKEY} = req.params;
  const {ClientSecretKey} = req.params;
  const bodydata = req.body;
  console.log(bodydata)
  let senddata = []
  bodydata.forEach(element => {
    let CC1 = element.CostCenter1;
    let CC2 = element.CostCenter2;
    let CC3 = element.CostCenter3;
    let CC4 = element.CostCenter4;
    let CC5 = element.CostCenter5;
    let Job = element.Job;
    console.log(CC1)
    if(CC1 != "null" || CC1 != null){
      CC1 =  `${CC1}`

    }
    if(CC2 != null){
      CC1 =  `${CC1}`
    }
    if(CC3 != null){
      CC1 =  `${CC1}`
    }
    if(CC4 != null){
      CC1 =  `${CC1}`
    }
    if(CC4 != null){
      CC1 =  `${CC1}`
    }
    if(Job != null){
      Job =  `${Job}`
    }
    if(element.TimeIn != null){
      senddata.push(
        {
          "EmployeeNumber":`${element.EmployeeNumber}`,
          "PunchType":0,
          "TimePunch":`${element.TimeIn}`,
          "CostCenter1":CC1,
          "CostCenter2":CC2,
          "CostCenter3":CC3,
          "CostCenter4":CC4,
          "CostCenter5":CC5,
          "Job": Job,
          "Task":null,
          "Quantity":10,
          "EntryDetails":null,
          "Note":null,
          "ISExplicit":true,
          "PunchID":null,
          "PayWithCheckDate":null,
          "PayWithRunNumber":null
        }
      )
    }
    if(element.TimeOut != null){
      senddata.push(
        {
          "EmployeeNumber":`${element.EmployeeNumber}`,
          "PunchType":1,
          "TimePunch":`${element.TimeOut}`,
          "CostCenter1":CC1,
          "CostCenter2":CC2,
          "CostCenter3":CC3,
          "CostCenter4":CC4,
          "CostCenter5":CC5,
          "Job": Job,
          "Task":null,
          "Quantity":10,
          "EntryDetails":null,
          "Note":null,
          "ISExplicit":true,
          "PunchID":null,
          "PayWithCheckDate":null,
          "PayWithRunNumber":null
        }
      )
    }
  })
  try {
    const response = await fetch('https://developer.fingercheck.com/api/v1/Punch/AddPunchs',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'APIKEY': APIKEY,
          'ClientSecretKey': ClientSecretKey,
      },
      body: JSON.stringify(senddata)
    })
    const data = await response.json()
    res.json(await data)
      
  } catch (error) {
      console.log(error.message);
      res.status(500).json({message: error.message})
  }
})
app.get('/jobs/:APIKEY/:ClientSecretKey', async(req, res) => {
  const {APIKEY} = req.params;
  const {ClientSecretKey} = req.params;
  const response = await fetch('https://developer.fingercheck.com/api/v1/Sync/GetJobList',{
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'APIKEY': APIKEY,
        'ClientSecretKey': ClientSecretKey,
    },
  })
  const data = await response.json()
  res.json(await data)
})

app.get('/checks/:APIKEY/:ClientSecretKey/:dateStart/:dateEnd', async(req, res) => {
  const {dateStart} = req.params;
  const {dateEnd} = req.params;
  const {APIKEY} = req.params;
  const {ClientSecretKey} = req.params;
  const response = await fetch(`https://developer.fingercheck.com/api/v1/Reports/GetAllPayrollCheckDetailsForDateRange?startDate=${dateStart}&endDate=${dateEnd}`,{
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'APIKEY': APIKEY,
        'ClientSecretKey': ClientSecretKey,
    },
  })
  const data = await response.json()
  res.json(await data)
})

app.get('/EmployeeClockInfo/:APIKEY/:ClientSecretKey/:EE1', async(req, res) => {
  const {APIKEY} = req.params;
  const {EE1} = req.params;
  const {ClientSecretKey} = req.params;
  const response = await fetch(`https://developer.fingercheck.com/api/v1/Employees/GetEmployeeByEmployeeNumber/${EE1}`,{
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'APIKEY': APIKEY,
        'ClientSecretKey': ClientSecretKey,
    },
  })
  const data = await response.json()
  res.json(await data)
})

app.get('/payroll', async(req, res) => {
    const payroll = await Question.find({category: 'Payroll'});
    res.status(200).json(payroll);
  });
  app.get('/Payroll-Forms & Notices', async(req, res) => {
    const payroll = await Question.find({category: 'Payroll - Forms & Notices'});
    res.status(200).json(payroll);
  });
  app.get('/Hiring', async(req, res) => {
    const payroll = await Question.find({category: 'Hiring'});
    res.status(200).json(payroll);
  });
  app.get('/Employees', async(req, res) => {
    const payroll = await Question.find({category: 'Employees'});
    res.status(200).json(payroll);
  });
  app.get('/Schedule', async(req, res) => {
    const payroll = await Question.find({category: 'Schedule'});
    res.status(200).json(payroll);
  });
  app.get('/Time-Labor', async(req, res) => {
    const payroll = await Question.find({category: 'Time & Labor'});
    res.status(200).json(payroll);
  });
  app.get('/Human-resources', async(req, res) => {
    const payroll = await Question.find({category: 'Human resources'});
    res.status(200).json(payroll);
  });
  app.get('/Reports', async(req, res) => {
    const payroll = await Question.find({category: 'Reports'});
    res.status(200).json(payroll);
  });
  app.get('/Setup-Security', async(req, res) => {
    const payroll = await Question.find({category: 'Setup - Security'});
    res.status(200).json(payroll);
  });
  app.get('/Setup-System', async(req, res) => {
    const payroll = await Question.find({category: 'Setup - System'});
    res.status(200).json(payroll);
  });
  app.get('/Setup-Company', async(req, res) => {
    const payroll = await Question.find({category: 'Setup - Company'});
    res.status(200).json(payroll);
  });
  app.get('/Setup-Policies', async(req, res) => {
    const payroll = await Question.find({category: 'Setup - Policies'});
    res.status(200).json(payroll);
  });
  app.get('/Billing', async(req, res) => {
    const payroll = await Question.find({category: 'Billing'});
    res.status(200).json(payroll);
  });
  app.get('/Clock', async(req, res) => {
    const payroll = await Question.find({category: 'Clock'});
    res.status(200).json(payroll);
  });
  app.get('/Home', async(req, res) => {
    const payroll = await Question.find().sort({$natural: -1}).limit(5);
    res.status(200).json(payroll);
  });

mongoose.set("strictQuery", false)
mongoose.connect('mongodb+srv://ethanstrain:SummSumm2020!@cluster0.rfj0nbx.mongodb.net/').then(()=>{
    app.listen(
        PORT,
        () => console.log('its alive')
    )
    console.log('connected to mongo')
}).catch((error)=>{
    console.log(error)
})
const questionschema = mongoose.Schema(
    {
        header:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        category:{
            type: String,
            required: true
        },
        tags:{
            type: String,
        }
    }
)

const Question = mongoose.model('Question', questionschema);
module.exports.handler = serverless(app);
