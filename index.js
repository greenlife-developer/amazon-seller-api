require("dotenv").config({
    path: "./env_variables/.env",
});

const express = require("express");
const path = require("path");
const axios = require("axios");
const aws4 = require('aws4');
const request = require('request');

// const {aws4Interceptor} = require("aws4-axios");

const app = express();


app.use(express.json());


app.use(express.json());

const expressSession = require("cookie-session");
app.use(
    expressSession({
        key: "user_id",
        secret: "User secret object ID",
        resave: true,
        saveUninitialized: true,
    })
);

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "10000mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "10000mb",
        parameterLimit: 1000000,
    })
);


/*
    Testing
    1. You need to have any version of node.js vs code installed on your machine.
    2. Find the ".env" file in the env_variables folder 
    3. Fill all your details
    4. Find the terminal of your vs code
    5. run node --version on the terminal to be sure that your node is installed
    6. In the same terminal run "node index.js"
    7. You would get a content of the console log.
    testing completed...

*/



const asin = "B09CHK13SK"
const refresh_token = "Atzr|IwEBIH5M6uib0S46ECxrIMtOUS0XDlKqzThWc9OjQABlUVOBkn2eRpKhHODKxmzPDeLZJ9zqDzf4Q3mtTAUGZTd2Bih9vY1gPkmD5ZYZwVDsL8tAYvlCtAZjlAJ7DnaMbJGQk6GBaxBodfEqJkVr_hwzZhrYLVrVMSCJfF-GZnvRc_yWo_WCPqxuFOY_dV2sxwY318mE37_j00EHdNly2lZO-IbniGsT8psNbBfjbHFqvUiBYfgTocPtRe12_F9dwwFfHnjVGkg33To7LjQc-oJRhgIuwFFUbyvOxCHwsZIAls0ajriZi_bDM3pW5UAH6AlIPPs"
const baseUrl = "https://sellingpartnerapi-na.amazon.com";
const marketplaceId = "A2Q3Y263D00KWC";
const client_id = "amzn1.application-oa2-client.fe42ec2412364a04b0e7ac9c29b8c614";
const client_secret = "70bf4e66166fc7d120d02cfe5536fa891b5793c74d344a69c4acd18062f2c6dd";
const awsRegion = "us-east-1"
const sellerId = "A12ZW5F2C6LX3M"
const sku = "27-01-22 -AA - teste";

app.get("/", async (req, res) => {
    // Get Refresh access token when this becomes successful
    const { data } = await axios.post(`https://api.amazon.com/auth/o2/token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=refresh_token`, {}, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )


    // const config = {
    //     method: 'get',
    //     maxBodyLength: Infinity,
    //     url: `https://sts.${awsRegion}.amazonaws.com?Version=2011-06-15&Action=AssumeRole&RoleArn=arn:aws:iam::985069321731:role/funcao_seller&DurationSeconds=3600&RoleSessionName=AmazonSeller24`,
    //     headers: {
    //         'X-Amz-Date': '20230306T171324Z',
    //         'Authorization': 'AWS4-HMAC-SHA256 Credential=AKIA6KWVU7YBYVVUHTT5/20230306/us-east-1/sts/aws4_request, SignedHeaders=host;x-amz-date, Signature=b1c4efa396f527a2f92024fd0af941f4e2097a25f3b9072a14f601770ae20c77'
    //     }
    // };

    // // Teste - session token
    // axios(config)
    //     .then(function (token) {
    //         res.json({
    //             "token": token.data,
    //             "data": data,
    //             // "intercept": interceptor
    //         })
    //     })
    //     .catch(function (error) {
    //         res.json({
    //             "token": "This has an error: ", error,
    //             "data": data,
    //             // "intercept": interceptor.call()
    //         })
    //     });

    // console.log(token)



})


app.get("/catelogue-item", async (req, res) => {

    const { data } = await axios.post(`https://api.amazon.com/auth/o2/token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=refresh_token`, {}, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )

    console.log(data.access_token)

    var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://sellingpartnerapi-na.amazon.com/catalog/2022-04-01/items/B09CHK13SK?marketplaceIds=A2Q3Y263D00KWC&includedData=summaries,attributes,dimensions,identifiers,images,productTypes,relationships,salesRanks',
        headers: {
            'Accept': 'application/json',
            'x-amz-access-token': 'Atza|IwEBIKFeGTsf5Hv7_0ZDNVWJkK8EUklMBuXxPDGWroaGmAdnuEvYJTcXW1MCu-O8wNpYklEJx-k8krYE10PneIdxBEX5bqeLgDnR0HhAq2T271hK6eEBoVe_MOpr_4Y7ydyEdXF8qRddESoPOWtP3a7dfHOFoQP1uIyo9aIuffNrtZUXx4cACu0VId7R1ytjs_lc2EDgp9cg1ufSyqoL596hzmdT8G2BKz04zBDL_LO2IMTOrKNw_axAZNclM3wdl6bgsNK1YUQ3Hg-IkMzBbAAD-yNvMAnLH2FcPvxLwsSLkmdrCuI_tKs2RRjX_7dL5SKHbf5kj8nkV4jlBOgY0hQ6zcWt',
            'X-Amz-Security-Token': 'IQoJb3JpZ2luX2VjEHMaCXVzLWVhc3QtMSJHMEUCIFOr8AvG641c8MNPJIpvk35DXh390WBG4EDGf6tQyib7AiEAhog3zt3w717v4tlBSsvVQwiVueJfbKKsAL7BKZqv5KMqmwIILBAAGgw5ODUwNjkzMjE3MzEiDGgF/QWnwtYfWou/Byr4AaUbCndd2ypNSkIGRXC0eFOFQ2l5YqMkOo7fnGBFS/8Qmuo9aEphV630Jx7vkzk37jL8hI1Bwt/IuApZ/eoed+eGA5E229l/K/h4tOmrgf2QwtQFWGasPokaj3bMBjIWZsbcWppytQSjYpCgybyuLBmH4N5REDRF8ooo4yA0m52dlfBDoiAGcwx58j9IOioLNa2PcPov2BYTKJDiviIkN6srjNcHrxhKvXjEsCn3cmR0bkT3uzGDwOLYZzspZzzOGk2nBG5njovInaFf1Zm53jw4SaJdbnBU/ZYmLXw4CNLNXEbnqCSSM+MMavd8RavO3P/TDRy0P+2sMLynnKAGOp0BPHpw4HdzrkBQ1bs6ltWPp8UtRp+aOK3wRigcpr+/ufNNdz5wVnQrZPNe8AflTGE+91OCjha+XaBwC55KBL3I2C4sKpBFY2dd9rYn7o0ncqnbpl5Vbg6tnmvA4ZrZh55abfzt73ucw8Wyo+A7Qu+vpMjA1H2WDjU61KkRbBU3TFTBkVeLUNxe+FV6M4KnJtPVxp2rqTWQ07x19TEzAw==',
            'X-Amz-Date': '20230307T104606Z',
            'Authorization': 'AWS4-HMAC-SHA256 Credential=ASIA6KWVU7YB5RNBY35X/20230307/us-east-1/execute-api/aws4_request, SignedHeaders=accept;host;x-amz-access-token;x-amz-date;x-amz-security-token, Signature=2109397f5b16994cf300b8af7dfcf036e46cd0e1438ad3834fa9989a4ac1d011'
        }
    };

    axios(config)
        .then(function (response) {
            res.json({
                "token": response.data,
                // "data": data
            })
        })
        .catch(function (error) {
            res.json({
                "token": "This has an error: ", error,
                // "data": data
            })
        });

})

app.get("/list-inventory", async(req, res) => {
    const { HttpRequest } = require("@aws-sdk/protocol-http");
    const { defaultProvider } = require("@aws-sdk/credential-provider-node");
    const { SignatureV4 } = require("@aws-sdk/signature-v4");
    const { NodeHttpHandler } = require("@aws-sdk/node-http-handler");
    const { Sha256 } = require("@aws-crypto/sha256-browser");

    var request = new HttpRequest({
        body: JSON.stringify({ "users": ["G0000000B", "G0000000A"] }),
        headers: {
            'Content-Type': 'application/json',
            'apiKey': 'XXXXXXXXXXXX',
            'apiSecret': 'XXXXXXXXXXXXXXXXXX',
            'host': 'service2.xxx.xxx.xx'
        },
        hostname: 'service2.xxx.xxx.xx',
        method: 'POST',
        path: 'API/user/list'
    });

    var signer = new SignatureV4({
        credentials: defaultProvider(),
        region: 'ap-southeast-1',
        service: 'execute-api',
        sha256: Sha256
    });

    const signedRequest = await signer.sign(request);

    // Send the request
    var client = new NodeHttpHandler();
    var { response } = await client.handle(signedRequest)
    console.log(response.statusCode + ' ' + response.body.statusMessage);
    var responseBody = '';
    await new Promise(() => {
        response.body.on('data', (chunk) => {
            responseBody += chunk;
        });
        response.body.on('end', () => {
            console.log('Response body: ' + responseBody);
        });
    }).catch((error) => {
        console.log('Error: ' + error);
    });

})



const PORT = process.env.PORT || 5050

app.listen(PORT, () => {
    console.log("Server has started on port", PORT)
})




// const amazon_sp_authorization_header = {
//     'Content-Type': 'application/json',
//     'x-amz-security-token': '<YOUR_AWS_SECURITY_TOKEN>',
//     'Authorization': `AWS4-HMAC-SHA256 Credential=<YOUR_AWS_ACCESS_KEY_ID>/<DATE>/<REGION>/execute-api/aws4_request, SignedHeaders=host;x-amz-date;x-amz-security-token, Signature=<YOUR_SIGNATURE>`
//   };

// const crypto = require('crypto');
// const AWS_SECRET_KEY = '<YOUR_AWS_SECRET_ACCESS_KEY>'; 

// function generateSignature(requestParams) {
//     const queryString = Object.keys(requestParams)
//         .filter(key => key !== 'Signature')
//         .sort()
//         .map(key => `${key}=${encodeURIComponent(requestParams[key])}`)
//         .join('&');

//     const stringToSign = `GET\nwebservices.amazon.com\n/onca/xml\n${queryString}`;

//     const hmac = crypto.createHmac('sha256', AWS_SECRET_KEY);
//     return hmac.update(stringToSign).digest('base64');
// }

// module.exports = {
//     generateSignature
// };