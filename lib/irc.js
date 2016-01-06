'use strict'

const irc = require('slate-irc')
const net = require('net')
const inherits = require('util').inherits
const EE = require('events')
const debug = require('debug')('eyearesee:irc')

module.exports = IRC

function IRC(opts) {
  if (!(this instanceof IRC))
    return new IRC(opts)

  EE.call(this)
  debug('irc opts %o', opts)
  this.opts = opts
  this.client = null
  this.stream = null

  this._setupClient()
}
inherits(IRC, EE)

IRC.prototype._setupClient = function _setupClient() {
  const serverOpts = this.opts.server
  this.stream = net.connect({
    port: serverOpts.port
  , host: serverOpts.host
  })

  this.stream.on('connect', () => {
    this.emit('connect')
  })

  this.stream.on('close', () => {
    console.warn('socket closed...reconnecting')
    this.stream.removeAllListeners()
    this.client.removeAllListeners()
    this._setupClient()
  })

  this.client = irc(this.stream)
  const opts = this.opts.user

  if (opts.password) {
    this.client.pass(opts.password)
  }

  this.client.nick(opts.nickname)
  this.client.user(opts.username, opts.realname)

  this.client.on('notice', (msg) => {
    this.emit('notice', msg)
  })

  this.client.on('join', (msg) => {
    this.emit('join', msg)
  })

  this.client.on('nick', (msg) => {
    debug('nick', msg)
    this.emit('nick', msg)
  })

  this.client.on('topic', (msg) => {
    this.emit('topic', msg)
  })

  this.client.on('welcome', (msg) => {
    this.emit('welcome', msg)
  })

  this.client.on('names', (msg) => {
    this.emit('names', msg)
  })

  this.client.on('motd', (msg) => {
    this.emit('motd', msg.motd)
  })

  this.client.on('mode', (msg) => {
    debug('mode', msg)
    this.emit('mode', msg)
  })

  this.client.on('message', (msg) => {
    debug('message', msg)
    this.emit('message', msg)
  })

  this.client.on('part', (msg) => {
    this.emit('part', msg)
  })

  this.client.on('quit', (msg) => {
    this.emit('quit', msg)
  })

  this.client.on('data', (msg) => {
    debug('data', msg)
    //this.emit('data', msg)
  })
}

IRC.prototype.nick = function nick(nick) {
  this.client.nick(nick)
}

IRC.prototype.invite = function invite(name, channel) {
  this.client.invite(name, channel)
}

IRC.prototype.send = function send(target, msg) {
  this.client.send(target, msg)

  // TODO(evanlucas) if this is a user,
  // check that the user has a private window created
}

IRC.prototype.action = function action(target, msg) {
  this.client.action(target, msg)
}

IRC.prototype.notice = function notice(target, msg) {
  this.client.notice(target, msg)
}

IRC.prototype.join = function join(channel) {
  this.client.join(channel)
  // TODO(evanlucas) add channel to the db
}

IRC.prototype.part = function part(channel, msg) {
  this.client.part(channel, msg)
}

IRC.prototype.names = function names(channel, cb) {
  this.client.names(channel, cb)
}

IRC.prototype.away = function away(msg) {
  this.client.away(msg)
}

IRC.prototype.topic = function topic(channel, top) {
  this.client.topic(channel, top)
}

IRC.prototype.kick = function kick(channels, nicks, msg) {
  this.client.kick(channels, nicks, msg)
}

IRC.prototype.oper = function oper(name, password) {
  this.client.oper(name, password)
}

IRC.prototype.mode = function mode(target, flags, params) {
  this.client.mode(target, flags, params)
}

IRC.prototype.quit = function quit(msg) {
  this.client.quit(msg)
}

IRC.prototype.whois = function whois(target, mask, cb) {
  this.client.whois(target, mask, cb)
}