const azure = require("@pulumi/azure-native");

const resourceGroup = new azure.resources.ResourceGroup("test-resource-group", {
    resourceGroupName: `instanti8-test-rg-${Date.now()}`,
    location: "eastus",
    tags: {
        Environment: "test",
        Project: "Instanti8.dev",
        CreatedBy: "Pulumi"
    }
});

exports.resourceGroupName = resourceGroup.name;
exports.resourceGroupId = resourceGroup.id;
