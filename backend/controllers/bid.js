const Job = require('../models/job');
const Review = require('../models/review');
const User = require('../models/user');
const Bid = require('../models/bid');
const Project = require('../models/project');
const Milestone = require('../models/milestone');
const validate = require('../utils/validate');

exports.submitBid = async (req, res, next) => {
  try {
    const { bid_value, supporting_content } = req.body;
    const { id: job_id } = req.params;
    const freelancer_id = req.user.id;

    const validationErrors = validate.validateBid(bid_value, supporting_content);
    if (validationErrors) {
      return res.status(400).json({ code: 'ERROR', message: validationErrors });
    }

    const job = await Job.findById(job_id);

    if (!job) {
      return res.status(404).json({ code: "ERROR", message: 'Job not found' });
    }

    if (job.client_id === freelancer_id) {
      return res.status(400).json({ code: "ERROR", message: 'You cannot bid on your own job' });
    }

    const alreadyBid = await Bid.findByJobAndFreelancer(job_id, freelancer_id);
    if (alreadyBid) {
      return res.status(400).json({ code: "ERROR", message: 'You have already bid on this job' });
    }

    const bidId = await Bid.create({
      job_id,
      freelancer_id,
      bid_value,
      supporting_content,
      status: 1
    });

    res.status(200).json({ code: "SUCCESS", message: 'Bid submitted successfully', bidId });
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
    const originalBudget = await Job.getBudgetById(job_id);
    const job = await Job.findById(job_id);

    if (!job) {
      return res.status(404).json({ code: "ERROR", message: 'Job not found' });
    }

    if (job.client_id !== req.user.id) {
      return res.status(403).json({ code: "ERROR", message: 'You are not authorized to view this job\'s bids' });
    }

    if (!originalBudget) {
      return res.status(404).json({ code: "ERROR", message: 'Job not found' });
    }

    const [totalUsers, avgReviewsPerUser, totalNoRatings] = await Promise.all([
      User.getTotalUsers(),
      Review.getAvgReviewsPerUser(),
      Review.getTotalNumberOfRatings()
    ]);

    const minNumOfReviews = Math.ceil(totalNoRatings / totalUsers);
    const overallMeanRating = avgReviewsPerUser / totalUsers;

    const bids = await Bid.findAllSortedByScores(job_id, originalBudget, minNumOfReviews, overallMeanRating);
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

    const job = await Job.findById(currentBid.job_id);

    if (!job) {
      return res.status(404).json({ code: "ERROR", message: 'Job not found' });
    }

    if (job.client_id !== req.user.id) {
      return res.status(403).json({ code: "ERROR", message: 'You are not authorized to update this bid' });
    }

    if (!currentBid) {
      return res.status(404).json({ code: "ERROR", message: 'Bid not found' });
    }

    if ([2, 3].includes(currentBid.status)) {
      return res.status(400).json({ code: "ERROR", message: 'Bid status cannot be changed once it is accepted or rejected' });
    }

    if (![2, 3].includes(status)) {
      return res.status(400).json({ code: "ERROR", message: 'Bid status can only be set to accepted (2) or rejected (3)' });
    }

    if (status == 2) {
      // Update the job's freelancer_id and status
      await Job.updateFreelancerIdAndStatus(currentBid.job_id, currentBid.freelancer_id, status);

      // Create a new project
      const project = new Project();
      const newProject = await project.create({ job_id: currentBid.job_id, status:1 });

      // Create a default milestone
      const milestone = new Milestone();
      await milestone.create({
        project_id: newProject,
        name: 'Final Milestone',
        description: 'This is the final milestone, submit your work here.',
        due_date: job.deadline,
        status: 1, // Assuming 0 is the status for a new milestone
      });
    }

    await Bid.updateStatus(bidId, status, new Date());

    res.status(200).json({ code: "SUCCESS", message: 'Bid status updated successfully' });
  } catch (error) {
    next(error);
  }
};