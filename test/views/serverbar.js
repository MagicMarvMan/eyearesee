'use strict'

const test = require('tap').test
const ServerbarView = require('../../lib/views/serverbar')
const common = require('../common')

test('ServerbarView', (t) => {
  t.plan(28)
  const conn = {
    name: 'Freenode'
  , active: true
  , url: '/connections/Freenode'
  }

  const app = {
    activeModel: conn
  , connections: new Map([['Freenode', conn]])
  , url: '/connections/Freenode'
  , router: {
      goto: (u) => {
        t.equal(u, '/login')
      }
    }
  , newConnectionTip: {
      hide: (cb) => {
        t.pass('called newConnectionTip.hide()')
        cb && cb()
      }
    }
  }

  const verify = common.VerifyNode(t)

  const view = ServerbarView(app)
  const v = view.render()

  verify(v, 'IRC-SERVERBAR', {
    className: 'pure-u'
  }, 2, 'serverbar')

  const nav = v.children[0]
  verify(nav, 'DIV', {
    className: 'nav'
  }, 1, 'nav')

  const menu = nav.children[0]
  verify(menu, 'DIV', {
    className: 'menu'
  }, 1, 'menu')

  const ul = menu.children[0]
  verify(ul, 'UL', {}, 1, 'ul')

  // connection portion of serverbar
  const li = ul.children[0]
  verify(li, 'LI', {}, 2, 'li')

  const a1 = li.children[1]
  t.equal(a1.tagName, 'A', 'li a tagName')
  t.equal(a1.properties.className, 'active')
  t.deepEqual(a1.properties.attributes, {
    navtype: 'connection'
  , navname: 'Freenode'
  , tooltipid: 'tooltip-Freenode'
  })
  t.equal(a1.children.length, 1, 'li a children.length')

  const bottom = v.children[1]
  verify(bottom, 'DIV', {
    className: 'bottom'
  }, 1, 'bottom')

  const a2 = bottom.children[0]
  verify(a2, 'A', {
    className: 'add-connection'
  , innerHTML: '&#65291;'
  }, 0, 'bottom a')

  a2.properties.onclick({
    preventDefault: () => {
      t.pass('called preventDefault')
    }
  })
})
