var Ractive = require('ractive')

var ractive = new Ractive({
    // The `el` option can be a node, an ID, or a CSS selector.
    el: '#container',

    // We could pass in a string, but for the sake of convenience
    // we're passing the ID of the <script> tag above.
    template: '#template',

    // Here, we're passing in some initial data
    data: { net: null }
})

var autograph = require('./autograph2.js')

function draw (net) {
    "use strict";
    ractive.set('net', net)
    autograph({Net: net})
}

var net = [
    [[],[0]],
    [[0],[1,2]],
    [[1],[3]],[[2],[4]],
    [[3,4],[5]],
    [[5],[]]
]

draw(net)
