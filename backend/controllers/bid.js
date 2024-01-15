const Job = require('../models/job');
const Review = require('../models/review');
const User = require('../models/user');
const Bid = require('../models/bid');
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

    if (!currentBid) {
      return res.status(404).json({ code: "ERROR", message: 'Bid not found' });
    }

    if ([2, 3].includes(currentBid.status)) {
      return res.status(400).json({ code: "ERROR", message: 'Bid status cannot be changed once it is accepted or rejected' });
    }

    if (![2, 3].includes(status)) {
      return res.status(400).json({ code: "ERROR", message: 'Bid status can only be set to accepted (2) or rejected (3)' });
    }

    await Bid.updateStatus(bidId, status, new Date());

    res.status(200).json({ code: "SUCCESS", message: 'Bid status updated successfully' });
  } catch (error) {
    next(error);
  }
};