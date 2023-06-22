
const Task = require("../models/TaskModel");

// task create
exports.createTask = async (req, res) => {
  try {
    let reqBody = req.body;
    reqBody.email = req.headers["email"];
    let data = await Task.create(reqBody);
    if (data) {
      res.status(200).json({ status: "success", data: data });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail", data: error.massage });
  }
};

//all task
exports.allTask = async (req, res) => {
  try {
    let email = req.headers["email"];
    let data = await Task.find({ email });
    // console.log(data)
    if (data) {
      res.status(200).json({ status: "success", data: data });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail", data: error.massage });
  }
};

//delete task
exports.deleteTask = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await Task.deleteOne({ _id: id });
    if (data) {
      res.status(200).json({ status: "success", data: data });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail", data: error.massage });
  }
};

//update task
exports.updateStatus = async (req, res) => {
  try {
    let { id, status } = req.params;
    let data = await Task.updateOne({ _id: id }, { status });
    // console.log(data)
    if (data) {
      res.status(200).json({ status: "success", data: data });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail", data: error.massage });
  }
};

// list Task By Status
exports.listTaskByStatus = (req, res) => {
  let { status } = req.params;
  let email = req.headers["email"];
  Task.aggregate([
    { $match: { status, email } },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        createdDate: {
          $dateToString: { date: "$createdDate", format: "%d-%m-%Y" },
        },
      },
    },
  ])
    .then((data) => {
      res.status(200).json({ status: "success", data: data });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ status: "fail", data: error.massage });
    });
};

// task Status Count
exports.taskStatusCount = (req, res) => {
  let email = req.headers["email"];
  Task.aggregate([
    { $match: { email } },
    { $group: { _id: "$status", sum: { $count: {} } } },
  ]).then((data) => {
      res.status(200).json({ status: "success", data: data });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ status: "fail", data: error.massage });
    });
};