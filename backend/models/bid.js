const db = require('../utils/db_connection');
const Model = require('./model');

class Bid extends Model {
  constructor() {
    super('bids');
  }

  async queryFirst(query, params) {
    const results = await this.queryAll(query, params);
    return results[0] || null;
  }

  async queryAll(query, params) {
    return new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  async create(bidData) {
    return super.create(bidData);
  }

  async updateStatus(bidId, status, timestamp) {
    
    const statusColumn = status === 2 ? 'accepted_at' : 'rejected_at';
    const query = `UPDATE bids SET status = ?, ${statusColumn} = ? WHERE id = ?`;
    return db.query(query, [status, timestamp, bidId]);
  }

  async findById(bidId) {
    const query = 'SELECT * FROM bids WHERE id = ?';
    return this.queryFirst(query, [bidId]);
  }

  async findByJobAndFreelancer(jobId, freelancerId) {
    const query = 'SELECT * FROM bids WHERE job_id = ? AND freelancer_id = ?';
    const results = await this.queryAll(query, [jobId, freelancerId]);
    return results.length > 0;
  }

  async findAllByFreelancer(freelancerId) {
    const sql = `
      SELECT j.title AS job_title, b.bid_value, b.supporting_content, bs.status AS status_name 
      FROM bids b
      JOIN jobs j ON b.job_id = j.id
      LEFT JOIN bid_status bs ON b.status = bs.id
      WHERE b.freelancer_id = ?`;
    return this.queryAll(sql, [freelancerId]);
  }

  async findAllByJob(jobId) {
    const sql = `
      SELECT u.username, u.avatar, b.bid_value, b.supporting_content, b.status, bs.status AS status_name
      FROM bids b
      JOIN bid_status bs ON b.status = bs.id
      JOIN users u ON b.freelancer_id = u.id
      WHERE b.job_id = ?`;
    return this.queryAll(sql, [jobId]);
  }

  async findAllSortedByScores(job_id, originalBudget, minNumOfReviews, overallMeanRating) {
    const sql = `SELECT b.id, u.username AS freelancer_username, b.bid_value, b.supporting_content, b.status,
               @ratingScore := (SELECT AVG(rating) FROM reviews WHERE reviewee_id = b.freelancer_id) AS rating_score,
               @numOfReviews := (SELECT COUNT(*) FROM reviews WHERE reviewee_id = b.freelancer_id) AS num_of_reviews
               FROM bids b
               JOIN users u ON b.freelancer_id = u.id
               LEFT JOIN bid_status bs ON b.status = bs.id
               WHERE b.job_id = ?`;
  
    const results = await this.queryAll(sql, [job_id]);
  
    const bidsPromises = results.map(result => {
      const biddingScore = this.calculateBiddingScore(result.bid_value, originalBudget);
      const ratingScore = this.calculateRatingScore(result.rating_score, result.num_of_reviews, minNumOfReviews, overallMeanRating);
      const finalScore = biddingScore + ratingScore;
      return {
        id: result.id,
        freelancer_username: result.freelancer_username,
        bid_value: result.bid_value,
        supporting_content: result.supporting_content,
        status: result.status,
        bid_Score: Number(finalScore.toFixed(2))
      };
    });
  
    const bids = await Promise.all(bidsPromises);
    bids.sort((a, b) => {
      return b.bid_Score - a.bid_Score;
    });
  
    return bids;
  }

  calculateBiddingScore = (bidValue, originalBudget) => 1 - (bidValue / originalBudget);

  calculateRatingScore(averageRating, numOfReviews, minNumOfReviews, overallMeanRating) {
    const v = numOfReviews;
    const m = minNumOfReviews;
    const R = averageRating;
    const C = overallMeanRating;

    return R * (v * (v + m)) + C * (m * (v + m));
  }
}

module.exports = new Bid();
