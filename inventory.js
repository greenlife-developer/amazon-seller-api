const AWS = require('aws-sdk');
const axios = require('axios');
const moment = require('moment');

const region = 'us-east-1';
const accessKeyId = 'AKIA6KWVU7YBYVVUHTT5';
const secretAccessKey = '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';
const sellerId = 'A12ZW5F2C6LX3M';
const authToken = 'Atza|IwEBIJIqGvdUP7Byfh4qg4j3PbvUPgmbLKE0qU8Wsr6g_86GX1Jho4zSWQTC2TdwgF2mO03mJj9F2f1SLV1i_X78EdHogmUE9lR54QGiHCylb5SQofbsgSlTleosFBsH9r1IY7-Ipivf9XeQ3ls5gTPi2EmlmWx2gfzclT7OVl20jtiyClZdqPE16xR6MTHuCvC_O8-EwWpLyPYW5V9SGtl28sAksm4_gmlioQ-Gx6S5Buc76_3N53wdhKAmugs7me1wpEuopBFhicQaEn6vROXSCUgzpnXq6osipQOuIa9O1ArG5qMYGCoXuZX0LPCZkYeL_vhZbFNus4RFBYEDrpOR42eN'; // or '<SP API Access Token>'

// var myDate = Date.now();
// var myDate = new Date("2015-06-17 14:24:36");

const apiEndpoint = 'https://sellingpartnerapi.us-east-1.amazon.com';
const date = Date.now()
const service = 'execute-api';
const path = '/inventory/2020-09-01/items';


const headers = {
    'content-type': 'application/json',
    'host': `sellingpartnerapi.${region}.amazon.com`,
    'user-agent': 'My User Agent',
    'x-amz-access-token': authToken,
    'x-amz-date': date,
    'x-amz-security-token': authToken,
};


const endpoint = new AWS.Endpoint(apiEndpoint);
const request = new AWS.HttpRequest('GET', endpoint, path);
request.headers = headers;
request.region = region;
const signer = new AWS.Signers.V4(request, service);
signer.addAuthorization(AWS.config.credentials, date);
headers.authorization = request.headers['Authorization'];


axios.get(apiEndpoint + path, {
    headers: headers,
}).then((response) => {
    console.log(response.data);
}).catch((error) => {
    console.log(error);
});
