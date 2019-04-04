'use strict';
var role = '${UserRoleArn}'; // The user will be authenticated if and only if the Role field is not blank
var AWS = require('aws-sdk'), region = "us-east-1", secretName = '${AWSSecret}', secret;
var client = new AWS.SecretsManager({region: region});

exports.handler = (event, context, callback) => {
  var response;
  console.log("Event:", JSON.stringify(event));

  client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {throw err}
    else {
      secret = JSON.parse(data.SecretString);
    }

    if (event.serverId !== "") {
      response = {
        Role: role,
        HomeDirectory: secret[event.username]["home"]
      };

      if (event.password !== secret[event.username]["password"]) {
        response = {};
      }
    } else {
      response = {};
    }

    console.log("Response:", JSON.stringify(response));
    callback(null, response);
  });
};
