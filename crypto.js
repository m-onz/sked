
/*

  sked

  or "shared key encryption & decryption"

  is a really simple tool to encrypt and decrypt messages
  using a shared password. You copy and paste the encrypted
  or plain text messages and use any communication medium you
  like to exchange messages.


*/

var crypto = require('crypto')

var {
  secretbox,
  randomBytes
} = require('tweetnacl')

var {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} = require('tweetnacl-util')

//var sharedKey = '... ... ...'

var newNonce = () => randomBytes(secretbox.nonceLength)
var generateKey = () => encodeBase64(randomBytes(secretbox.keyLength))

function encrypt (msg, key) {
  var keyUint8Array = decodeBase64(key)
  var nonce = newNonce()
  var messageUint8 = decodeUTF8(msg)
  var box = secretbox(messageUint8, nonce, keyUint8Array)
  var fullMessage = new Uint8Array(nonce.length + box.length)
  fullMessage.set(nonce)
  fullMessage.set(box, nonce.length)
  var base64FullMessage = encodeBase64(fullMessage)
  return base64FullMessage
}

function decrypt (messageWithNonce, key) {
  var keyUint8Array = decodeBase64(key)
  var messageWithNonceAsUint8Array = decodeBase64(messageWithNonce)
  var nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength)
  var message = messageWithNonceAsUint8Array.slice(
    secretbox.nonceLength,
    messageWithNonce.length
  )
  var decrypted = secretbox.open(message, nonce, keyUint8Array)
  if (!decrypted) {
    throw new Error('Could not decrypt message')
  }
  var base64DecryptedMessage = encodeUTF8(decrypted)
  return base64DecryptedMessage
}

module.exports = {
  generateKey: function (sharedKey) {
    return crypto.pbkdf2Sync(
      sharedKey,
      'monzwozere'.repeat(11),
      1000,
      32,
      'sha512'
    ).toString('base64')
  },
  encrypt: encrypt,
  decrypt: decrypt
}

/*
var key = crypto.pbkdf2Sync(sharedKey, 'monzwozere'.repeat(11), 9999999, 32, 'sha512').toString('base64')

console.log(key, key.length);  // '3745e48...08d59ae'

var obj = "this is a test message! wahooooo! wahooooooooooooooO!"
var encrypted = encrypt(obj, key);

console.log('encrypted ', encrypted)

var decrypted = decrypt(encrypted, key);

console.log(decrypted, obj); // should be shallow equal
*/
