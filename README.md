# ravencoin-webwallet
Web wallet for Ravencoin!


## How to build

### Clone the repo
`git clone https://github.com/ravenrebels/ravencoin-webwallet.git`

### Install dependencies
`npm install` 


### Start local dev server
`npm run dev` 
Now you can test it locally on your computer, it starts with HTTPS to be able to use Camera for QR Code scanning.


### Build for production
`npm run build` 

Now the ./dist folder contains the web "site", you can FTP the files to your web server.


### Experimental features
To use TESTNET instead of MAINNET for Ravencoin, append `?network=rvn-test` to the URL. 

Note: asset thumbnails only work on mainnet.