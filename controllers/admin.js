import User from "../models/User.js";

/**
 * aproove or reject user
 */

export const aprooveOrReject = async (req, res) => {
  try {
   
    const { action,userId } = req.body;
    if (action === "aproove") {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
          isAprooved: true,
        },
        {
          new: true,
        }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
          isAprooved: false,
        },
        {
          new: true,
        }
      );
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
