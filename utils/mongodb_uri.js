exports.mongodb_uri = () => {
  if (process.env.NODE_ENV == "production") {
    return process.env.MONGODB_URI_PRODUCTION;
  } else if (process.env.NODE_ENV == "staging") {
    return process.env.MONGODB_URI_STAGING;
  }
  return process.env.MONGODB_URI;
};
