require("dotenv").config({
    path: "./env_variables/.env",
});

const express = require("express");
const path = require("path")
const axios = require("axios")

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

const SellingPartnerAPI = require('amazon-sp-api');

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
const baseUrl = "https://sellingpartnerapi-na.amazon.com"
const marketplaceId = "A2Q3Y263D00KWC"
const sellerId = "A12ZW5F2C6LX3M"
const sku = "27-01-22 -AA - AMZ -01"

app.get("/", async (req, res) => {
    const response = await axios.get(`{{baseUrl}}/listings/2021-08-01/items/:${sellerId}/:${sku}?marketplaceIds=${marketplaceId}&issueLocale=pt_BR&includedData=summaries,attributes,procurement,issues,offers,fulfillmentAvailability`)
    res.json({
        response
    })

    // axios({
    //     url: `{{baseUrl}}/listings/2021-08-01/items/:${sellerId}/:${sku}?marketplaceIds=${marketplaceId}&issueLocale=pt_BR&includedData=summaries,attributes,procurement,issues,offers,fulfillmentAvailability`,
    //     method: "GET",
    //     headers: {
    //         'Accept': 'application/json',
    //         'x-amz-access-token': 'Atza|IwEBILMUHlfG6kUmLyR70EEurCPVVEmtvuQNjh52BysYd5rr3HxRg-t50mYDWodXTH1vDnB_KnFhXMvQ5cKCYct0rEeEwB77Xra8flmsQOU_27GzRYNMiSSPn8qaVKveyvQMosxTdaU_DCca0O7IuYRWQzFbDIozF61rTnecwN-hdICA-QMLrDYGPKMSLgdvntK7arznZ5RzHS2TiOL6bjCK0mHZY3bc1htiSX0BwqjQYMYHKg-'
    //     },
    // })
    //     .then((response) => {
    //         res.json({
    //             response: response
    //         })
    //         console.log(response);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    
})


app.get("/list-deal", (req, res) => {

})

app.get("/list-inventory", (req, res) => {

})



const PORT = process.env.PORT || 5050

app.listen(PORT, () => {
    console.log("Server has started on port", PORT)
})
