/**
 *    - TF_BACKEND_BUCKET - The name of the s3 bucket to use for storing Terraform state
 *    - TF_BACKEND_BUCKET_REGION - The region the bucket was deployed to
 *    - TF_BACKEND_STATE_FILE - The object key used to store state file 
 */

exports.Platform = class WingGithubActionsBackendS3 {
  postSynth(config) {
    if (!process.env.TF_BACKEND_BUCKET) {throw new Error("env var TF_BACKEND_BUCKET not set")}
    if (!process.env.TF_BACKEND_BUCKET_REGION) {throw new Error("env var TF_BACKEND_BUCKET_REGION not set")}
    if (!process.env.TF_BACKEND_STATE_FILE) {throw new Error("env var TF_BACKEND_STATE_FILE not set")}
    config.terraform.backend = {
      s3: {
        bucket: process.env.TF_BACKEND_BUCKET,
        region: process.env.TF_BACKEND_BUCKET_REGION,
        key: process.env.TF_BACKEND_STATE_FILE
      }
    }

    // Override Lambda runtime: nodejs18.x/nodejs20.x → nodejs22.x
    if (config.resource && config.resource.aws_lambda_function) {
      for (const [name, func] of Object.entries(config.resource.aws_lambda_function)) {
        if (func.runtime === "nodejs18.x" || func.runtime === "nodejs20.x") {
          console.log(`  Overrode runtime ${func.runtime} to nodejs22.x for Lambda: ${name}`);
          func.runtime = "nodejs22.x";
        }
      }
    }

    return config;
  }
}