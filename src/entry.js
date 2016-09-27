var Ractive = require('ractive')
var Mininet = require('mininet')
var R = require('ramda')

var ractive = new Ractive({
    // The `el` option can be a node, an ID, or a CSS selector.
    el: '#container',

    // We could pass in a string, but for the sake of convenience
    // we're passing the ID of the <script> tag above.
    template: '#template',

    // Here, we're passing in some initial data
    data: { net: null }
})

var autograph = require('./autograph.js')

function draw (net) {
    "use strict";
    ractive.set('net1', net)
    var N = R.length(Mininet.extract_places(net))
    var dual = R.map(
        Mininet.dual(net),
        R.range(0, N)
    )
    ractive.set('net2', dual)
    autograph("net1", {Net: net})
    autograph('net2', {Net: dual})
}

// var net = [
//     [[],[0]],
//     [[0],[1,2]],
//     [[1],[3]],[[2],[4]],
//     [[3,4],[5]],
//     [[5],[]]
// ]

var net = [
    [[], [0, 7]],
    [[0,4], [1,2,8]],
    [[1,2,5], [3,9]],
    [[3,6], []]
]

draw(net)
