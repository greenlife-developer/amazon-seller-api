require("dotenv").config({
    path: "./env_variables/.env",
});

const express = require("express");
const path = require("path");
const axios = require("axios");
const aws4 = require('aws4');
const os = require('os');
const SellingPartner = require("./index")

// const request = require('request');

// require('lightrun').start({
//     lightrunSecret: '2972e328-f03d-4400-8d67-bd6c8a6cb83e',
// });

const crypto = require('crypto');
// const {aws4Interceptor} = require("aws4-axios");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { NodeHttpHandler } = require("@aws-sdk/node-http-handler");
const { Sha256 } = require("@aws-crypto/sha256-browser");

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



const asin = "B09CHK13SK";
const refresh_token = "Atzr|IwEBIH5M6uib0S46ECxrIMtOUS0XDlKqzThWc9OjQABlUVOBkn2eRpKhHODKxmzPDeLZJ9zqDzf4Q3mtTAUGZTd2Bih9vY1gPkmD5ZYZwVDsL8tAYvlCtAZjlAJ7DnaMbJGQk6GBaxBodfEqJkVr_hwzZhrYLVrVMSCJfF-GZnvRc_yWo_WCPqxuFOY_dV2sxwY318mE37_j00EHdNly2lZO-IbniGsT8psNbBfjbHFqvUiBYfgTocPtRe12_F9dwwFfHnjVGkg33To7LjQc-oJRhgIuwFFUbyvOxCHwsZIAls0ajriZi_bDM3pW5UAH6AlIPPs"
const baseUrl = "https://sellingpartnerapi-na.amazon.com";
const marketplaceId = "A2Q3Y263D00KWC";
const client_id = "amzn1.application-oa2-client.fe42ec2412364a04b0e7ac9c29b8c614";
const client_secret = "70bf4e66166fc7d120d02cfe5536fa891b5793c74d344a69c4acd18062f2c6dd";
const awsRegion = "us-east-1";
const sellerId = "A12ZW5F2C6LX3M";
const sku = "27-01-22 -AA - teste";

// const AWS_SECRET_KEY = '/H3UTQGVVIgLTlCriFHiF1WWvhbq5lsGMuyY/D33';

async function accessToken() {
    const { data } = await axios.post(`https://api.amazon.com/auth/o2/token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=refresh_token`, {}, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )

    return data
}

const req_params = {
    // operation: '<OPERATION_TO_CALL>', // Optional: The operation you want to request. May also include endpoint as shorthand dot notation. Required if "api_path" is not defined.
    // endpoint: '<ENDPOINT_OF_OPERATION>', // Optional: The endpoint of the operation. Required if endpoint is not part of operation as shorthand dot notation and if "api_path" is not defined.
    path: { // Optional: The input paramaters added to the path of the operation.

    },
    query: { // Optional: The input paramaters added to the query string of the operation.

    },
    body: { // Optional: The input paramaters added to the body of the operation.

    },
    // api_path: '<FULL_PATH_OF_OPERATION>', // Optional: The full path of an operation. Required if "operation" is not defined.
    method: 'GET', // The HTTP method to use. Required only if "api_path" is defined. Must be one of: "GET", "POST", "PUT", "DELETE" or "PATCH".
    restricted_data_token: '<RESTRICTED_DATA_TOKEN>', // Optional: A token received from a "createRestrictedDataToken" operation for receiving PII from a restricted operation.
    options: {
        version: '<OPERATION_ENDPOINT_VERSION>', // Optional: The endpoint’s version that should be used when calling the operation. Will be preferred over an "endpoints_versions" setting.
        restore_rate: '<RESTORE_RATE_IN_SECONDS>', // Optional: The restore rate (in seconds) that should be used when calling the operation. Will be preferred over the default restore rate of the operation.
        raw_result: false // Whether or not the client should return the "raw" result, which will include the raw body, buffer chunks, statuscode and headers of the result.
    }
}

// accessToken()

const config = {
    region: 'na', // Required: The region to use for the SP-API endpoints. Must be one of: "eu", "na" or "fe"
    refresh_token: "Atzr|IwEBIH5M6uib0S46ECxrIMtOUS0XDlKqzThWc9OjQABlUVOBkn2eRpKhHODKxmzPDeLZJ9zqDzf4Q3mtTAUGZTd2Bih9vY1gPkmD5ZYZwVDsL8tAYvlCtAZjlAJ7DnaMbJGQk6GBaxBodfEqJkVr_hwzZhrYLVrVMSCJfF-GZnvRc_yWo_WCPqxuFOY_dV2sxwY318mE37_j00EHdNly2lZO-IbniGsT8psNbBfjbHFqvUiBYfgTocPtRe12_F9dwwFfHnjVGkg33To7LjQc-oJRhgIuwFFUbyvOxCHwsZIAls0ajriZi_bDM3pW5UAH6AlIPPs", // Optional: The refresh token of your app user. Required if "only_grantless_operations" option is set to "false".
    // access_token: 'Atza|IwEBINgX28iJnbPMohHtjWUO9FDS2iYENl_N3UFRzuwZdQmuHqqX8ahMbFz5jPjaLQAgTQSwSO1jhfsRzfO5-mTacEe3UToPVn8INv1eJ-jQf1PbCotIPpTSOWbtPm4DT-dUKVn0MxS12XnPOpx0qFIZ0WgFJ2uRp_TkBTHF_5D37aJ0Msr9U28dx04nBe0IJaNSTaTReoMVy20KbrvATthyw1vOgeGpUiQo5wK7oFKk5IbCFMGP9zinnwGmayoj7axyit9wnbx9BVKAzjZ-nviRo2vU0aXmlVw0CxGMWsJ_1_sAhAm-DAnOVo9SQpXUdIBy9BbeBkkzYTJ5yMHUpbS2Yo_epxKIih14hgBdC_W6PJVAhA', // Optional: The temporary access token requested with the refresh token of the app user.
    // role_credentials: { // Optional: The temporary role credentials for the sellingpartner api role of the iam user.
    //     id: '<TEMPORARY_ROLE_ACCESS_ID>', 
    //     secret: '<TEMPORARY_ROLE_ACCESS_SECRET>',
    //     security_token: '<TEMPORARY_ROLE_SECURITY_TOKEN>'
    // },
    endpoints_versions: { // Optional: Defines the version to use for an endpoint as key/value pairs, i.e. "reports":"2021-06-30".
        "reports": "2021-06-30"
    },
    credentials: { // Optional: The app client and aws user credentials. Should only be used if you have no means of using environment vars or credentials file!
        SELLING_PARTNER_APP_CLIENT_ID: process.env.SELLING_PARTNER_APP_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: 'arn:aws:iam::985069321731:role/funcao_seller'
    },
    options: {
        credentials_path: '~/.amzspapi/credentials', // Optional: A custom absolute path to your credentials file location.
        auto_request_tokens: true, // Optional: Whether or not the client should retrieve new access and role credentials if non given or expired.
        auto_request_throttled: true, // Optional: Whether or not the client should automatically retry a request when throttled.
        version_fallback: true, // Optional: Whether or not the client should try to use an older version of an endpoint if the operation is not defined for the desired version.
        use_sandbox: false, // Optional: Whether or not to use the sandbox endpoint.
        only_grantless_operations: false, // Optional: Whether or not to only use grantless operations.
        user_agent: `amazon-sp-api/2012-10-17 (Language=Node.js/v18.12.1; Platform=${os.platform()}/${os.release()})`, // A custom user-agent header.
        debug_log: false, // Optional: Whether or not the client should print console logs for debugging purposes.
        timeouts: {
            response: 0, // Optional: The time in milliseconds until a response timeout is fired (time between starting the request and receiving the first byte of the response). 
            idle: 0, // Optional: The time in milliseconds until an idle timeout is fired (time between receiving the last chunk and receiving the next chunk). 
            deadline: 0 // Optional: The time in milliseconds until a deadline timeout is fired (time between starting the request and receiving the full response). 
        }
    }
}

let sellingPartner = new SellingPartner(config);


app.get("/", async (req, res) => {
    res.json({
        "endpoints": sellingPartner.endpoints
    })
})


app.get("/listing-items", async (req, res) => {
    try {
        let response = await sellingPartner.callAPI({
            operation: 'getListingsItem',
            endpoint: "listingsItems",
            path: {
                sellerId: "A12ZW5F2C6LX3M",
                sku: sku
            },
            query: {
                marketplaceIds: "A2Q3Y263D00KWC"
            }

        });

        res.json({
            "payload": response
        })
    } catch (e) {
        res.json({
            "error": e
        })
    }


})

app.get("/catalogue-item", async (req, res) => {
    try {
        let response = await sellingPartner.callAPI({
            operation: 'getCatalogItem',
            endpoint: 'catalogItems',
            path: {
                asin: asin
            },
            query: {
                marketplaceIds: "A2Q3Y263D00KWC"
            },
            options: {
                "v0": {},
                "2020-12-01": {},
                "2022-04-01": {}
            }

        });

        res.json({
            "payload": response
        })
    } catch (e) {
        console.log(e)
    }

})


app.get("/pricing", async (req, res) => {
    try {

        let response = await sellingPartner.callAPI({
            operation: 'getMyFeesEstimateForSKU',
            endpoint: 'productFees',
            path: {
                SellerSKU: sku
            },
            body: {
                FeesEstimateRequest: {
                    MarketplaceId: marketplaceId,
                    Identifier: sku,
                    PriceToEstimateFees: {
                        ListingPrice: {
                            CurrencyCode: 'USD',
                            Amount: 19.99
                        }
                    }
                }
            }
        });

        res.json({
            "payload": response
        })
    } catch (e) {
        console.log(e)
    }

})


app.get("/item-offers", async (req, res) => {
    try {

        let response = await sellingPartner.callAPI({
            operation: 'getMyFeesEstimateForSKU',
            endpoint: 'productFees',
            path: {
                SellerSKU: sku
            },
            body: {
                FeesEstimateRequest: {
                    MarketplaceId: marketplaceId,
                    Identifier: sku,
                    PriceToEstimateFees: {
                        ListingPrice: {
                            CurrencyCode: 'USD',
                            Amount: 19.99
                        }
                    }
                }
            }
        });

        res.json({
            "payload": response
        })
    } catch (e) {
        console.log(e)
    }

})



const PORT = process.env.PORT || 5050

app.listen(PORT, () => {
    console.log("Server has started on port", PORT)
}) 