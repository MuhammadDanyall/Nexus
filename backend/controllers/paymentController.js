const Transaction = require('../models/Transaction');
const User = require('../models/User');
const crypto = require('crypto');

// @desc    Simulate a payment checkout
// @route   POST /api/payments/checkout
// @access  Private
const checkout = async (req, res) => {
  try {
    const { amount, type } = req.body;
    const userId = req.user._id;

    if (!amount || amount <= 0 || !['deposit', 'withdraw'].includes(type)) {
      return res.status(400).json({ message: 'Invalid amount or type' });
    }

    const user = await User.findById(userId);

    if (type === 'withdraw' && user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Create a mock transaction ID (Simulating Stripe)
    const transactionId = `txn_${crypto.randomBytes(12).toString('hex')}`;

    // Create transaction in 'pending' status
    const transaction = await Transaction.create({
      userId,
      amount,
      type,
      status: 'pending',
      transactionId
    });

    // Simulate async payment processing via setTimeout
    setTimeout(async () => {
      // 90% success rate mock
      const isSuccess = Math.random() > 0.1;
      
      const tx = await Transaction.findById(transaction._id);
      if (tx) {
        tx.status = isSuccess ? 'completed' : 'failed';
        await tx.save();

        if (isSuccess) {
          const usr = await User.findById(userId);
          if (type === 'deposit') {
            usr.walletBalance += amount;
          } else if (type === 'withdraw') {
            usr.walletBalance -= amount;
          }
          await usr.save();
        }
      }
    }, 15000); // 15-second simulation delay

    res.status(202).json({
      message: 'Payment is being processed. It may take up to 15 seconds.',
      walletBalance: user.walletBalance,
      transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Transfer funds to another user
// @route   POST /api/payments/transfer
// @access  Private
const transfer = async (req, res) => {
  try {
    const { amount, receiverId } = req.body;
    const senderId = req.user._id;

    if (!amount || amount <= 0 || !receiverId) {
      return res.status(400).json({ message: 'Invalid amount or receiver ID' });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    if (sender.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient funds for transfer' });
    }

    const transactionId = `trf_${crypto.randomBytes(12).toString('hex')}`;

    const transaction = await Transaction.create({
      userId: senderId,
      receiverId: receiverId,
      amount,
      type: 'transfer',
      status: 'pending',
      transactionId
    });

    // Simulate async transfer processing
    setTimeout(async () => {
      const isSuccess = Math.random() > 0.05; // 95% success rate mock
      const tx = await Transaction.findById(transaction._id);
      
      if (tx) {
        tx.status = isSuccess ? 'completed' : 'failed';
        await tx.save();

        if (isSuccess) {
          const sendUsr = await User.findById(senderId);
          const recUsr = await User.findById(receiverId);
          
          sendUsr.walletBalance -= amount;
          recUsr.walletBalance += amount;
          
          await sendUsr.save();
          await recUsr.save();
        }
      }
    }, 15000); // 15-second simulation delay

    res.status(202).json({
      message: 'Transfer is being processed. It may take up to 15 seconds.',
      walletBalance: sender.walletBalance,
      transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get transaction history
// @route   GET /api/payments/history
// @access  Private
const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    // Get transactions where user is either sender (userId) or receiver (receiverId)
    const transactions = await Transaction.find({ 
      $or: [{ userId }, { receiverId: userId }]
    }).sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  checkout,
  transfer,
  getTransactionHistory
};
