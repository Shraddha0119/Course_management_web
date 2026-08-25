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

export default mongoose.model("User", userSchema);
