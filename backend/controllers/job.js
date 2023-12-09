const Job = require('../models/job');

exports.createJob = (req, res) => {
  const job = new Job();
  const jobData = req.body;
  
  //TODO add validations
  job.create(jobData)
    .then((jobId) => {
      res.send({ message: 'Job created successfully', jobId });
    })                          
    .catch((err) => {
      res.status(500).send({ message: 'Could not create job', err });
    });
};

exports.getJobs = (req, res) => {
  const job = new Job();

  job.getAll()
    .then((jobs) => {
      res.send(jobs);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Could not retrieve jobs', err });
    });
};

exports.getJob = (req, res) => {
  const job = new Job();
  const jobId = req.params.id;

  job.get(jobId)
    .then((job) => {
      res.send(job);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Could not retrieve job', err });
    });
};

exports.updateJob = (req, res) => {
  const job = new Job();
  const jobId = req.params.id;
  const jobData = req.body;

  //TODO add validations 

  job.update(jobId, jobData)
    .then(() => {
      res.send({ message: 'Job updated successfully' });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Could not update job', err });
    });
};

exports.deleteJob = (req, res) => {
  const job = new Job();
  const jobId = req.params.id;

  job.delete(jobId)
    .then(() => {
      res.send({ message: 'Job deleted successfully' });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Could not delete job', err });
    });
};