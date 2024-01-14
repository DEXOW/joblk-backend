const db = require('../utils/db_connection');
const Model = require('./model');

class Bid extends Model {
  constructor() {
    super('bids');
  }

  async create(bidData) {
    const { job_id, freelancer_id, bid_value, supporting_content, status } = bidData;
    return super.create({ job_id, freelancer_id, bid_value, supporting_content, status });
  }

  findByJobAndFreelancer(job_id, freelancer_id) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM bids WHERE job_id = ? AND freelancer_id = ?`, [job_id, freelancer_id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results.length > 0);
      });
    });
  }

  findAllByFreelancer(freelancer_id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT j.title AS job_title, b.bid_value, b.supporting_content, bs.status AS status_name 
      FROM bids b
      JOIN jobs j ON b.job_id = j.id
      LEFT JOIN bid_status bs ON b.status = bs.id
      WHERE b.freelancer_id = ?`;
      db.query(sql, [freelancer_id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  findAllByJob(job_id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT u.username, u.avatar, b.bid_value, b.supporting_content, b.status, bs.status AS status_name
      FROM bids b
      JOIN bid_status bs ON b.status = bs.id
      JOIN users u ON b.freelancer_id = u.id
      WHERE b.job_id = ?`;
      db.query(sql, [job_id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  async findAllSortedByScores(job_id, originalBudget, minNumOfReviews, overallMeanRating) {
    const sql = `SELECT b.*, u.username AS freelancer_username, bs.status AS status_name,
               @ratingScore := (SELECT AVG(rating) FROM reviews WHERE reviewee_id = b.freelancer_id) AS rating_score,
               @numOfReviews := (SELECT COUNT(*) FROM reviews WHERE reviewee_id = b.freelancer_id) AS num_of_reviews
               FROM bids b
               JOIN users u ON b.freelancer_id = u.id
               LEFT JOIN bid_status bs ON b.status = bs.id
               WHERE b.job_id = ?`;

    return new Promise((resolve, reject) => {
      db.query(sql, [job_id], async (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        const bidsPromises = results.map(result => {
          const biddingScore = this.calculateBiddingScore(result.bid_value, originalBudget);
          const ratingScore = this.calculateRatingScore(result.rating_score, result.num_of_reviews, minNumOfReviews, overallMeanRating);

          const finalScore = biddingScore + ratingScore;

          return {
            ...result,
            bidding_score: biddingScore,
            rating_score: ratingScore,
            final_Score: Number(finalScore.toFixed(2))
          };
        });

        const bids = await Promise.all(bidsPromises);

        bids.sort((a, b) => {
          return b.final_Score - a.final_Score;
        });

        resolve(bids);
      });
    });
  }


  calculateBiddingScore(bidValue, originalBudget) {
    return 1 - (bidValue / originalBudget);
  }

  calculateRatingScore(averageRating, numOfReviews, minNumOfReviews, overallMeanRating) {
    const v = numOfReviews;
    const m = minNumOfReviews;
    const R = averageRating;
    const C = overallMeanRating;

    return R * (v * (v + m)) + C * (m * (v + m));
  }
}

module.exports = new Bid();
