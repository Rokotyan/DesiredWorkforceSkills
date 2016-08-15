queue()
	.defer( d3.tsv, 'data/skills.tsv')
	.await( createVisualization );

function createVisualization(err, dataTSV ){
	if (err) throw err;

	var data = {
		nodes: [],
		links: []
	};

	dataTSV.forEach( function( d ) {
		var capability = d.Capability.trim();
		var report = d.Report.trim();

		var capNode = data.nodes.get( 'name', capability );
		var reportNode = data.nodes.get( 'name', report );

		if ( !capNode ){
			capNode = { name: capability, type: 'capability', linkedTo: [] };
			data.nodes.push( capNode );
		}

		if ( !reportNode ){
			reportNode = { name: report, type: 'report', linkedTo: [] };
			data.nodes.push( reportNode );
		}

		reportNode.linkedTo.push( capability );
		capNode.linkedTo.push( report );
		data.links.push( {source: reportNode, target: capNode, value: 1});

	});

	var graph = NetworkGraph( document.getElementById( 'Graph' ), data );
	graph.onNodeMouseOver( function(d) {
		d3.select('.description').text( d.name );
	});
	graph.onNodeMouseLeave( function(d) {
		d3.select('.description').text('');
	});
}

