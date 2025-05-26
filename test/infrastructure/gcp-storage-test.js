const gcp = require("@pulumi/gcp");

const bucket = new gcp.storage.Bucket("test-bucket", {
    name: `instanti8-test-bucket-${Date.now()}`,
    location: "US",
    storageClass: "STANDARD",
    labels: {
        environment: "test",
        project: "instanti8-dev",
        created_by: "pulumi"
    }
});

exports.bucketName = bucket.name;
exports.bucketUrl = bucket.url;
