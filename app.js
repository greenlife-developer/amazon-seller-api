const express = require("express");
const axios = require("axios");
const moment = require('moment');
const os = require('os');
const SellingPartner = require("./index")

// const request = require('request');

// require('lightrun').start({
//     lightrunSecret: '2972e328-f03d-4400-8d67-bd6c8a6cb83e',
// });

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
const marketplaceId = "A2Q3Y263D00KWC";
const client_id = "amzn1.application-oa2-client.fe42ec2412364a04b0e7ac9c29b8c614";
const client_secret = "70bf4e66166fc7d120d02cfe5536fa891b5793c74d344a69c4acd18062f2c6dd";
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

const config = {
    region: 'na', // Required: The region to use for the SP-API endpoints. Must be one of: "eu", "na" or "fe"
    refresh_token: "Atzr|IwEBIH5M6uib0S46ECxrIMtOUS0XDlKqzThWc9OjQABlUVOBkn2eRpKhHODKxmzPDeLZJ9zqDzf4Q3mtTAUGZTd2Bih9vY1gPkmD5ZYZwVDsL8tAYvlCtAZjlAJ7DnaMbJGQk6GBaxBodfEqJkVr_hwzZhrYLVrVMSCJfF-GZnvRc_yWo_WCPqxuFOY_dV2sxwY318mE37_j00EHdNly2lZO-IbniGsT8psNbBfjbHFqvUiBYfgTocPtRe12_F9dwwFfHnjVGkg33To7LjQc-oJRhgIuwFFUbyvOxCHwsZIAls0ajriZi_bDM3pW5UAH6AlIPPs", // Optional: The refresh token of your app user. Required if "only_grantless_operations" option is set to "false".
    endpoints_versions: { // Optional: Defines the version to use for an endpoint as key/value pairs, i.e. "reports":"2021-06-30".
        "reports": "2021-06-30"
    },
    credentials: { // Optional: The app client and aws user credentials. Should only be used if you have no means of using environment vars or credentials file!
        SELLING_PARTNER_APP_CLIENT_ID: "amzn1.application-oa2-client.fe42ec2412364a04b0e7ac9c29b8c614",
        SELLING_PARTNER_APP_CLIENT_SECRET: "70bf4e66166fc7d120d02cfe5536fa891b5793c74d344a69c4acd18062f2c6dd",
        AWS_ACCESS_KEY_ID: "AKIA6KWVU7YBYVVUHTT5",
        AWS_SECRET_ACCESS_KEY: "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",
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
                marketplaceIds: [marketplaceId],
                includedData: ['identifiers', 'images', 'productTypes', 'salesRanks', 'summaries', 'variations']
            },
            options: {
                version: '2020-12-01'
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

        let getPricing = await sellingPartner.callAPI({
            operation: 'getPricing',
            endpoint: "productPricing",
            query: {
                MarketplaceId: marketplaceId,
                Asins: asin,
                ItemType: 'Asin'
            }
        });

        let competitivePricing = await sellingPartner.callAPI({
            operation: 'getCompetitivePricing',
            endpoint: "productPricing",
            query: {
                MarketplaceId: marketplaceId,
                Asins: asin,
                ItemType: 'Asin'
            }
        });

        let offers = await sellingPartner.callAPI({
            operation: 'getItemOffers',
            endpoint: "productPricing",
            path: {
                Asin: asin
            },
            query: {
                MarketplaceId: marketplaceId,
                ItemCondition: 'New'
            }
        });

        res.json({
            "payload": {
                "getPricing": getPricing,
                "competitivePricing": competitivePricing,
                "itemOffers": offers
            }
        })
    } catch (e) {
        console.log(e)
    }

})

app.get("/inventory", async (req, res) => {
    try {

        let response = await sellingPartner.callAPI({
            operation: 'getInventorySummaries',
            endpoint: "fbaInventory",
            query: {
                details: true,
                sellerSkus: [sku],
                granularityType: 'Marketplace',
                granularityId: marketplaceId,
                marketplaceIds: [marketplaceId]
            }
        });

        res.json({
            "payload": response
        })
    } catch (e) {
        console.log(e)
    }

})


app.get("/pull-orders/:orderId", async (req, res) => {
    const orderId = req.params.orderId
    try {
        let orders = await sellingPartner.callAPI({
            operation: 'getOrders',
            endpoint: 'orders',
            query: {
                MarketplaceIds: marketplaceId,
                CreatedBefore: moment().startOf('day').toISOString(),
                CreatedAfter: moment().startOf('day').subtract(1, 'month').toISOString()
            }
        });

        let order = await sellingPartner.callAPI({
            operation: 'getOrderBuyerInfo',
            endpoint: "orders",
            path: {
                orderId: orderId
            }
        });

        res.json({
            "payload": {
                "orders": orders,
                "order": order
            }
        })
    } catch (e) {
        console.log(e)
    }

})

app.get("/product-fees-for-asin", async (req, res) => {
    try {

        let response = await sellingPartner.callAPI({
            operation: 'getMyFeesEstimateForASIN',
            endpoint: "productFees",
            path: {
                Asin: asin
            },
            body: {
                FeesEstimateRequest: {
                    MarketplaceId: marketplaceId,
                    Identifier: asin,
                    PriceToEstimateFees: {
                        ListingPrice: {
                            CurrencyCode: "USD",
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

app.get("/messaging/:orderId", async (req, res) => {
    const orderId = req.params.orderId
    try {
        let response = await sellingPartner.callAPI({
            operation: 'getMessagingActionsForOrder',
            endpoint: "messaging",
            path: {
                amazonOrderId: orderId
            },
            query: {
                marketplaceIds: marketplaceId
            }
        });

        let orderAttributes = await sellingPartner.callAPI({
            operation: 'GetAttributes',
            endpoint: "messaging",
            path: {
                amazonOrderId: orderId
            },
            query: {
                marketplaceIds: marketplaceId
            }
        })

        res.json({
            "payload": {
                "messageType": response,
                "messageAttribute": orderAttributes
            }
        })
    } catch (e) {
        console.log(e)
    }

})


app.get("/finances", async (req, res) => {
    try {
        let response = await sellingPartner.callAPI({
            operation: 'listFinancialEventGroups',
            endpoint: "finances",
            query: {
                FinancialEventGroupStartedBefore: moment().startOf('day').toISOString(),
                FinancialEventGroupStartedAfter: moment().startOf('day').subtract(2, 'months').toISOString()
            }
        });

        // let orderAttributes = await sellingPartner.callAPI({

        // })

        res.json({
            "payload": {
                "messageType": response,
                // "messageAttribute": orderAttributes
            }
        })
    } catch (e) {
        console.log(e)
    }

})



const PORT = process.env.PORT || 5050

app.listen(PORT, () => {
    console.log("Server has started on port", PORT)
}) 