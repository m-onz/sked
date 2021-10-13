
var crypto = require('.')

var key = crypto.generateKey('password123')

console.log(key, key.length);  // '3745e48...08d59ae'

var obj = "this is a test message! wahooooo! wahooooooooooooooO!"
var encrypted = crypto.encrypt(obj, key);

console.log('encrypted ', encrypted)

var decrypted = crypto.decrypt(encrypted, key);

console.log(decrypted, obj); // should be shallow equal

