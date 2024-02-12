const Review = require('../models/review');
const validate = require('../utils/validate');

exports.createReview = (req, res) => {
  const review = new Review();
  const reviewData = req.body;

  reviewData.reviewer_id = req.user.id

  review.create(reviewData)
    .then((reviewId) => {
      res.send({ message: 'Review created successfully', reviewId });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Could not create review', err });
    });
};

exports.updateReview = (req, res) => {
    const review = new Review();
    const reviewId = req.params.id;
    const reviewData = req.body;
    if (req.user.id !== reviewData.reviewer_id) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
        }
    if (!validate.validateTitle(reviewData.content)) {
        res.status(400).send({ message: 'Invalid format' });
        return;
      }
  
    review.update(reviewId, reviewData)
      .then(() => {
        res.send({ message: 'Review updated successfully' });
      })
      .catch((err) => {
        res.status(500).send({ message: 'Could not update review', err });
      });
  };

exports.getReviewsForUser = (req, res) => {
  const review = new Review();
  const userId = parseInt(req.params.id);

  review.getAll()
    .then((reviews) => {
      const userReviews = reviews.filter(review => review.reviewee_id === userId);
      res.send(userReviews);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Could not retrieve reviews', err });
    });
};

exports.deleteReview = (req, res) => {
    const review = new Review();
    const reviewId = req.params.id;
    // Check user owns the review
    if (req.user.id !== reviewData.reviewer_id) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
        }
  
    review.delete(reviewId)
      .then(() => {
        res.send({ message: 'Review deleted successfully' });
      })
      .catch((err) => {
        res.status(500).send({ message: 'Could not delete review', err });
      });
  };