const Job = require('../models/job');
const validate = require('../utils/validate');

exports.createJob = (req, res) => {
  const job = new Job();
  const jobData = req.body;

  
  jobData.client_id = req.user.id;
  const requiredFields = ['title', 'description', 'budget']; 

  for (let field of requiredFields) {
    if (!jobData.hasOwnProperty(field) || !jobData[field]) {
      res.status(400).send({ message: `Missing or empty required field: ${field}` });
      return;
    }
  }

  if (!validate.validateTitle(jobData.title) || !validate.validateTitle(jobData.description)) {
    res.status(400).send({ message: 'Invalid Title or Description' });
    return;
  }

  if (!validate.validateBudget(jobData.budget)) {
    res.status(400).send({ message: 'Invalid budget format' });
    return;
  }
  
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

  const requiredFields = ['title', 'description', 'budget']; 

  for (let field of requiredFields) {
    if (!jobData.hasOwnProperty(field) || !jobData[field]) {
      res.status(400).send({ message: `Missing or empty required field: ${field}` });
      return;
    }
  }

  if (!validate.validateTitle(jobData.title) || !validate.validateTitle(jobData.description)) {
    res.status(400).send({ message: 'Invalid format' });
    return;
  }

  if (!validate.validateBudget(jobData.budget)) {
    res.status(400).send({ message: 'Invalid budget format' });
    return;
  }

  job.update(jobId, jobData)
    .then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).send({ message: 'Job not found' });
      } else {
        res.send({ message: 'Job updated successfully' });
      }
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