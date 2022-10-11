## Classes

<dl>
<dt><a href="#CoinFly">CoinFly</a></dt>
<dd><p>Class representing CoinFly object.</p>
</dd>
<dt><a href="#bsvCoin">bsvCoin</a></dt>
<dd><p>Class representing bsv coin.</p>
</dd>
</dl>

<a name="CoinFly"></a>

## CoinFly
Class representing CoinFly object.

**Kind**: global class  
<a name="CoinFly.create"></a>

### CoinFly.create(name, [option]) ⇒ <code>object</code>
**Kind**: static method of [<code>CoinFly</code>](#CoinFly)  
**Returns**: <code>object</code> - created object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | coin name. support: 'bsv' |
| [option] | <code>object</code> | <code></code> |  |

<a name="bsvCoin"></a>

## bsvCoin
Class representing bsv coin.

**Kind**: global class  

* [bsvCoin](#bsvCoin)
    * [.createPrivateKey()](#bsvCoin.createPrivateKey) ⇒ <code>string</code>
    * [.getPublicKey(key)](#bsvCoin.getPublicKey) ⇒ <code>string</code>
    * [.getAddress(publicKey)](#bsvCoin.getAddress) ⇒ <code>string</code>
    * [.getAddressHistory(option)](#bsvCoin.getAddressHistory) ⇒ <code>object</code>
    * [.getBalance(address)](#bsvCoin.getBalance) ⇒ <code>number</code>
    * [.sign(private, data)](#bsvCoin.sign) ⇒ <code>string</code>
    * [.verify(public, data, signature)](#bsvCoin.verify) ⇒ <code>bool</code>
    * [.build(build)](#bsvCoin.build) ⇒ <code>object</code>
    * [.send(the)](#bsvCoin.send) ⇒ <code>object</code>

<a name="bsvCoin.createPrivateKey"></a>

### bsvCoin.createPrivateKey() ⇒ <code>string</code>
Create a new private key

**Kind**: static method of [<code>bsvCoin</code>](#bsvCoin)  
**Returns**: <code>string</code> - string of the privateKey  
<a name="bsvCoin.getPublicKey"></a>

### bsvCoin.getPublicKey(key) ⇒ <code>string</code>
Get public key from the private key

**Kind**: static method of [<code>bsvCoin</code>](#bsvCoin)  
**Returns**: <code>string</code> - the public key  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | string of the private key |

<a name="bsvCoin.getAddress"></a>

### bsvCoin.getAddress(publicKey) ⇒ <code>string</code>
Get address from the public key

**Kind**: static method of [<code>bsvCoin</code>](#bsvCoin)  
**Returns**: <code>string</code> - address  

| Param | Type |
| --- | --- |
| publicKey | <code>string</code> | 

<a name="bsvCoin.getAddressHistory"></a>

### bsvCoin.getAddressHistory(option) ⇒ <code>object</code>
Get transaction history of an address

**Kind**: static method of [<code>bsvCoin</code>](#bsvCoin)  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>object</code> |  |
| option.address | <code>addresss</code> |  |
| option.start | <code>number</code> | height |
| option.end | <code>number</code> | height |
| option.num | <code>number</code> | number of txs |

<a name="bsvCoin.getBalance"></a>

### bsvCoin.getBalance(address) ⇒ <code>number</code>
**Kind**: static method of [<code>bsvCoin</code>](#bsvCoin)  
**Returns**: <code>number</code> - sat  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="bsvCoin.sign"></a>

### bsvCoin.sign(private, data) ⇒ <code>string</code>
sign a signature using private key

**Kind**: static method of [<code>bsvCoin</code>](#bsvCoin)  
**Returns**: <code>string</code> - sigature  

| Param | Type | Description |
| --- | --- | --- |
| private | <code>string</code> | key |
| data | <code>string</code> | to sign |

<a name="bsvCoin.verify"></a>

### bsvCoin.verify(public, data, signature) ⇒ <code>bool</code>
**Kind**: static method of [<code>bsvCoin</code>](#bsvCoin)  

| Param | Type | Description |
| --- | --- | --- |
| public | <code>string</code> | key |
| data | <code>string</code> | used to sign |
| signature | <code>string</code> | generated |

<a name="bsvCoin.build"></a>

### bsvCoin.build(build) ⇒ <code>object</code>
**Kind**: static method of [<code>bsvCoin</code>](#bsvCoin)  
**Returns**: <code>object</code> - the same as nbpay {code:0, rawtx:} for success  

| Param | Type | Description |
| --- | --- | --- |
| build | <code>object</code> | option, the same as nbpay |

<a name="bsvCoin.send"></a>

### bsvCoin.send(the) ⇒ <code>object</code>
**Kind**: static method of [<code>bsvCoin</code>](#bsvCoin)  
**Returns**: <code>object</code> - the same as nbpay {code:0, txid:} for success  

| Param | Type | Description |
| --- | --- | --- |
| the | <code>object</code> | same as nbpay |

