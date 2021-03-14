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

configSchema.statics.setSingleton = async function (cb) {
  try {
    const config = await this.findOne().sort({ updated: -1 }).limit(1);

    if (config) {
      cb(null, config);
    } else {
      cb(null, new Config());
    }
  } catch (error) {
    cb(error);
  }
};
configSchema.statics.getSingleton = async function () {
  const config = await this.findOne().sort({ updated: -1 }).limit(1);

  if (!config) {
    console.error('Application config could not be found. Exiting...');
    process.exit(1);
  }

  return config;
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
