import mongoose from 'mongoose';

const configSchema = mongoose.Schema(
  {
    taxRate: {
      type: Number,
      required: true,
    },
    freeShippingThreshold: {
      type: Number,
      required: true,
    },
    paypalClientId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

configSchema.statics.setSingleton = function (cb) {
  this.findOne()
    .sort({ updated: -1 })
    .limit(1)
    .exec(function (error, model) {
      if (error) {
        cb(error, null);
      } else if (!model) {
        cb(error, new Config());
      } else {
        cb(error, model);
      }
    });
};
configSchema.statics.getSingleton = function () {
  return this.findOne().sort({ updated: -1 }).limit(1).exec();
};

configSchema.pre('save', function (next) {
  this.model('Config').find({}, (err, docs) => {
    if (docs.length) {
      if (docs[0]._id.toString() === this._id.toString()) {
        return next();
      } else {
        return next(new Error('Document already exists'));
      }
    } else {
      next();
    }
  });
});

const Config = mongoose.model('Config', configSchema);

export default Config;
