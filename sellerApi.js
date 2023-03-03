require("dotenv").config({
    path: "./env_variables/.env",
});

const SellingPartnerAPI = require('amazon-sp-api');

// Please locate a ".env" file and fill this with all your informations
const credentials = {
    region: process.env.REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
    role_arn: process.env.ROLE_ARN,
    client_secret: process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
    client_id: process.env.SELLING_PARTNER_APP_CLIENT_ID,
    role_session_name: process.env.ROLE_SESSION_NAME,
    marketplaceId: process.env.MARKET_PLACE_ID,
    sellerId: process.env.SELLER_ID,
    sku: process.env.PRODUCT_SKU,
    endpoint: 'https://sellingpartnerapi.us-east-1.amazon.com'
};
const sellingPartner = new SellingPartnerAPI(credentials);


/*
    All that's needed for INVENTORY to be working is updated here...
*/

async function listInventory() {
    // const SellingPartnerAPI = require('amazon-sp-api');
    const sellingPartner = new SellingPartnerAPI({
        region: 'na', // replace with your marketplace region
        refresh_token: 'YOUR_REFRESH_TOKEN',
        access_token: 'YOUR_ACCESS_TOKEN',
        client_id: 'YOUR_CLIENT_ID',
        client_secret: 'YOUR_CLIENT_SECRET',
        role_credentials: {
            // replace with your role credentials
            role_arn: 'YOUR_ROLE_ARN',
            role_session_name: 'YOUR_ROLE_SESSION_NAME',
            region: 'na', // replace with your marketplace region
            access_token: 'YOUR_ACCESS_TOKEN',
            secret_key: 'YOUR_SECRET_KEY',
            session_token: 'YOUR_SESSION_TOKEN',
        }
    });

    const catalogItemsParams = {
        MarketplaceId: 'YOUR_MARKETPLACE_ID', // replace with your marketplace ID
        Query: 'marketplaceIds:{YOUR_MARKETPLACE_ID}', // replace with your marketplace ID
        IncludedData: ['Identifiers'],
        // add any other optional parameters, such as Pagination
    };

    sellingPartner.catalogItems.getCatalogItems(catalogItemsParams, (error, data) => {
        if (error) {
            console.error(error);
        } else {
            console.log(data.CatalogItems);
        }
    });


}

// const asin = 'B01B6OTTIM'; // replace with the ASIN of the item you want to find a deal for

function listDeal(asin) {
    // const spapi = require('amazon-spapi');

    const sellingPartner = new SellingPartnerAPI.SellingPartnerAPI({
        region: process.env.REGION, // replace with your region
        refresh_token: 'Atza|IwEBICtsMYZi6B1xRBZrl6n0F8GTDz-intfmA12A-f_jny7BG1yHa5dU120T102fZHqLHUuWl3tIRmVAv7DL-3E622MtCGM0De9QaomNalXagheopbbkXVwpqnYxgW15v_d-MjgZoEGrj69RIhDIlW-o_J-WEFA-dhYQii77O5tktZ6bueXbxsCiZljMH8hGJDTLYdMKF4SRL6WNyD2YinlyRQijynbtYqls0bcLI5I7lP0N18n9YGBZ4Sky2_wW-5XFyRGtIBr3nGOnobtYZI0fMVv9iESQb2OgnP4qQW82xaR0EhxRuxWlItJSr1e_3Rz0_M1vCc7rMz_caZFu5F9y_E7a',
        options: {
            clientId: process.env.CLIENT_SECRET,
            clientSecret: process.env.CLIENT_ID,
            refreshToken: 'Atza|IwEBICtsMYZi6B1xRBZrl6n0F8GTDz-intfmA12A-f_jny7BG1yHa5dU120T102fZHqLHUuWl3tIRmVAv7DL-3E622MtCGM0De9QaomNalXagheopbbkXVwpqnYxgW15v_d-MjgZoEGrj69RIhDIlW-o_J-WEFA-dhYQii77O5tktZ6bueXbxsCiZljMH8hGJDTLYdMKF4SRL6WNyD2YinlyRQijynbtYqls0bcLI5I7lP0N18n9YGBZ4Sky2_wW-5XFyRGtIBr3nGOnobtYZI0fMVv9iESQb2OgnP4qQW82xaR0EhxRuxWlItJSr1e_3Rz0_M1vCc7rMz_caZFu5F9y_E7a',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            role: 'your_aws_role_arn_here',
        }
    });

    const params = {
        deal: {
            deal_name: 'My Deal Name',
            start_time: '2023-03-01T00:00:00Z',
            end_time: '2023-03-31T23:59:59Z',
            deal_description: 'My Deal Description',
            deal_type: 'LIGHTNING_DEAL',
            product_type: 'REGULAR',
            listings: [
                {
                    asin: asin,
                    quantity: 10
                }
            ]
        }
    };

    sellingPartner.createDeal(params)
    .then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    });


    sellingPartner.getDeal({ deal_id: response.deal_id })
    .then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    });

}

function deleteItem() {
    const deleteItemParams = {
        MarketplaceId: credentials.marketplaceId,
        SellerSKU: credentials.sku
    };

    sellingPartner.deleteProduct(deleteItemParams, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
}

function updateItem(itemId) {

    // Set up the item details you want to update
    const updatedPrice = '10.99';
    const updatedQuantity = 50;

    // Instantiate the SpApi client and authorize it with your credentials
    const spApi = new SellingPartnerAPI({
        region: credentials.region,
        credentials: {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            sessionToken: credentials.refresh_token,
        },
        options: {
            sellerId: credentials.sellerId,
            roleArn: credentials.role_arn,
            roleSessionName: credentials.role_session_name,
        },
    });

    // Update the item
    spApi.products.updateMarketplaceParticipations({
        MarketplaceIds: [credentials.marketplaceId],
        Items: [
            {
                SellerSKU: credentials.sku,
                Price: {
                    ListingPrice: {
                        Amount: updatedPrice,
                        CurrencyCode: 'USD',
                    },
                },
                Quantity: updatedQuantity,
            },
        ],
    }).then((response) => {
        console.log('Successfully updated item:', response);
    }).catch((error) => {
        console.error('Error updating item:', error);
    });

}

function pullProductInformation() {

    // Instantiate the SpApi client and authorize it with your credentials
    const spApi = new SellingPartnerAPI({
        region: credentials.region,
        credentials: {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            sessionToken: credentials.refresh_token,
        },
        options: {
            sellerId: credentials.sellerId,
            roleArn: credentials.role_arn,
            roleSessionName: credentials.role_session_name,
        },
    });

    // Retrieve the product information
    spApi.catalog.getItemBySellerSKU({
        MarketplaceId: credentials.marketplaceId,
        SellerSKU: credentials.sku,
    }).then((response) => {
        console.log('Successfully retrieved product information:', response);
    }).catch((error) => {
        console.error('Error retrieving product information:', error);
    });

}


/*
    All that's needed for INVENTORY to be working is updated here...
*/



/*
    All that's needed for ORDERS to be working is updated here...
*/

function pullOrdersList() {

    // Instantiate the SpApi client and authorize it with your credentials
    const spApi = new SellingPartnerAPI({
        region: credentials.region,
        credentials: {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            sessionToken: credentials.refresh_token,
        },
        options: {
            sellerId: credentials.sellerId,
            roleArn: credentials.role_arn,
            roleSessionName: credentials.role_session_name,
        },
    });

    // Set up parameters for the order list request
    const queryParams = {
        MarketplaceIds: [credentials.marketplaceId],
        MaxResultsPerPage: 100,
        CreatedAfter: new Date('2022-01-01T00:00:00Z'),
    };

    // Pull the list of orders
    spApi.orders.listOrders(queryParams).then((response) => {
        console.log('Successfully retrieved order list:', response);
    }).catch((error) => {
        console.error('Error retrieving order list:', error);
    });

}



// This function will require you put the id of the client, secret and order-item-code
function pullOrderInformation(clientId, clientSecret, orderItemCode) {

    // Set up the Selling Partner API client
    const sellingPartner = new SellingPartnerAPI({
        region: credentials.region,
        refresh_token: credentials.refresh_token,
        access_token: credentials.access_token,
        client_id: clientId,
        client_secret: clientSecret,
    });

    // Define the endpoint and parameters for the order items API request
    const endpoint = '/orders/v0/orderItems';
    const params = {
        MarketplaceIds: credentials.marketplaceId,
        AmazonOrderItemCode: orderItemCode,
    };

    // Send the API request
    sellingPartner.callAPI({
        endpoint,
        method: 'GET',
        query: params,
    }).then((response) => {
        console.log("This is the details of your order", response);
    }).catch((error) => {
        console.log("There was an error getting a respose from the server", error);
    });

}





/*
    All that's needed for ORDERS to be working is updated here...
*/




/*
    All that's needed for FINANCIAL to be working is updated here...
*/

function listFinancialEventGroups() {

    const params = {
        marketplaceIds: credentials.marketplaceId,
    };

    sellingPartner.finances.listFinancialEventGroups(params)
        .then((response) => {
            console.log(response.data.payload);
        })
        .catch((err) => {
            console.log(err);
        });

}


function pullGeneralInformation() {

    const params = {
        granularity: 'Hour',
        metrics: 'Sessions,PageViews',
    };

    // You may change the string for 'reportType' and the dates depending on your needs
    sellingPartner.reports.getReports({
        reportType: 'GET_FLAT_FILE_OPEN_LISTINGS_DATA',
        marketplaceIds: credentials.marketplaceId,
        startDate: '2022-02-01T00:00:00+00:00',
        endDate: '2022-02-07T23:59:59+00:00',
    })
        .then((response) => {
            console.log(response.data);
        })
        .catch((err) => {
            console.log(err);
        });

}

/*
    All that's needed for FINANCIAL to be working is updated here...
*/


/*
    All that's needed for MESSAGING to be working is updated here...
*/

function createConfirmOrderDetails(orderItemId) {

    const data = {
        marketplaceId: credentials.marketplaceId,
        shippingSpeedCategories: ['Expedited'],
        items: [
            {
                orderItemId: orderItemId,
                quantity: 1,
            },
        ],
    };

    sellingPartner.orders.createOrder({
        data: data,
    })
        .then((response) => {
            console.log(response.data);
        })
        .catch((err) => {
            console.log(err);
        });

}

function createdUnexpectedProblem() {

    const data = {
        text: 'Unexpected problem',
        attachments: [
            {
                title: 'Error heading',
                text: 'Error message',
                fallback: 'Error details',
            },
        ],
    };

    sellingPartner.notifications.createUnexpectedProblem({
        data: data,
    })
        .then((response) => {
            console.log(response.data);
        })
        .catch((err) => {
            console.log(err);
        });

}

/*
    All that's needed for MESSAGING to be working is updated here...
*/



/*
    All that's needed for PRODUCT FEES to be working is updated here...
*/

function getMyFeesEstimateForAsin(asin) {

    const data = {
        MarketplaceId: credentials.marketplaceId,
        Items: [
            {
                ASIN: asin,
                Quantity: 1,
                Price: {
                    ListingPrice: {
                        Amount: 10.00,
                        CurrencyCode: 'USD',
                    },
                },
            },
        ],
        Identifier: 'ASIN',
        IsAmazonFulfilled: true,
    };

    sellingPartner.fees.getMyFeesEstimateForSKU({
        data: data,
    })
        .then((response) => {
            console.log(response.data);
        })
        .catch((err) => {
            console.log(err);
        });


}

/*
    All that's needed for PRODUCT FEES to be working is updated here...
*/



/*
    All that's needed for PRODUCTS PRICING to be working is updated here...
*/

function getCompetitivePricing(asin) {

    const data = {
        MarketplaceId: credentials.marketplaceId,
        ItemType: 'ASIN',
        ItemValue: asin,
    };

    sellingPartner.products.getPricing({
        data: data,
    })
        .then((response) => {
            console.log(response.data);
        })
        .catch((err) => {
            console.log(err);
        });

}

function getItemOffers(asin) {

    const data = {
        MarketplaceId: credentials.marketplaceId,
        ASIN: asin,
    };

    sellingPartner.products.getItemOffers({
        data: data,
    })
        .then((response) => {
            console.log(response.data);
        })
        .catch((err) => {
            console.log(err);
        });

}
function getPricing(asin) {

    const data = {
        MarketplaceId: credentials.marketplaceId,
        ItemType: 'ASIN',
        ItemValue: asin,
    };

    sellingPartner.products.getPricing({
        data: data,
    })
        .then((response) => {
            console.log(response.data);
        })
        .catch((err) => {
            console.log(err);
        });

}



/*
    All that's needed for PRODUCTS PRICING to be working is updated here...
*/



// module.exports = {
//     listInventory,
//     listDeal,
//     deleteItem,
//     updateItem,
//     pullProductInformation,
//     pullOrdersList,
//     pullOrderInformation,
//     listFinancialEventGroups,
//     pullGeneralInformation,
//     createConfirmOrderDetails,
//     createdUnexpectedProblem,
//     getMyFeesEstimateForAsin,
//     getCompetitivePricing,
//     getItemOffers,
//     getPricing
// };

// exports.getFileStream = getFileStream
exports.listDeal = listDeal