const Product = require("../models/ProductModel");

const addReview = async (productId, userId, username, rating, comment) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm!");
  }

  product.reviews.push({ userId, username, rating, comment });

  const totalRatings = product.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const numReviews = product.reviews.length;
  product.averageRating = (totalRatings / numReviews).toFixed(2);

  const ratingCounts = [0, 0, 0, 0, 0];
  product.reviews.forEach((review) => ratingCounts[review.rating - 1]++);

  product.ratingPercentages = {
    oneStar: (ratingCounts[0] / numReviews) * 100,
    twoStar: (ratingCounts[1] / numReviews) * 100,
    threeStar: (ratingCounts[2] / numReviews) * 100,
    fourStar: (ratingCounts[3] / numReviews) * 100,
    fiveStar: (ratingCounts[4] / numReviews) * 100
  };

  await product.save();
  return product;
};

const getProductReviews = async (productId) => {
  const product = await Product.findById(productId).populate(
    "reviews.replies.userId",
    "username"
  );
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm!");
  }

  return {
    reviews: product.reviews,
    averageRating: product.averageRating,
    ratingPercentages: product.ratingPercentages
  };
};

const addReplyToReview = async (
  productId,
  reviewId,
  userId,
  username,
  comment
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm!");
  }

  const review = product.reviews.id(reviewId);
  if (!review) {
    throw new Error("Không tìm thấy bình luận!");
  }

  review.replies.push({ userId, username, comment });

  await product.save();
  return product;
};
const getAllComments = async () => {
  const products = await Product.find({}, "reviews name").populate(
    "reviews.userId",
    "username"
  );

  const comments = products.map((product) => ({
    productId: product._id,
    productName: product.name,
    reviews: product.reviews
  }));

  return comments;
};

const countUserReviews = async () => {
  const products = await Product.find({}, "reviews");

  let totalReviews = 0;

  products.forEach((product) => {
    totalReviews += product.reviews.length;
  });

  return totalReviews;
};
module.exports = {
  addReview,
  getProductReviews,
  addReplyToReview,
  getAllComments,
  countUserReviews
};
