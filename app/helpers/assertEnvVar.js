const assertRequiredEnvVar = (envName) => {
  if (envName in process.env && !!process.env[envName]) {
    return process.env[envName];
  }
  throw new Error(`Required environment variable "${envName}" is not set`);
};

module.exports = {
  assertRequiredEnvVar,
};
