const Bid = require('../models/bid');
const validate = require('../utils/validate');
const Job = require('../models/job');
const Review = require('../models/review');
const User = require('../models/user');
const Project = require('../models/project');
const Milestone = require('../models/milestone');

const ERROR_CODE = 'ERROR';
const SUCCESS_CODE = 'SUCCESS';

exports.submitBid = async (req, res, next) => {
  try {
    const { bid_value, supporting_content } = req.body;
    const { id: job_id } = req.params;
    const freelancer_id = req.user.id;
    const [job, alreadyBid] = await Promise.all([
      Job.findById(job_id),
      Bid.findByJobAndFreelancer(job_id, freelancer_id)
    ]);
    const validationErrors = validate.validateBid(bid_value, supporting_content, job.budget);

    if (!job) {
      return res.status(404).json({ code: ERROR_CODE, message: 'Job not found' });
    }

    if (job.job_status != 1) {
      return res.status(400).json({ code: ERROR_CODE, message: 'Job is not open for bidding' });
    }

    if (job.client_id === freelancer_id) {
      return res.status(400).json({ code: ERROR_CODE, message: 'You cannot bid on your own job' });
    }

    if (alreadyBid) {
      return res.status(400).json({ code: ERROR_CODE, message: 'You have already bid on this job' });
    }

    if (validationErrors) {
      return res.status(400).json({ code: ERROR_CODE, message: validationErrors });
    }

    const bidId = await Bid.create({
      job_id,
      freelancer_id,
      bid_value,
      supporting_content,
      status: 1
    });

    res.status(200).json({ code: SUCCESS_CODE, message: 'Bid submitted successfully', bidId });
  } catch (error) {
    next(error);
  }
}

exports.getMyBids = async (req, res, next) => {
  try {
    const freelancer_id = req.user.id;
    const bids = await Bid.findAllByFreelancer(freelancer_id);
    res.json(bids);
  } catch (error) {
    next(error);
  }
};

exports.getJobBidsSortedByScores = async (req, res, next) => {
  try {
    const job_id = req.params.id;
    const job = await Job.findById(job_id);

    if (!job) {
      return res.status(404).json({ code: ERROR_CODE, message: 'Job not found' });
    }

    if (job.client_id !== req.user.id) {
      return res.status(403).json({ code: ERROR_CODE, message: 'Unauthorized' });
    }

    const [totalUsers, avgReviewsPerUser, totalNoRatings] = await Promise.all([
      User.getTotalUsers(),
      Review.getAvgReviewsPerUser(),
      Review.getTotalNumberOfRatings()
    ]);

    const minNumOfReviews = Math.ceil(totalNoRatings / totalUsers);
    const overallMeanRating = avgReviewsPerUser / totalUsers;

    const bids = await Bid.findAllSortedByScores(job_id, job.budget, minNumOfReviews, overallMeanRating);
    res.json(bids);
  } catch (error) {
    next(error);
  }
};

exports.updateBidStatus = async (req, res, next) => {
  try {
    const { id: bidId } = req.params;
    const { status } = req.body;

    const currentBid = await Bid.findById(bidId);
    if (!currentBid) {
      return res.status(404).json({ code: ERROR_CODE, message: 'Bid not found' });
    }

    const job = await Job.findById(currentBid.job_id);
    if (!job) {
      return res.status(404).json({ code: ERROR_CODE, message: 'Job not found' });
    }

    if (job.client_id !== req.user.id) {
      return res.status(403).json({ code: ERROR_CODE, message: 'Unauthorized' });
    }

    if (![2, 3].includes(status)) {
      return res.status(400).json({ code: ERROR_CODE, message: 'Invalid status' });
    }

    if ([2, 3].includes(currentBid.status)) {
      return res.status(400).json({ code: ERROR_CODE, message: 'Status has already been changed' });
    }

    if (status == 2) {
      await Promise.all([
        Job.updateFreelancerIdAndStatus(currentBid.job_id, currentBid.freelancer_id),
        createProjectAndMilestone(currentBid, job.deadline)
      ]);
    } else {
      await Bid.updateStatus(bidId, status, new Date());
    }

    res.status(200).json({ code: SUCCESS_CODE, message: 'Bid status updated successfully' });
  } catch (error) {
    next(error);
  }
};

async function createProjectAndMilestone(currentBid, deadline) {
  const project = await new Project().create({ job_id: currentBid.job_id, status: 1 });
  await new Milestone().create({
    project_id: project,
    name: 'Final Milestone',
    description: 'This is the final milestone, submit your work here.',
    due_date: deadline,
    status: 1,
    order_number: 1,
  });
}