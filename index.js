var crypto = require('./crypto')
var html = require('choo/html')
//var devtools = require('choo-devtools')
var choo = require('choo')

var app = choo()
//app.use(devtools())
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <style>
      * { font-family: 'monospace'; background: black; color: white; }
      </style>
      <h1>sked</h1>
      <p>shared key encryption & decryption tool.</p>
      <hr>
      <form onsubmit=${onsubmit} method="post">
        <label for="password">
          Password
        </label><br/>
        <input id="password"
          name="password"
          type="password"
          required
          pattern=".{1,33}"
          style="width:401px"
          title="Username must be between 1 and 33 characters long.">
        <br/><hr/>
        <label>Mode</label><br/>
        <input type="radio" id="encrypt" name="mode" value="encrypt" checked>
        <label for="encrypt">Encrypt</label><br>
        <input type="radio" id="decrypt" name="mode" value="decrypt">
        <label for="decrypt">Decrypt</label><br>
	<hr/>
        <label>Message</label><br/>
        <textarea
          id="message"
          name="message"
          style="width:401px;height:201px;">${state.textarea}</textarea><br/>
        <input type="submit" value="Submit">
      </form>
      <p>built by m-onz : <a href="https://github.com/m-onz/sked">sked on github</a></a>
    </body>
  `;

  function onsubmit (e) {
    e.preventDefault()
    var form = e.currentTarget
    var body = new FormData(form)
    var sharedKey = crypto.generateKey(body.get('password'))
    switch (body.get('mode')) {
      case 'encrypt':
        var encrypted = crypto.encrypt(body.get('message'), sharedKey)
        state.textarea = encrypted
        emit('render')
      break;
      case 'decrypt':
        var decrypted = crypto.decrypt(body.get('message'), sharedKey)
        state.textarea = decrypted
        emit('render')
      break;
    }
  }
}
