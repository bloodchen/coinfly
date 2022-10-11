import rwc from 'random-weighted-choice';

var isBrowser = isBrowser || new Function('try {return this===window;}catch(e){ return false;}');

var bsv;
var ar;
var Arweave;
var nbpay, bitIdentity;
var Storage;
var nbAPI = null
var fetch;
var pem;
var g_isBrowser = isBrowser();
var jwkTopem,pemTojwk


const fromHexString = (hexString) => new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
const toHexString = (arr) => Array.from(arr, (i) => i.toString(16).padStart(2, '0')).join('');

async function loadScript(url) {
    return new Promise((resolve) => {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            resolve(true);
        };
        script.onerror = () => {
            console.error('error loading' + url);
            resolve(false);
        };
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    });
}

/** Class representing CoinFly object. */
export default class CoinFly {
    /**
     * @param  {string} name - coin name. support: 'bsv'
     * @param  {object=} [option = null]
     * @return {object} created object
     */
    static async create(name, option = null) {
    	if(!bsv&&!ar)
    		console.log("CoinFly: [VI]{version} - {date}[/VI]")
    	nbAPI = option&&option.nbAPI

        if (name == 'bsv') {
            if (bsv) return bsvCoin; //already created

            if (!g_isBrowser) {
                nbpay = require('nbpay');
                bsv = nbpay.bsv;
                fetch = require('node-fetch');
                bitIdentity = require('bitidentity');
            } else {
                if (!window.BitID) {
                    await loadScript('https://unpkg.com/bitidentity@latest/bitIdentity.min.js');
                }
                if (!window.nbpay) {
                    await loadScript('https://unpkg.com/nbpay@latest/dist/nbpay.min.js');
                }
                fetch = window.fetch;
                nbpay = window.nbpay;
                bitIdentity = window.BitID;
                bsv = nbpay.bsv;
            }
            return bsvCoin;
        }
        if (name == 'ar') {
            if (ar) return arCoin; //already created

            if (!g_isBrowser) {
                Arweave = require('arweave');
                fetch = require('node-fetch');
                pem = require('./pem.js')
                jwkTopem = pem.jwkTopem
                pemTojwk =  pem.pemTojwk
                const  LocalStorage = require('node-localstorage').LocalStorage;
                Storage = new LocalStorage('./storage');
            } else {
                fetch = window.fetch;
                Storage = window.localStorage;
                if (!window.Arweave) await loadScript('https://unpkg.com/arweave/bundles/web.bundle.min.js');
                Arweave = window.Arweave;
            }
            if (!Arweave) throw 'please include arweave lib first';
            
            
            if (!option || !option.host) {
        		option  = { host: "arweave.net", port: 443, protocol: "https" }
            }
            ar = Arweave.init(option);
            
            return arCoin;
        }
        throw 'not supported';
    }
}

/** Class representing bsv coin. */

class bsvCoin {
    static get name() {
        return 'bsv';
    }
    static get bsv() {
        return bsv;
    }
    /**
     * Create a new private key
     * @return {string} string of the privateKey
     */
    static async createPrivateKey() {
        return bsv.PrivateKey.fromRandom().toWIF();
    }
    /**
     * Get public key from the private key
     * @param  {string} key - string of the private key
     * @return {string} the public key
     */
    static async getPublicKey(strPrivKey) {
        try{
            const publicKey = bsv.PublicKey(bsv.PrivateKey.fromWIF(strPrivKey));
            return publicKey.toString();
        }catch(e){
            console.error(e.message)
            return null
        }
        return null
    }
    /**
     * Get address from the public key
     * @param  {string} publicKey
     * @return {string} address
     */
    static async getAddress(publicKey) {
        const pub = bsv.PublicKey.fromString(publicKey);
        return bsv.Address.fromPublicKey(pub).toString();
    }
    /**
     * Get transaction history of an address
     * @param  {object} option
     * @param  {addresss} option.address
     * @param  {number} option.start - height
     * @param  {number}	option.end - height
     * @param  {number} option.num - number of txs
     * @return {object}
     */
    static async getAddressHistory({ address, start, end, num }) {
        if (!num) num = 20;
        let url = `https://util.nbsite.link/mpoint/v2/address/${address}/history?num=${num}`;
        if (start) url += '&start=' + start;
        if (end) url += '&end=' + end;
        const res = await fetch(url);
        const json = await res.json();
        return json;
    }
    /**
     * @param  {string} address
     * @return {number} sat
     */
    static async getBalance(address) {

        if (typeof address === 'string') {
            const url = `https://api.whatsonchain.com/v1/bsv/main/address/${address}/balance`;
            const res = await fetch(url);
            const json = await res.json();
            return json.confirmed + json.unconfirmed;
        }

        async function _getBalance(add) {
            const json = { addresses: add };
            const url = 'https://api.whatsonchain.com/v1/bsv/main/addresses/balance';
            const rawResponse = await fetch(url, {
                method: 'POST',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(json),
            });
            const content = await rawResponse.json();
            content.forEach((item) => {
                if (item.balance) item.balance = item.balance.confirmed + item.balance.unconfirmed;
            });
            return content;
        }
        let ret = [];
        for (let pos = 0; pos < address.length; pos += 20) {
            let end = address.length - pos - 20 > 0 ? pos + 20 : address.length;
            const items = await _getBalance(address.slice(pos, end));
            ret = ret.concat(items);
        }
        return ret;
    }
    static async signMessage(strPrivKey,strMsg){
        return await bsvCoin.sign(strPrivKey,strMsg+"coinflyMessage")
    }
    /**
     * sign a signature using private key
     * @param  {string} private key
     * @param  {string} data to sign
     * @return {string} sigature
     */
    static async sign(strPrivKey, data) {
    	try{
	        const pKey = bsv.PrivateKey.fromWIF(strPrivKey);
	        const hash = bsv.crypto.Hash.sha256(bsv.deps.Buffer.from(data));
	        const sig = bsv.crypto.ECDSA.sign(hash, pKey);
	        return sig.toString();
	    }catch(e){
	    	console.error("coinfly.sign:",e)
	    }
	    return ""
    }
    static async verifyMessage(strPubKey,strMsg,strSig){
        return await bsvCoin.verify(strPubKey,strMsg+"coinflyMessage",strSig)
    }
    /**
     * @param  {string} public key
     * @param  {string} data used to sign
     * @param  {string} signature generated
     * @return {bool}
     */
    static async verify(strPubKey, strData, strSig) {
    	try{
	        let sig = bsv.crypto.Signature.fromString(strSig);
	        let pubKey = bsv.PublicKey.fromString(strPubKey);
	        let hash = bsv.crypto.Hash.sha256(bsv.deps.Buffer.from(strData));
	        return bsv.crypto.ECDSA.verify(hash, sig, pubKey);
	    }catch(e){
	    	console.error("coinfly.verify:",e)
	    }
        return false
    }
    static async getTxStatus(txid) {
    	if (typeof txid === 'string') {
            txid = [txid]
    	}
    	let ret = [];let txids = []
        for (let pos = 0; pos < txid.length; pos++) {
            txids.push(txid[pos])
            if (txids.length == 20 || pos === txid.length-1) {
                const res = await fetch("https://api.whatsonchain.com/v1/bsv/main/txs/status", { method:'POST',body: JSON.stringify({txids}) })
                if (res.ok) {
                    ret = ret.concat(await res.json())
                }
                txids=[]
            }
        }
        return ret.map(item=>{
   			return {
   				height:item.blockheight,
   				time:item.blocktime,
   				hash:item.blockhash,
   				confirmations:item.confirmations,
   				txid:item.txid,
   				err:item.error
   			}
        })
        
    }
    /**
     * @param  {object} build option, the same as nbpay
     * @return {object} the same as nbpay {code:0, rawtx:} for success
     */
    static async build(options) {
    	//replace template
    	const timestamp = Math.floor(Date.now()/1000)
    	options = JSON.parse(JSON.stringify(options).replace(/{{timestamp}}/g,timestamp))
    	let options1 = JSON.parse(JSON.stringify(options))
        console.log('coinfly: in bsv.Build:', options);
        try {
        	options.rpc = "woc"
            let res = await bitIdentity.gentx(options);
            res.code = 0;
            res.more_data = options.more_data
            return res;
        } catch (e) {
        	try{
        		console.error("bsv:build error:",e.err, " change to sensible:")
	            options1.rpc = "sensible"
	            let res = await bitIdentity.gentx(options1);
	            res.code = 0;
	            res.more_data = options1.more_data
	            return res;	
        	}
        	catch(ee){
	            if (ee.err.indexOf('Insufficient') != -1) {
	                ee.code = 2;
	            }
                ee.code=1;
                ee.msg = ee.err
            return ee;
        }
    }
    }
    /**
     * @param  {object} the same as nbpay
     * @return {object} the same as nbpay {code:0, txid:} for success
     */
    static async send(options) {
        let rawtx = options.rawtx,
            ret = { code: 0 };
        if (!rawtx) ret = await bsvCoin.build(options);
        if (ret.code!=0) return ret;
        if (ret.rawtx) rawtx = ret.rawtx;
        if (rawtx) {
            let ret1 = await nbpay.send({ rawtx: rawtx,rpc:"woc" });
            if (ret1.err) {
            	console.error('bsv send err:', ret1);
            	console.log("change to sensible")

            	ret1 = await nbpay.send({...options,rpc:"sensible" });
            	if (ret1.err) {
                    ret1.msg = ret1.err
                    console.error('bsv send err:', ret1);
                }
            }
            ret = { code: ret1.err ? 1 : 0, txid: ret1.txid, rawtx: rawtx, ...ret1 };
        }
        ret.more_data = options.more_data
        return ret;
    }
    static async getRates(){
    	const res = await fetch("https://api.whatsonchain.com/v1/bsv/main/exchangerate");
	    const json = await res.json();
	    return [{'BSV/USDT':json.rate}]
    }
    static async verifyTX(txid){
        if (typeof txid === 'string') {
            txid = [txid]
        }
        let ret = [];let txids = []
        for (let pos = 0; pos < txid.length; pos++) {
            txids.push(txid[pos])
            if (txids.length == 20 || pos === txid.length-1) {
                const res = await fetch("https://api.whatsonchain.com/v1/bsv/main/txs", { method:'POST',body: JSON.stringify({txids}) })
                if (res.ok) {
                    ret = ret.concat(await res.json())
                }
                txids=[]
            }
        }
        for(const item of ret){
            var index = txid.indexOf(item.txid);
            if (index !== -1) {
                txid.splice(index, 1);
            }
        }
        return txid
    }
    static async verifyRaw({expectedId,rawtx}){
        try{
            const tx = bsv.Transaction(rawtx)
            return expectedId ? tx.id === expectedId : true
        }catch(e){
            console.error("verifyRaw:",e.message)
        }
        return false
    }
}

//----------------------------------------------arCoin------------------------------------------------------
//

function spkiToPEM(keydata){
    var keydataS = arrayBufferToString(keydata);
    var keydataB64 = window.btoa(keydataS);
    var keydataB64Pem = formatAsPem(keydataB64);
    return keydataB64Pem;
}

function arrayBufferToString( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return binary;
}


function formatAsPem(str) {
    var finalString = '-----BEGIN RSA PRIVATE KEY-----\n';

    while(str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }

    finalString = finalString + "-----END RSA PRIVATE KEY-----";

    return finalString;
}

async function _jwkTopem(jwk){
    console.log(jwk)
    const cryptoKey =  await window.crypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "RSA-PSS",
        hash: {
          name: "SHA-256",
        },
      },
      true,
      ["sign"]
    );
    //console.log(cryptoKey)
    const keydata = await window.crypto.subtle.exportKey("pkcs8",cryptoKey)
    //console.log(keydata)
    const strKey = spkiToPEM(keydata)
    return strKey
}

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
async function importPrivateKey(pem) {
  // fetch the part of the PEM string between header and footer
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSA-PSS",
      hash: "SHA-256",
    },
    true,
    ["sign"]
  );
}

async function _pemTojwk(pem){
    const cryptoKey =  await importPrivateKey(pem)
    return await window.crypto.subtle.exportKey(
      "jwk",cryptoKey
    );
}

class arCoin {
    static get name() {
        return 'ar';
    }
    static get ar() {
    	return ar
    }
    static async _getKey(strPrivKey){
        let key = null
        const json = JSON.parse(strPrivKey)
        if(json.format==="pem"){
            key = g_isBrowser ? await _pemTojwk(json.data) : pemTojwk(json.data)
        }else{
            key = json
        }
        return key
    }
    static async convertJwkTopem(strJwk){
        const jwk = JSON.parse(strJwk)
        return JSON.stringify({format:"pem",data:g_isBrowser? await _jwkTopem(jwk):jwkTopem(jwk)})
    }
    /**
     * Create a new private key
     * @return {string} string of the privateKey
     */
    static async createPrivateKey(format="jwk") {
        const jwk =  await ar.wallets.generate();
        let ret = JSON.stringify(jwk)
        if(format=="pem"){
            ret =JSON.stringify({format:"pem",data:g_isBrowser? await _jwkTopem(jwk):jwkTopem(jwk)})
        }
        return ret
    }
    
    /**
     * Get public key from the private key
     * @param  {string} key - string of the private key
     * @return {string} the public key
     */
    static async getPublicKey(strPrivKey) {
        const key = await arCoin._getKey(strPrivKey)
        return key.n;
    }

    static async getAddress(publicKey) {
        const address = await ar.wallets.jwkToAddress({ n: publicKey });
        return address;
    }
    static async getAddressHistory({ address, start, end, num }) {
        if (!num) num = 20;
        let url = `https://util.nbsite.link/mpoint/v2/address/${address}/history?num=${num}&chain=ar`;
        if (start) url += '&start=' + start;
        if (end) url += '&end=' + end;
        const res = await fetch(url);
        const json = await res.json();
        return json;
    }
    static changeNode(apiUrl){
    	let url = null
    	try{
            	 url = new URL(apiUrl);
            }catch(e){
            console.error("invalid url",url)
            return false
        }
        const config  = { host: url.hostname, port: url.port, protocol: url.protocol.replace(":","") }
        ar.api.applyConfig(config);
    }
    static async _getBalance(address) {
        async function _getBalance(add) {
            const balance = await ar.wallets.getBalance(add);
            return Math.floor(+balance / 10000);
        }
        if (typeof address === 'string') {
            const balance = await ar.wallets.getBalance(address);
            return Math.floor(+balance / 10000);
        }
        let ret = [], allP = []
        for (let i = 0; i < address.length; i++) {
            const ba =  ar.wallets.getBalance(address[i]);
            allP.push(ba)
        }
        const result = await Promise.allSettled(allP)
        for (let i = 0; i < address.length; i++) {
            const value = Math.floor(+result[i].value / 10000)
            ret.push({ address: address[i], balance:value  });   
        }
        return ret;
    }
    
    static async getBalance(address) {
    	if(nbAPI){
    		const addr = typeof address=='string' ? address : JSON.stringify(address)
    		const url = nbAPI+"/tools/ar/balance/"+ addr;
    		const ret = await fetch(url)
    		if(ret.ok)return await ret.json();
    		console.log(ret)
    		return []
    		
    	}
        return await arCoin._getBalance(address);
    }
    static async _getTxStatus(txid) {
        const res = await ar.transactions.getStatus(txid);
        const ret = {
            code: res.status == 200 ? 0 : 1,
            msg: res.status == 200 ? '' : 'invalid transaction',
            confirmations: res.confirmed ? res.confirmed.number_of_confirmations : null,
            height: res.confirmed ? res.confirmed.block_height : null,
            hash: res.confirmed ? res.confirmed.block_indep_hash : null,
            txid: txid,
        };
        return ret;
    }
    static async getTxStatus(txid){
    	if(nbAPI){
    		const url = nbAPI+"/tools/ar/status/"+ txid;
    		const ret = await fetch(url)
    		if(ret.ok)return await ret.json();
    		console.log(ret)
    		return []
    		
    	}
    	return arCoin._getTxStatus(txid)
    }
    static async signMessage(strPrivKey,strMsg){
        return await arCoin.sign(strPrivKey,strMsg+"coinflyMessage")
    }
    static async sign(strPrivKey, strData) {
        if(typeof strData != 'string') throw "sign data must be string"
        const buf = Uint8Array.from(Array.from(strData).map(letter => letter.charCodeAt(0)));
        let sig = await Arweave.crypto.sign(await arCoin._getKey(strPrivKey), buf);
        return toHexString(sig);
    }
    static async verifyMessage(strPubKey,strMsg,strSig){
        return await arCoin.verify(strPubKey,strMsg+"coinflyMessage",strSig)
    }
    static async verify(strPubKey, strData, strSig) {
        const sig = fromHexString(strSig);
        const data = Uint8Array.from(Array.from(strData).map(letter => letter.charCodeAt(0)));
        const verified = await Arweave.crypto.verify(strPubKey, data, sig);
        return verified;
    }
    static async _verifyOneItem(txid){
        const ret = await fetch('https://arweave.net/tx/'+txid)
        if(ret.ok){
            const text = await ret.text()
            console.log(text)
            return text.indexOf('Not Found')==-1
        }
        return false
    }
    static async verifyTX(txids){
        if (typeof txids === 'string') {
            txids = [txids]
        }
        let ret = []
        for(let i = 0;i<txids.length;i++){
            const res = await arCoin._verifyOneItem(txids[i])
            if(res){
                txids.splice(i, 1);
                i--;
            }
                
        }
        return txids
    }
    static async graphQL(option){
    	const ar1 = Arweave.init({ host: "arweave.net", port: 443, protocol: "https" })
    	return await ar1.api.post('graphql', option);
    }
    static async getData(txid,option){
    	const ar1 = Arweave.init({ host: "arweave.net", port: 443, protocol: "https" })
    	return await ar1.transactions.getData(txid,option)
    }
    
    static async build(options) {

    	//replace template
    	const timestamp = Math.floor(Date.now()/1000)
    	options = JSON.parse(JSON.stringify(options).replace(/{{timestamp}}/g,timestamp))
    	
        const key = await arCoin._getKey(options.pay.key);
        let data = null,
            target = null,
            quantity = null,
            payIndex = 0;

        const tos = options.pay.to.filter((item) => Object.keys(item)[0] === 'address');
        if (options.data !== undefined) {
            data = options.data;
        }
        if (typeof data == 'object') {
            data = JSON.stringify(data);
        }
        
        if (tos[payIndex]) {
            target = tos[payIndex].address;
            quantity = tos[payIndex].value * 10000;
        }
        if (!options.tags) options.tags = {};
        //options.tags["appname"]="coinfly"

        //check balance
        const address = await arCoin.getAddress(await arCoin.getPublicKey(options.pay.key));
        //AR chain does not allow send to self address
        if(address===target){
        	console.error("Target address cannot be self address")
        	return {code:1,msg:"Target address cannot be self address"}
        }
        const balance = await arCoin.getBalance(address);
        let total = 0;
        for (let i = payIndex; i < tos.length; i++) {
            total += tos[i].value;
        }
        //console.log("total:",total," balance:",balance)
        if (total > balance) {
            return { code: 2, msg: `not enough balance for ${address}. needed: ${total}, balance: ${balance}` };
        }
        //build other payment if there are any
        let otherPay = [],
            rawtx1 = [],
            fee = 0,
            more_txid = [];
        for (let i = payIndex + 1; i < tos.length; i++) {
        	//more target
            const item = tos[i];
        	if(address===item.target){
        		console.error("Target address cannot be self address")
        		return {code:1,msg:"Target address cannot be self address"}
        	}
            let tx = await ar.createTransaction(
                { target: item.address, quantity: (item.value * 10000).toString() },
                key
            );
            await ar.transactions.sign(tx, key);
            rawtx1.push(JSON.stringify(tx));
            more_txid.push(tx.id);
            fee += +tx.reward;
            otherPay.push({txid:tx.id,address:item.address,value:item.value});
        }
        if (otherPay.length != 0) options.tags['otherPay'] = JSON.stringify(otherPay);

        let txConfig = {};
        if (data !== undefined) txConfig.data = data;
        if (target) txConfig.target = target;
        if (quantity) txConfig.quantity = quantity.toString();

        let transaction = await ar.createTransaction(txConfig, key);

        for (const name in options.tags) {
            transaction.addTag(name, options.tags[name]);
        }
        const r = await ar.transactions.sign(transaction, key);
        fee += +transaction.reward;
        fee = Math.floor(+fee / 10000);
        if(total+fee>balance){
        	return { code: 2, msg:  `not enough balance for:${address} needed: ${total+fee}, balance: ${balance}` };
        }
        return {
            code: 0,
            more_data:options.more_data,
            rawtx: JSON.stringify(transaction),
            txid: transaction.id,
            more_rawtx: rawtx1,
            more_txid: more_txid,
            fee: fee,
        };
    }
    static async _postTx(tx){

    }
    static async send(options) {
        let rawtx = options.rawtx,
            more_rawtx = options.more_rawtx,
            ret = { code: 1 },
            txids = [];
        let result = { code: 1 };
        if (!rawtx) {
            result = await arCoin.build(options);
            rawtx = result.rawtx;
            more_rawtx = result.more_rawtx;
        }
        if (rawtx) {
            if (more_rawtx) {
                for (const raw of more_rawtx) {
                    const tx = ar.transactions.fromRaw(JSON.parse(raw));
                    let res = await ar.transactions.post(tx);
                    if (res.status != 200) console.error('ar send error:', res, 'tx:', tx);
                    txids.push(tx.id);
                }
            }
            const tx = ar.transactions.fromRaw(JSON.parse(rawtx));
            let res = await ar.transactions.post(tx);
            if (res.status != 200) console.error('ar send error:', res, 'tx:', tx);
            ret = { code: res.status == 200 ? 0 : res.status, txid: tx.id, more_txid: txids };
        }
        ret.more_data = options.more_data
        return ret;
    }
    static async verifyRaw({expectedId,rawtx}){
        try{
            const tx = ar.transactions.fromRaw(JSON.parse(rawtx))
            if(!expectedId||(tx.id===expectedId)){
                return await ar.transactions.verify(tx)
            }
        }catch(e){
            console.error("verifyRaw:",e)
        }
        return false
    }
}
