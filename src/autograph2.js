var go = require('gojs')
var Mininet = require('mininet')
var R = require('ramda')

var $ = go.GraphObject.make;

module.exports = function autoGraph (net, marking, opts) {
    "use strict";

    var myDiagram =
        $(go.Diagram, "myDiagramDiv",
            { // automatically scale the diagram to fit the viewport's size
                initialAutoScale: go.Diagram.Uniform,
                // start everything in the middle of the viewport
                initialContentAlignment: go.Spot.Center,
                // disable user copying of parts
                allowCopy: false,
                // position all of the nodes and route all of the links
                layout:
                    $(go.LayeredDigraphLayout,
                        {
                            direction: 0,
                            layerSpacing: 10,
                            columnSpacing: 15,
                            setsPortSpots: false
                        })
            });
    // replace the default Node template in the nodeTemplateMap
    myDiagram.nodeTemplate =
        // the whole node panel
        $(go.Node, "Vertical",
            // the label
            $(go.TextBlock,
                {
                    // margin: 0,
                    // height: 24,
                    font: "13px input mono",
                    // stroke: '#333'
                    //background: 'white'
                },
                new go.Binding("text", "key"),
                new go.Binding("stroke", "key", pickProps('stroke'))
            ),
            // the shape
            $(go.Shape,
                {},
                new go.Binding("figure", "key", pickProps('figure')),
                new go.Binding("stroke", "key", pickProps('stroke')),
                new go.Binding("fill", "key", pickProps('fill')),
                new go.Binding("desiredSize", "key", pickProps('desiredSize'))
            )
        );

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
            { curve: go.Link.Bezier, toShortLength: 2 },
            $(go.Shape,  // the link shape
                { strokeWidth: 1.5 }),
            $(go.Shape,  // the arrowhead
                { toArrow: "Standard", stroke: null })
        );

    // parse net
    var n = new Mininet(net)

    var nodeId = function (node) {
        return R.take(2, node.kind) + node.id
    }

    var safeMap = function (placeIdSet) {
        if (placeIdSet) {
            return R.map(nodeId, placeIdSet)
        } else {
            return []
        }
    }

    var is_place = function (id) { return /^pl.*$/.test(id) }

    var props = {
        place: {
            figure: 'Circle',
            stroke: '#8A520F',
            fill: '#EEBC76',
            desiredSize: new go.Size(32, 32)
        },
        transition: {
            figure: 'Rectangle',
            fill: '#604942',
            stroke: '#190F03',
            desiredSize: new go.Size(32, 22)
        },
        enabled: {
            stroke: '#1D8AEE',
            fill: '#96C2EE',
            figure: 'Rectangle',
            desiredSize: new go.Size(32, 22)

        }
    }

    function pickProps (name) {
        return function (id) {
            return is_place(id) ? props.place[name] : props.transition[name]
        }
    }

    var mkNode = function (node) {
        var id = nodeId(node)
        var pre = safeMap(node.pre)
        var post = safeMap(node.post)

        return R.concat(
            R.map(function (n) {
                return { from: n, to: id }
            }, pre),
            R.map(function (n) {
                return { from: id, to: n }
            }, post)
        )
    }

    // the array of link data objects: the relationships between the nodes
    var linkDataArray = R.unnest(R.map(mkNode, n.transitions()))

    // create the model and assign it to the Diagram
    myDiagram.model =
        $(go.GraphLinksModel,
            { // automatically create node data objects for each "from" or "to" reference
                // (set this property before setting the linkDataArray)
                archetypeNodeData: {},
                // process all of the link relationship data
                linkDataArray: linkDataArray
            });

    // var myDiagram =
    //     $(go.Diagram, "myDiagramDiv",
    //         {
    //             initialContentAlignment: go.Spot.Center, // center Diagram contents
    //             "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
    //             layout: $(go.TreeLayout, // specify a Diagram.layout that arranges trees
    //                 {angle: 90, layerSpacing: 35})
    //         })
    //
    // // the template we defined earlier
    // myDiagram.nodeTemplate =
    //     $(go.Node, "Horizontal",
    //         {width: 32, height: 32},
    //         new go.Binding("colour", "background"),
    //         $(go.TextBlock, "x",
    //             {margin: 12, stroke: "blue", font: "10px monospace"},
    //             new go.Binding("text", "label"))
    //     )
    //
    // // define a Link template that routes orthogonally, with no arrowhead
    // myDiagram.linkTemplate =
    //     $(go.Link,
    //         {routing: go.Link.Orthogonal, corner: 5},
    //         $(go.Shape, {strokeWidth: 3, stroke: "#555"})); // th
    // e link shape
    //
    //
    // var model = $(go.TreeModel);
    // model.nodeDataArray = nodes
    //     // [
    //     //     {key: "1", label: "Don Meow", kind: "transition"},
    //     //     {key: "2", parent: "1", label: "Demeter", kind: "place"},
    //     //     {key: "3", parent: "1", label: "Copricat", kind: "transition"},
    //     //     {key: "4", parent: "3", label: "Jellylorum", kind: "transition"},
    //     //     {key: "5", parent: "3", label: "Alonzo", kind: "place"},
    //     //     {key: "6", parent: "2", label: "Munkustrap", kind: "place"}
    //     // ];
    // myDiagram.model = model
}