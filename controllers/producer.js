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

    // find and deduct credits from offers
    //   we need to deduct creditsAvailable from offer schema
    for (let i = 0; i < items.length; i++) {
      const offer = await Offer.findById(items[i]._id);
      if (offer._id.toString() == items[i]._id) {
        const credits =
          Number(offer.creditsAvailable) - Number(items[i].creditPurchaseValue);
        await Offer.findByIdAndUpdate(
          items[i]._id,
          {
            $set: req.body,
            creditsAvailable: credits,
          },
          {
            new: true,
          }
        );
      }
    }
    const recyclers = items.map((i) => {
      return i?.createdBy?._id;
    });
    const newTransaction = await Transaction.create({
      items,
      totalAmount,
      purchasedBy: user._id,
      recyclers: recyclers,
    });
    user.transactionHistoty.push(newTransaction._id);

    await user.save();
    res.status(200).json({ newTransaction });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
