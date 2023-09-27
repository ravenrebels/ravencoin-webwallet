# ravencoin-webwallet
Web wallet for Ravencoin!
Non-custodial, your keys never leave your browser.


## How to build

### Clone the repo
`git clone https://github.com/ravenrebels/ravencoin-webwallet.git`

### Install dependencies
`npm install` 


### Start local dev server

`npm start`<br/>
Starts a local development server using HTTP, does not support QR code scanning.<br/>
http://localhost:1234

`npm run dev` <br/>
Starts a local development server using HTTPS, supports QR code scanning.<br/>
https://localhost:1234


### Build for production
`npm run build` 

Now the ./dist folder contains the web "site", you can FTP the files to your web server.


### Experimental features
To use TESTNET instead of MAINNET for Ravencoin, append `?network=rvn-test` to the URL. 

Note: asset thumbnails only work on mainnet.
