const aws = require("@pulumi/aws");

const bucket = new aws.s3.Bucket("test-bucket", {
    bucket: `instanti8-test-bucket-${Date.now()}`,
    acl: "private",
    tags: {
        Environment: "test",
        Project: "Instanti8.dev",
        CreatedBy: "Pulumi"
    }
});

exports.bucketName = bucket.id;
exports.bucketArn = bucket.arn;
