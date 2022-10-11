require('dotenv').config()

const CoinFly  = require('./dist/CoinFly.min.js');

async function testAR(){
	const privKey = process.env.arpem;
	const lib = await CoinFly.create('ar')

	//const privKey = await lib.createPrivateKey("pem")
	console.log("privKey:",privKey)
	
	const publicKey = await lib.getPublicKey(privKey)
	console.log("Public Key:",publicKey)
	
	const address = await lib.getAddress(publicKey)
	console.log("address:",address)
//	const history = await lib.getAddressHistory({address})
//	console.log(history)

	const strData = "hello world"
	const sig = await lib.signMessage(privKey,strData)
	//const sig = "8e6778fb9ac74c718a2afcffff5b5043fc5679110051f53cfc2ab47680bbaf5108345f093da725d2a0ccda34d629a87a8956582ce62757ef5ec0406f493f617a1fe6549314ac5a9257280eddc2730dc4dead6cfc0ec0a14cf54f1fc1625fc93b4ece0cf5b4e1ccf0ac1ec595c51817a12cb5d30d01b874111b69b5e35aa9991d3739a31e478180be1fbe63147e8951adaf9eef3bb8afb01e8b4480618f2a7119c6b39a4b5213a550ec06bd6a1985dd64bc414ed301b771c854d03a25a01c7bdc2816b5d4aa79041a7cf54ac8b5447ac59d1e224e1642c6faf81510b624793ccda8f7d41ce7bcbd76edfea83ac9a54f8e936e96f70b6c76424281c8a9f88429af8ef2dc71493377e156cf14ade0af7bc90a2f462d0242ac4a70f3c92fa64e496e23a04b2f107165c1ade4d835a44cba5a7445ec964306eca15e598d9d44785f50cd717a6b7ce673c304cd7f3ebec48de24a5f055de44b95062c3a5638b7a696bb7fa55179182e56c5d631ec58e3ab3e452d249acb567b7a72e7e37b1819d499e58dddbb8103941e38a3cffeb1d29ed64c70af428b4ee8544d1f5e02579623a898467c7b8812fd6c79f653ad119f14626a59878f3b9de417af85f87d7744e5e25f7383ac728f633166944a0bc41610d7981193ee66596a166d4826d139fd288224910341f1bb3bcdccfe872795529f27cbce880298623911a83797bbff4bb1f902"
	const veried = await lib.verifyMessage(publicKey,strData,sig)

	console.log('sig:',sig,' veried:',veried)

	//const balance = await lib.getBalance(["FavaPfbZB4QfWz9ZHAdBqR1U4elSW5qYKpxhSJOn0Ic","FavaPfbZB4QfWz9ZHAdBqR1U4elSW5qYKpxhSJOn0Ic"])
	//console.log(balance)

	const option = {
		data:["1"],
		pay:{
			key:privKey,
			to:[
				//{address:"FavaPfbZB4QfWz9ZHAdBqR1U4elSW5qYKpxhSJOn0Ic",value:1000},
				//{address:"FavaPfbZB4QfWz9ZHAdBqR1U4elSW5qYKpxhSJOn0Ic",value:1000},
				//{address:"d9NfvYFjNnrx9IMPc0ZlsTXwTsR5m817YkmhAtdxHYk",value:1000000},
				
			]
		}
	}
	let res = await lib.build(option)
	console.log(res)
	res = await lib.verifyRaw({rawtx:res.rawtx})
	console.log(res)
	//const r = await lib.getTxStatus(res.txid)
	//const r = await lib.verifyTX(['W34fmYe9Cr5oXO4HMxSrwM1t0oGy35ADipaM2WmSYVo'])
	//console.log(r)
	

}
async function testBSV(){
	const privKey = process.env.bsvdev;
	const lib = await CoinFly.create('bsv')
	console.log("lib name:",lib.name)
	//const privKey = await lib.createPrivateKey()
	console.log("privKey:",privKey)
	const publicKey = await lib.getPublicKey(privKey)
	console.log("Public Key:",publicKey)
	const address = await lib.getAddress(publicKey)
	console.log("address:",address)
//	const history = await lib.getAddressHistory({address})
//	console.log(history)

	const strData = "hello world"
	const sig = await lib.sign(privKey,strData)
	const veried = await lib.verify(publicKey,strData,sig)

	console.log('sig:',sig,' veried:',veried)
	const addr = [
    "12o7C6exTSCYzjGJ2uGWNMZbiZjNf7Xv5i",
    "136y4ng7LBJH1iqgb6vTAoYaHkykGSTwT9",
    "138uCmFMb54A14oaF7wHdg2AKCEgVuHXxr",
    "13HmuNe9zwWH4BynyT7NxjfPLnej4T8ncA",
    "13HtunaadJTtLh9t4KX8MQsw3pUpPYbWQ6",
    "13LU757WvACUieGsGFcBrq6fECbuFcvQe6",
    "14ivaG5EAA63bPhATwxoCvtDfeU2J8d5L6",
    "157LWYmC3jYjjcV2zb93khNef96Ts498hE",
    "15CufHwadMpF7ZQLdQA4S6XWzkwUXcu7vy",
    "15etEcQnVFAc9iBtxGLCmPWg7mtBLMRHHg",
    "15NkJAYYDxScronTUH3aTK2gcMyN2qLk2J",
    "15T58YkET9pWTSPYXRzrUEnQ9oGWkmhWWc",
    "15YZmLkqbM4PNryrGmPRqa1rfjRpM38rcS",
    "16j91M41Z6MWSrjtpAAZKhhXxwn1WYBEqy",
    "16Ltg5iU117DQxaRnkc4xufLx8XJQeetgx",
    "17xNw8PLF5urkBJfrECcmkQ5NKRCoHRq19",
    "19YawJS5tLtQk4XUPyyXzM98H5ceWx4KPJ",
    "1AaTY6VncDYo1YiWLn8qXnKcHKZ3W4NdWV",
    "1AEcfMQiWZXHThNTRtyNeUUHNpsd75u9Di",
    "1AknDSrsa6XjySH9mGNRDtaJymq27Q9vsm",
    "1AR5Tus9ThLTvdLVvrmcLKakTQLahoiQyY",
    "1C9GKRbyFTgRPdNnsaq3Hf3yMg5Z5PTq2Q",
    "1Cdzmxi6ZhQ2PNgiLpKVg71zCVq4XusEmc",
    "1CponjTCt7W3DFcka2KNdbgUKjYsba4Rd8",
    "1FDWHgezABXXNpsbsbBEhvnyF2bg5zBRem",
    "1Fi3zhUmKt759KLSuPPoeTL6hec7mVWdgx",
    "1G46QxBqR4hpzTid9o1kCdArpoogBHKj3h",
    "1gEer15nRrPhbY3T2crGpcWcPwaVFxB7W",
    "1HGrEt27bDAPYiBZtP36fRKq5iexNwipsF",
    "1HX1KbFM7fwxiRVHK5ZMX7KBXYnaoFCxoT",
    "1Kzo9YFaTNW3mNaZNhWdbgi5RC7UZdXAJ9",
    "1L7XHS2pzRKT1np8uf9VmfvNAZ4s72num1",
    "1LmizEriVMajsnCq8NxqHgupu7i29sNS3p",
    "1Mn682ymrhUkv57VxLEj6HdiCAWmVhwkM9",
    "1PdAW9ve3vuYfvpdJ6FAcG8pGPdtcWf3oY",
    "1PfvXSfxQ2HjZQFwuxqUmceTNfPvVt6fAT",
    "TSAOVtwzMREo7ht6xIu5M3v32HsIAIAATy",
    "UwdI5B_3V-QqfuMg28r8JTXniMwIYP-guc"
]
//	const balance = await lib.getBalance(addr)
//	console.log(balance)

	//const balance1 = await lib.getBalance(["16ZBEb7pp6mx5EAGrdeKivztd5eRJFuvYP","1KGHhLTQaPr4LErrvbAuGE62yPpDoRwrob"])
	//console.log(balance1)

	const option = {
		data:['hello'],
		pay:{
			key:privKey,
			to:[
				//{protocol:"bitidentity",value: { privateKey: privKey }},
				//{address:"18HWams3diHEsFCY8UAR2vNL8AxENdnE5Z",value:6000000}
				//{address:"d9NfvYFjNnrx9IMPc0ZlsTXwTsR5m817YkmhAtdxHYk",value:1000},
				//{address:"d9NfvYFjNnrx9IMPc0ZlsTXwTsR5m817YkmhAtdxHYk",value:1000},
				//{address:"d9NfvYFjNnrx9IMPc0ZlsTXwTsR5m817YkmhAtdxHYk",value:1000},
				
			]
		},
		appData:{
			name:"adfdf"
		}
	}

	let res = await lib.build(option)
	console.log(res)
	//res = await lib.send({rawtx:res.rawtx})
	res = await lib.verifyRaw(res.rawtx)
	console.log(res)
	//let res = await lib.send({rawtx:"01000000014a196015875744a2f5f11788aeb417a29fb0bc23c36614493354b64d3bb42537020000006b483045022100d12b145a99927295e21709d7efb27fb45c25198fd9a919c7417b5e1b75a02f1802205092a9213433184daa2a18529b9fff1a02275d9dc42527df1363a051b26cfafc41210233809e4ca158e1aa16d5a2da39b678316ff1d403b1ae7730c0fa46036663c23bffffffff03000000000000000008006a0568656c6c6f0000000000000000fd0001006a2231346b7871597633656d48477766386d36596753594c516b4743766e395172677239423032333338303965346361313538653161613136643561326461333962363738333136666631643430336231616537373330633066613436303336363633633233624c9633303434303232303266383833653330316333656636333435373430353664333432656637626532323739393264316238356465653666626262333531333233363463623439313530323230376135653166643162373330666633363666363365366437386563653166363264636435393331363336646261363131363066623962663764393633326433632020202020202020202013650100000000001976a9145b0e7cd9476ae6fc2733d4842b35e663d6a846bf88ac00000000"})
	//let res = await lib.send(option)
	//console.log(res)

	//const r = await lib.verifyTX(['6d5c958cff206c548c0472304a8fd96d3aa5bfae2fa331861f2dfd0da56ef38e','fafsfsfsdaf'])
	//const r = await lib.getTxStatus('6d5c958cff206c548c0472304a8fd96d3aa5bfae2fa331861f2dfd0da56ef38e')
	//console.log(r)
}
(async ()=>{

	await testAR()
	return
	//console.log(process.env.arkey1)
	//testBSV()
	//return
	//const option  = { host: "ar1weave.net", port: 443, protocol: "https" }
	const lib = await CoinFly.create('ar')
	const privKey = await lib.convertJwkTopem(process.env.ar3)
	console.log(privKey)
	const publicKey = await lib.getPublicKey(privKey)
	console.log("Public Key:",publicKey)
	
	const address = await lib.getAddress(publicKey)
	console.log("address:",address)
	
	
	//const rawtx = `{"format":2,"id":"IeWNFDH4H09DGkYHX4DAs3JJknHlTl94s6CIrPXMMT0","last_tx":"g6RjdvQn0DePp0rZNCeka_mEL714FLRc9bmdR-glXRppnE2-ZI2m89HJ2slFLtvX","owner":"rZAgfhFkSBp3RmIef5hB-WsG2SrOM4LausiA3Od2EIvURoZotaPb0rqMmmHE8NToQ4XJnMvdx1l9fMaCRkFlUlC1QBV-YLHhUOBhi56CzN197F_bLvkED8ltQvEfm0ZOvgkXpRKtBZ639UHgyz_9Gq00BROXMVlFIUBEhiatRi-qSf7L1ta3u9sOOLw2c0kNVeYjoRGTYANdAiBnzghKo7_IL7c7pV63enx4XjZPv1r5azozJy2bhw_Vr1GeehViNQei05iyKpDFm6dPsxz5tvSklAFVChQbjRYVhBS9Evp_1y-PQ4WN5kYuUXPH0Udg6iv3NtxHw16i8e1M4vZ1HvPdokL5o5WrzFyr6txOxbkFar71SGeTItF-uCHw6Y9x3LlsFg5STAJ-bMtqcoeDbtxpyj47r4P_TxegRnH7hP9xasAewLYsSfEf068aV_NsD2Mye8G12w-qh_agtGgOaHLnOSRF6qHK8vGqVb81TFnQ_KAHhkKLZEI6LgHwL7p7RBpkWdMmse_FXvZ__5FV-GNmqVIHXlAO8K8UJoRBIpvlnDDM_bwClA4pHPvabuAt7hpQAfK1DBca8SceOfiXQtCilPjeIjNJws8aC7Bg-sKStmJxM9BjD9B9utfaJBZlKUdb6iTPOejHUu-4X3D3275GFbBXhPZWnpiiURtIwK8","tags":[{"name":"bmJwcm90b2NvbA","value":"bmJk"},{"name":"bmJkYXRh","value":"WyJuYmQiLCJ7XCJ2XCI6MixcInRzXCI6MTY0NjE4NDkyNH0iLCJhcmRvbWFpbmEiLCIxMDAwMDciXQ"},{"name":"Y21k","value":"WyJyZWdpc3RlciIsInJBdXZxczdQWXVYdWRwa3JBbjU4RDZiVmZLUTRkUmw4UWxqN0tKb281YnZlcHJGbVFsU0xUUG1lQU1TSTJEQ3dtaVRGcUlmMUk2RnJ2dWdvNTljN25Xajd2MGFBWkVicmNwdWxVMmNTUXNITUpVWkZJZG1CRnZiRE5vRDJ6cVZtSTFWblJsUzJtV3J6ZXluQm5NM09JeTh4Mm1MbHdVUlVueHJwdU55c1FCSUFMcUstb0I1bGFFa25OX3pDT1FCVFo0dllXTGtPci16MDNKWVE1QkVNUWF5RDhNMEVyTjRzZ0ZBRWlDeGNJcTNTaHNTN284SUo4SjgwQmhvSFczNmZtaF9ZaVd2QUVkQnlSQVVMZk1SZVp6cGdRS20wa2xKTjMydkxtamJzQ0VrbnJudVU1QVFLc0RPM1BYcUNmT1hUb2c4Um51VXl4UjdFbHo2M0VIamc4NFlVSTdmZU9ZSjFGNlFSdXl6bDFPenE2UGZyM2EwdEkxVFozOWFJdVNkM3d1UUR2ZldiS1QzRXdrcjc4SHg2Z0cxVV81UHVSV2tCOTVERXBHV01XQVE4ZW1TRm1ZOFB5Njl4SVhHT1VsdGFHX0tfUXRBck8zNTZOV0JJclI3Uk1MX3p4eVBjNnhOTG1JNk5fMHVJeEpzXzBOY2lQaF9uNlc2WkF3QklMb1dweUkxek1JRDBwUncwNmZibDBORURFYW9HV1JVWlNDaWRYZk5iZWhOaWsxSzRlcWVqYWkxUVpIaUVqYnhmQ3JHTVY5RXBKZlJEWGtabEdsV1lOTmpnNzN3R2FiN2UybzZhV3h3ZUFvT1A4eGJrSDBDLVFhY0l1ZldEUXBseUxyREJxYzFMTXJodHc5Z2hEWlBsYVh0M2l6elQ2Q29pNi1fNHBZU0J1enpLS1FVIiwie1wicGF5X3R4aWRcIjpcIlVhbTlMQkE4R1ZvZDNYWEFCUUxMc283ZVFHWUFVQ0hFRE12VGd3bjJfVG9cIn0iXQ"},{"name":"YXBwbmFtZQ","value":"Y29pbmZseQ"}],"target":"","quantity":"0","data":"","data_size":"2","data_tree":[],"data_root":"Yy5kuRlrQqZY9A_c0kFc--Y3wbblOAoFZoUZA0BPsaA","reward":"60500712","signature":"pEh7JqfsSnmV9s5mBannuEby9CEd1IgE7WGca7mPIo8cY1NlbPJ0YEnhLFpCgG-wnNLFQ5ha2u8fod_ajFRUnEAjxJVQVree-YNz_w3kSAzB6W-o5tjoH9LGWyFCDU-tOgw0wSKc9YAojquvrg5IdPQLqM4f8WQ6ukT4s7SOb_0VzGj706DPzmceXkOT0lSRCkpZ-XxICaFt5eZcxqPKtx4gkD8Ujuz5otNxaUVFTC6_nLSpBMsjD076_6E7ChN4gTflmkV8RKSKpcM-R_EGkLj5sL-UHoaeX6ZwtRresvgTtFJnotYijjodT-SXtUdiQxfwRdwT_VMk8RT5hEJ887PSwQTHOYX5kHWnqxIL6_7rTFZbwPqGomFS3iazR2KUwKCl7mhUxq21p_x4yh-SL3AJKI4cm8MNj4YEg3wlRYVAe7zqcZUMLZWNzmPep2HMP4CqVgTz0I-iZDx5c2tuffHSK95T7xJduDIVVHQzOF6DZGpvGA7h5XDv-ypWAtfkZWYpeWjdHH6Tm-2Pa4k1Kf5AUOhIHcOc8zM_KA2tBBCAhnCnzZKwJOi_RFYifdmluhKmfWALuIlNevHGdAs0Z4u7V-saaSo0peIktIei2svtybrDP3moX7j-96Lu619d6fB36NssLVkhj5_976bltqKqDpWWdiNLuGnXxdREnaY"}`
	//lib.verifyTx(rawtx)
})();
