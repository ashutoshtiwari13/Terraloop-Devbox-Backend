import Offer from "../models/Offer.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

/**
 * create transaction and credit purchase
 */

export const createTransaction = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const user = await User.findById(req.user);
    const newTransaction = await Transaction.create({
      items,
      totalAmount,
      purchasedBy:user._id,
    });
    user.transactionHistoty.push(newTransaction._id);
    await user.save();
    res.status(200).json({newTransaction});
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
