function NetworkGraph( element, data, options ) {
	var options = new ForceBubbleChartOptions( options );
	var utils   = new Utils( options );
	utils.options = options;

	var onNodeMouseOver = function() {};
	var onNodeMouseLeave = function() {};
	var sel = d3.select(element);
	var selectionWidth  = parseInt( sel.style('width'), 10 ),
		selectionHeight = parseInt( sel.style('height'), 10 );

	var width 	  = selectionWidth  - options.margin.left - options.margin.right,
		height    = selectionHeight - options.margin.top - options.margin.bottom;

	var zoomBehaviour = d3.behavior.zoom()
	    .scaleExtent([0.1, 10])
	    .on("zoom", zoom);

	var force = d3.layout.force()
	    .charge( function(d) { return d.type === 'report' ? -600 : -200; })
	    .linkDistance(60)
	    // .linkStrength(0.5)
	    .gravity(0.1)
	    // .friction( 0.8 )
	    .size([width, height])
	    .on("tick", forceTick);//.start();

	var fillColor = d3.scale.ordinal().range( options.fillColors );
	var getColor = function(k) {
		var color = (k in options.colorMap) ? options.colorMap[k] : fillColor(k);
    	return d3.rgb( color ).toString();
    };

	var svg = sel.append("svg")
	    .attr("width", '100%')
	    .attr("height", '100%')
	    .call(zoomBehaviour);

	var graph = svg.append('g').attr('transform', 'translate('+[options.margin.left, options.margin.top]+')' );

	var linksGroup = graph.append('g').attr('class','linksGroup');
	var nodesGroup = graph.append('g').attr('class','nodesGroup');

	var link = linksGroup.selectAll(".link")
	      .data(data.links)
	    .enter().append("line")
	      .attr("class", "link")
	      // .style("stroke-width", function(d) { return Math.sqrt(d.value); });

	var gnodes = nodesGroup.selectAll('g.gnode')
	    .data( data.nodes )
	    .enter()
	    .append('g')
	    .classed('gnode', true)
	    .call(force.drag)
	    .on('mousedown', function(){ d3.event.stopPropagation(); })
	    .on('mouseover', nodeMouseOver)
	    .on('mouseleave', nodeMouseLeave);

	var node = gnodes.append("circle")
	      .attr("class", "node")
	      .attr("r", 5)
	      .style("fill", function(d) { return getColor(d.type); })
	      .style("fill-opacity", 0.5)
	      .style("stroke", function(d) { return d3.rgb( getColor(d.type) ).darker(0.3); })

	var nodeLabels = gnodes.append("text")
	    .attr("class", "nodeLabel")
	    .attr({
	      'font-size': '12pt',
	      'font-family': 'Source Sans Pro',
	      // 'font-weight': 300,
	      'text-anchor': 'middle',
	      'fill': '#777',
	      visibility: 'hidden',
	      'pointer-events': 'none'
	      // opacity: 0
	    })
	    .style('-moz-user-select', 'none')
	    .style('-webkit-user-select', 'none')
	    .style('-ms-user-select', 'none')
	    .text( function(d){ return d.name; } );

	d3.select(window).on('resize.chart_'+utils.guid(), update);
  	update(1000);
	zoomBehaviour.event(svg);
  	function update( transitionDuration ){
  		// var td = transitionDuration;
  		selectionWidth  = parseInt( sel.style('width'), 10 );
		selectionHeight = parseInt( sel.style('height'), 10 );
		width     = selectionWidth  - options.margin.left - options.margin.right;
		height    = selectionHeight - options.margin.top - options.margin.bottom;

		force.stop();
		force
	      .nodes(data.nodes)
	      .links(data.links);
	    force.size([width, height]);

		svg.attr(  'width',  selectionWidth )
			.attr( 'height', selectionHeight );

  		
	  	force.start();
  	};

	function forceTick(e){
		link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; });


		gnodes.attr("transform", function(d) { 
			return 'translate(' + [d.x, d.y] + ')'; 
		});

	}

	function zoom(e) {
		linksGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodesGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

		nodeLabels.attr('font-size', 10/zoomBehaviour.scale() + 'pt' )
				.attr('y', -10/zoomBehaviour.scale() )


		if ( zoomBehaviour.scale() > 2.5 ) nodeLabels.attr('visibility', null );
		else nodeLabels.attr('visibility','hidden');


		var scale = zoomBehaviour.scale() > 1  ? 1/zoomBehaviour.scale() : null;
		linksGroup.attr('stroke-width', scale );
		node.attr('transform',scale ? 'scale('+scale+')' : null );
	}

	function nodeMouseOver(d,i){
		gnodes.filter( function(node) { return (d.linkedTo.indexOf( node.name ) === -1) && d.name !== node.name; } )
			.td(400).attr('opacity',0.1);
		gnodes.filter( function(node) { return (d.linkedTo.indexOf( node.name ) !== -1) || d.name === node.name; } )
			.select('text').td(400).attr('visibility',null);

		onNodeMouseOver(d,i);
	}

	function nodeMouseLeave(d,i) {
		gnodes.td(400).attr('opacity',1);
		// gnodes.select('text').td(400).attr('visibility','hidden');
		zoomBehaviour.event(svg);
		onNodeMouseLeave(d,i);
	}

  return {
	 	update: function(transitionDuration){
	 		update( transitionDuration );
	 	},
	 	onNodeMouseOver:  function( f ) { onNodeMouseOver = f; },
	 	onNodeMouseLeave: function( f ) { onNodeMouseLeave = f; },
	 	data: data
	 };
	  
}





