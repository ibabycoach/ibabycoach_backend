const userSubscriptionModel = require('../../model/Admin/user_subscriptions');
const userModel = require('../../model/Admin/user');
const helper = require('../../Helper/helper');

const cron = require('node-cron');

cron.schedule('0 0 * * * *', async () => {
  console.log('🔄 Running subscription expiry checker cron...');
  try {
    const now = new Date();
    const expiredSubscriptions = await userSubscriptionModel.find({
      expiry_time: { $lt: now },
      status: '1',
      deleted: false,
    });
    if (expiredSubscriptions.length > 0) {
      const idsToUpdate = expiredSubscriptions.map(sub => sub._id);
      const userIds = expiredSubscriptions.map(sub => sub.user.toString());
      await userSubscriptionModel.updateMany(
        { _id: { $in: idsToUpdate } },
        { $set: { status: '0' } }
      );
      console.log(` Marked ${idsToUpdate.length} subscriptions as inactive.`);
      for (const userId of [...new Set(userIds)]) {
        const hasActive = await userSubscriptionModel.exists({
          user: userId,
          status: '1',
          deleted: false,
        });
        await userModel.updateOne(
          { _id: userId },
          { $set: { subscription_status: hasActive ? '1' : '0' } }
        );
        console.log(` User ${userId} subscription_status set to ${hasActive ? '1' : '0'}`);
      }
    } else {
      console.log(' No expired subscriptions found.');
    }

  } catch (error) {
    console.error(' Error running cron job:', error);
  }
});

module.exports = {
  addSubscriptionV1: async (req, res) => {
    try {
      const userId = req.user.id;
      const { type, duration } = req.body;

      const existingSubscription = await userSubscriptionModel.findOne({
        user: userId,
        status: '1',
        deleted: false,
      });

      if (existingSubscription) {
        if (new Date(existingSubscription.expiry_time) < new Date()) {
          console.log('🔁 Old subscription expired — marking deleted');
        }

        await userSubscriptionModel.updateOne(
          { _id: existingSubscription._id },
          { $set: { deleted: true, status: '0' } }
        );
      }

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
        deleted: false,
      });

      await userModel.updateOne(
        { _id: userId },
        { $set: { subscription_status: '1' } }
      );

      // Merge subscription data and subscription_status into one object
      const responseBody = {
        ...newSubscription.toObject(),
        subscription_status: '1',
      };

      return res.status(200).json({
        success: true,
        code: 200,
        message: 'Subscription created successfully',
        body: responseBody,
      });
    } catch (error) {
      console.error('Subscription creation error:', error);
      return res.status(500).json({
        success: false,
        code: 500,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  },
  addSubscription: async (req, res) => {
    try {
      const userId = req.user.id;
      const { type, duration, plan_type } = req.body;

      if (!plan_type) {
        return res.status(400).json({
          success: false,
          code: 400,
          message: 'Plan type is required',
        });
      }
      const existingSubscription = await userSubscriptionModel.findOne({
        user: userId,
        type,
        plan_type,
        status: '1',
        deleted: false,
      });

      if (existingSubscription) {
        return helper.failed(
          res,
          'You already have an active subscription of this type'
        );
      }
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parseInt(duration));
      const newSubscription = await userSubscriptionModel.create({
        user: userId,
        type,
        duration,
        plan_type,
        start_date: startDate,
        end_date: endDate,
        expiry_time: endDate.toISOString(),
        status: '1',
        deleted: false,
      });
      await userModel.updateOne(
        { _id: userId },
        { $set: { subscription_status: '1' } }
      );
       const responseBody = {
        ...newSubscription.toObject(),
        subscription_status: '1',
      };

      return res.status(200).json({
        success: true,
        code: 200,
        message: 'Subscription created successfully',
        body: responseBody,
      });
    } catch (error) {
      console.error('Subscription creation error:', error);
      return res.status(500).json({
        success: false,
        code: 500,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  },
};
