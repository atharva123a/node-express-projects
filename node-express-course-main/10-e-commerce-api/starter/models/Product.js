const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name!"],
      maxlength: [100, "Product name cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price!"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description!"],
      maxlength: [
        1000,
        "Product description cannot be more than 1000 characters",
      ],
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Please provide product category!"],
      enum: {
        values: ["home", "office", "kitchen", "bedroom"],
      },
    },
    company: {
      type: String,
      required: [true, "Please provide product company!"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide product user"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// a virtual function!
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false, // for a list!
  match: { rating: 5 }, // for all reviews where rating is 5
});

// to remove all reviews associated with the product we are about to delete:
ProductSchema.pre("remove", async function () {
  await this.model("Review").deleteMany({ product: this._id });
});

module.exports = mongoose.model("Product", ProductSchema);
