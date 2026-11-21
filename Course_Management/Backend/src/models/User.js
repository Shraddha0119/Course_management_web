import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "instructor", "student"],
      default: "student",
    },

    // 👇 ADD HERE
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    profileImage: {
      type: String,
    },

    bio: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Achievements / badges earned by the user
    badges: {
      type: [
        {
          name: { type: String },
          earnedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ email: 1 });
userSchema.index({ "badges.name": 1 });

export default mongoose.model("User", userSchema);
