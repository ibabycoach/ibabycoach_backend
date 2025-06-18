const userSubscriptionModel = require('../../model/Admin/user_subscriptions');
const helper = require('../../Helper/helper');


module.exports = {
  addSubscription: async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, duration } = req.body;

    const existingSubscription = await userSubscriptionModel.findOne({
      user: userId,
      status: '1',
      deleted: false
    });

    if (existingSubscription) {
      const isExpired = new Date(existingSubscription.expiry_time) < new Date();

      if (!isExpired) {
        return res.status(400).json({
          success: false,
          message: 'User already has an active subscription.'
        });
      }

      await userSubscriptionModel.updateOne(
        { _id: existingSubscription._id },
        { $set: { status: '0' } }
      );
    }

    // Create new subscription
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + parseInt(duration));

    const newSubscription = await userSubscriptionModel.create({
      user: userId,
      type,
      duration,
      start_date: startDate,
      end_date: endDate,
      expiry_time: endDate.toISOString(),
      status: '1',
      deleted: false
    });

    return await helper.success(res, "Subscription created successfully", newSubscription);

  } catch (error) {
    console.error('Subscription creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}

};
