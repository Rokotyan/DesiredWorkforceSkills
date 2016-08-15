function Utils(){
	var utils = this;
	utils.trimString = function(str) { return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };
	utils.numberWithSeparator = function(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	};
	utils.makeId = function( str ) { return str.replace(/^[^a-z]+|[^\w:.-]+/gi, "").replace(/\./gi,""); };
	utils.formatValue = function( value ){
	    if ( isNaN(value) || !isFinite(value) ) { return ''; }

	    return utils.numberWithSeparator( value );
	    var formattedValue;
		if ( Math.abs( value ) > 1000000 ) 	formattedValue = utils.numberWithSeparator( Math.round( value/100000 )/10 ) + "M";
		else if ( Math.abs( value ) > 50000 ) formattedValue = utils.numberWithSeparator( Math.round( value/1000 ) ) + "K";
		else if ( Math.abs( value ) > 1000 ) formattedValue = utils.numberWithSeparator( Math.round( value/100 )/10 ) + "K";
		else if ( Math.abs( value ) > 10 ) formattedValue = Math.round( value );
		else formattedValue = Math.round( 10*value )/10;

	    return formattedValue;
	};
	utils.guid = function() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
	};
	utils.componentToHex = function(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	};
	utils.rgbToHex = function(color) {
	    return "#" + utils.componentToHex( Math.round( color.r) ) + utils.componentToHex( Math.round( color.g ) ) + utils.componentToHex( Math.round( color.b ) );
	};
	utils.sortDataBy = function( data, prop ){
		data.sort( function (a, b) {
		  return b[prop] - a[prop];
		});
	};
	utils.hexToRgb = function(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	};
	utils.rgbToBrightness = function(r,g,b) {
		return 0.2126*r + 0.7152*g + 0.0722*b;
	};
	utils.hexToBrightness = function(hex) {
		var rgb = utils.hexToRgb(hex);
		return 0.2126*rgb.r + 0.7152*rgb.g + 0.0722*rgb.b;
	};
	utils.detectBrowser = function() { // http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
		if ( !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0 ) 	    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
			return 'Opera';

		if ( typeof InstallTrigger !== 'undefined')   // Firefox 1.0+
			return 'Firefox';

		if ( Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ) 		    // At least Safari 3+: "[object HTMLElementConstructor]"
			return 'Safari';

		if ( !!window.chrome && !( !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0 ) )              // Chrome 1+
			return 'Chrome';

		if ( /*@cc_on!@*/false || !!document.documentMode ) // At least IE6
			return 'IE';

		return 'Unknown';
	};
	utils.getQuantileExtent = function( data, prop, quantile ){
		var a = [];
		data.forEach( function(d) {
			var v = +d[ prop ];
			if ( v ) a.push( v );
		});
		a.sort( d3.ascending );
		return [ d3.quantile(a, 0), d3.quantile(a, quantile) ];

	};
	utils.getThresholdColorDomain = function( paletteLength, values ){
		var valueExtent = [-50,50];//utils.getQuantileExtent( values, utils.options.colorVariable.key, 0.95 )
		var valueExtentLength = valueExtent[1]-valueExtent[0];

		var colorDomain = [];
		for ( var i = 0; i < paletteLength; ++i )
			colorDomain.push( valueExtent[0] +0.01+ valueExtentLength*i/(paletteLength-1) );
		
		return colorDomain;
	};
	utils.styleLabel = function( selection ){ utils.styleYLabel(selection);};
	utils.styleYLabel = function( selection ) {

		function style(selection) {
			selection.attr({
				"font-size":   		utils.options.yAxis.fontSize, // For Firefox
			});
			return selection.style({
				"font-family": 		utils.options.yAxis.fontFamily,
				"font-size":   		utils.options.yAxis.fontSize,
				"font-weight": 		utils.options.yAxis.fontWeight,
				"font-style": 		utils.options.yAxis.fontStyle,
				"text-decoration": 	utils.options.yAxis.textDecoration,
				"text-anchor": 		utils.options.textDirection === 'ltr' ? 'end' : 'start',
				"direction": 		utils.options.textDirection,
				"fill": 			utils.options.yAxis.textColor,
				"cursor": 	   "default",
				"-moz-user-select": "none",
				"-webkit-user-select": "none",
				"-ms-user-select": "none"
			});
		}

		selection.each( function(d){
			var textElement = d3.select(this);
			textElement.transition().attr('transform','translate(' + (utils.options.yAxis.ticksPosition === 'inside' ? -3 :-25) + ',0)');
			var text = textElement.text();
			var words = text.split(' ');
			textElement.text('');
			var xPos = utils.options.yAxis.ticksPosition === 'inside' ? 0 : 0; //+textElement.attr('x');

			var tspan = textElement.append('tspan').attr('x',xPos).call(style);
			var tspanText = '';
			if ( utils.options.yAxis.labelWrapping === 'wrap' ){
				var tspanCount = 1;
				words.forEach( function(word,i) {
					tspan.text( tspanText + word + ' ' );
					if ( utils.getTSpanApprxWidth( tspan.node(), utils.options.yAxis.fontSize )*1.1 > (utils.options.yAxis.labelTextMaxWidth ? utils.options.yAxis.labelTextMaxWidth : utils.options.margin.left) ) {
						tspan.text( tspanText.trim() );
						tspan = textElement.append('tspan')
							.attr('x',xPos)
							.attr('dy','1.2em')
							.text( word + ' ' )
							.call(style);
						tspanCount++;
						tspanText = word + ' ';
					} else tspanText += (word+' ');
				});
				textElement.attr('dy',(-(tspanCount-1)/2 + 0.25)+'em');
			} 
			else if ( utils.options.yAxis.labelWrapping === 'trim' ){
				for ( var i = 0; i < words.length; i++) {
					word = words[i];
					tspan.text( tspanText + word + ' ' );
					if ( utils.getTSpanApprxWidth( tspan.node(), utils.options.yAxis.fontSize )*1.1 > (utils.options.yAxis.labelTextMaxWidth ? utils.options.yAxis.labelTextMaxWidth : utils.options.margin.left)-10 ) {
						tspan.text( tspanText + '...' );
						break;
					} else tspanText += (word+' ');
				}
			} else {
				tspan.text( text );
			}

		});

		return selection;
	};
	utils.styleXLabel = function( selection ) {
		selection.attr({
			"font-size":   		utils.options.xAxis.fontSize, // For Firefox
		});
		return selection.style({
			"font-family": 		utils.options.xAxis.fontFamily,
			"font-size":   		utils.options.xAxis.fontSize,
			"font-weight": 		utils.options.xAxis.fontWeight,
			"font-style": 		utils.options.xAxis.fontStyle,
			"text-decoration": 	utils.options.xAxis.textDecoration,
			"text-anchor": 		'middle',
			"fill": 			utils.options.xAxis.textColor,
			"cursor": 	   "default",
			"-moz-user-select": "none",
			"-webkit-user-select": "none",
			"-ms-user-select": "none"
		});
	};
	utils.wrapLabel = function(selection) {
		selection.each( function(d){
			var textElement = d3.select(this);
			var text = textElement.text();
			var words = text.split(' ');
			textElement.text('');

			var xPos = +textElement.attr('x');

			var tspan = textElement.append('tspan').attr('x',xPos).call( utils.styleDataLabel );
			var tspanText = words[0]+' ';
			tspan.text( tspanText );
			if ( utils.options.dataLabels.labelWrapping === 'wrap' ){
				var tspanCount = 1;
				words.forEach( function(word,i) {
					if (i===0) return;
					tspan.text( tspanText + word + ' ' );
					if ( tspan.node().getComputedTextLength() > (utils.options.dataLabels.labelTextMaxWidth ? utils.options.dataLabels.labelTextMaxWidth : d.labelTextMaxWidth) ) {
						tspan.text( tspanText.trim() );
						tspan = textElement.append('tspan')
							.attr('x',xPos)
							.attr('dy','1em')
							.text( word + ' ' )
							.call( utils.styleDataLabel );

						tspanCount++;
						tspanText = word + ' ';
					} else tspanText += (word+' ');
				});
				textElement.attr('dy',(-(tspanCount-1)/2 )+'em');
			} 
			else if ( utils.options.dataLabels.labelWrapping === 'trim' ){
				for ( var i = 0; i < words.length; i++) {
					word = words[i];
					tspan.text( tspanText + word + ' ' );
					if ( tspan.node().getComputedTextLength() > (utils.options.dataLabels.labelTextMaxWidth ? utils.options.dataLabels.labelTextMaxWidth : d.labelTextMaxWidth)-10 ) {
						tspan.text( tspanText + '...' );
						break;
					} else tspanText += (word+' ');
				}
			} else {
				tspan.text( text );
			}
		});
	};
	utils.styleDataLabel =  function( selection ) {
		return selection.attr({
			"font-family": 		utils.options.dataLabels.fontFamily,
			"font-size":   		utils.options.dataLabels.fontSize,
			"font-weight": 		utils.options.dataLabels.fontWeight,
			"font-style": 		utils.options.dataLabels.fontStyle,
			"text-decoration": 	utils.options.dataLabels.textDecoration,
			"text-anchor": 		'middle',
			"stroke": "none",
			"cursor": 	   "default",
			'pointer-events': 'none'
		}).style({
			"-moz-user-select": "none",
			"-webkit-user-select": "none",
			"-ms-user-select": "none"
		});
	};
	utils.styleLegend = function( selection ) {
		selection.attr({
			"font-size":   		utils.options.legend.fontSize, // For Firefox
		});
		return selection.style({
			"font-family": 		utils.options.legend.fontFamily,
			"font-size":   		utils.options.legend.fontSize,
			"font-weight": 		utils.options.legend.fontWeight,
			"font-style": 		utils.options.legend.fontStyle,
			"text-decoration": 	utils.options.legend.textDecoration,
			"text-anchor": 		utils.options.textDirection === 'ltr' ? 'start' : 'end',
			"direction": 		utils.options.textDirection,
			// "cursor": 	   "pointer",
			"-moz-user-select": "none",
			"-webkit-user-select": "none",
			"-ms-user-select": "none"
		});
	};
	utils.styleAxis = function( selection ) {
		return selection.style({
			"fill":            "none",
		    "stroke":          "black",
		    "stroke-width":    1,
		    "shape-rendering": "crispEdges",
		});
	};
	utils.styleGrid = function( selection ) {
		selection.selectAll("path").remove();
		return selection.style({
			stroke: "lightgrey"
		});
	};
	utils.styleTitle = function( selection ) {
		return selection.style({
			"font-family": "Source Sans Pro",
			"font-size":   "1.2em",
			"font-weight": "300",
			"text-anchor": "middle",
			"fill":        "black",
			"cursor": 	   "default",
			"-moz-user-select": "none",
			"-webkit-user-select": "none",
			"-ms-user-select": "none"
		});
	};
	utils.renderLegend = function( selection, data, getColor, x, y, width ) {
		if ( !utils.options.legend.enabled ) return d3.selectAll('EmptySelection');
		var markType = markType ? markType : 'circle';
		var markSize = utils.options.legend.markSize;

		selection.selectAll(".chartLegend").remove();
		var legend = selection.append("g")
			.attr("class","chartLegend")
			.attr('transform', 'translate(' + x + ',' + y + ')');

		var legendItems = legend.selectAll(".legendItem")
			.data( data )
			.enter()
			.append("g")
			.attr("class","legendItem")
			.attr("enabled",true);

		legendItems
			.append("rect")
			.attr({
				y: -markSize/4,
				width: 		markSize,
				height: 	markSize/2,
				fill: 	function(d,i) { return utils.options.hideSeries.indexOf( d.id ) === -1 ? getColor(d[utils.options.labelProp]) : 'none'; },
				stroke: function(d,i) { return d3.rgb( getColor(d[utils.options.labelProp]) ).darker(); },
				'pointer-events': 'all'
			});


		legendItems
			.append("text")
			.call(utils.styleLegend)
			.attr({
				// x: markSize*1.5,
				lines: 1,
				y: utils.options.legend.fontSize/4
			})
			// .text( function(d) { return d.name;} )
			.each( function(d){
				var textElement = d3.select(this);
				var words = d[ utils.options.labelProp ].split(' ');

				var tspan = textElement.append('tspan').attr('x',markSize*1.5).call(utils.styleLegend);
				var tspanText = '';
				if ( utils.options.legend.labelWrapping === 'wrap' ){
					var tspanCount = 1;
					words.forEach( function(word,i) {
						tspan.text( tspanText + word + ' ' );
						if ( utils.getTSpanApprxWidth( tspan.node(), utils.options.legend.fontSize ) > utils.options.legend.labelTextMaxWidth ) {
							tspan.text( tspanText );
							tspan = textElement.append('tspan')
								.attr('x',markSize*1.5)
								.attr('dy','1em')
								.text( word + ' ' )
								.call(utils.styleLegend);
							tspanCount++;
							tspanText = word + ' ';
							textElement.attr('lines', +textElement.attr('lines')+1 );
						} else tspanText += (word+' ');
					});
					textElement.attr('dy',(-(tspanCount-1)/2)+'em');
				} 
				else if ( utils.options.legend.labelWrapping === 'trim' ){
					for ( var i = 0; i < words.length; i++) {
						word = words[i];
						tspan.text( tspanText + word + ' ' );
						if ( utils.getTSpanApprxWidth( tspan.node(), utils.options.legend.fontSize ) > utils.options.legend.labelTextMaxWidth ) {
							tspan.text( tspanText + '...' );
							break;
						} else tspanText += (word+' ');
					}
				} else {
					tspan.text( d[ utils.options.labelProp ] );
				}
			});
		

		var labelPadding = {x:30, y:utils.options.legend.fontSize*1.35};
		var left = 0;
		var top = 0;
		legendItems.each( function() {
			var labelWidth = this.getBBox().width;
			// var numLines = +d3.select(this).select('text').attr('lines');
			d3.select(this).attr('transform', 'translate(' + left + ',' + top + ')');
			left += labelWidth + labelPadding.x;

			if ( left + labelWidth > width ) {
				left = 0;
				top += labelPadding.y * utils.options.legend.ySpacing; //*numLines;
			}
			
	        
	    });

		return legend;
	};
	utils.xAxis = function( scale, properties ){
		var properties = properties ? properties : {};
		var axis = d3.svg.axis()
					.scale(scale)
					.orient("bottom")
					.ticks( utils.options.xAxis.ticksCount )
					.tickSize( utils.options.xAxis.showTicks ?  
								  utils.options.xAxis.ticksPosition == 'outside' ? 6 : -6
								: 0 )
					.outerTickSize(1)
					.tickFormat("");

		if ( properties.tickLabels ) axis.tickFormat(function(d) { return properties.tickLabels[d]; });
		if ( properties.tickFormat )  axis.tickFormat( properties.tickFormat );
		if ( properties.orient )      axis.orient( properties.orient );
		return axis;
		    
	};
	utils.yAxis = function( scale, properties ) {
		var properties = properties ? properties : {};
		var axis = d3.svg.axis()
			    .scale(scale)
			    .tickFormat(function(d) { return d; })
			    .orient("left")
			    .ticks( utils.options.yAxis.ticksCount )
			    .tickSize( utils.options.yAxis.showTicks ?  
								  utils.options.yAxis.ticksPosition == 'outside' ? 6 : -6
								: 0  )
			    .outerTickSize(0);
		
		if ( properties.tickValues ) axis.tickValues( properties.tickValues );
		if ( properties.tickLabels ) axis.tickFormat(function(d,i) { return properties.tickLabels[i]; });
		if ( properties.tickFormat ) axis.tickFormat( d3.format(properties.tickFormat) );
		return axis;
	};
	utils.verticalGrid = function( scale, length ) {    
	    return d3.svg.axis()
	        .scale(scale)
	         .orient("top")
	         .ticks( utils.options.verticalGrid.lines )
	         .tickSize(length, 0, 0)
	         .tickFormat("");
	};
	utils.horizontalGrid = function( scale, length ) {        
	    return d3.svg.axis()
	        .scale(scale)
	        .orient("left")
	        .ticks( utils.options.horizontalGrid.lines )
	        .tickSize(-length, 0, 0)
			.tickFormat("");
	};
	utils.getTSpanApprxWidth = function( tspanNode, fontSize ) {
		return tspanNode.getComputedTextLength();
		// innerHTML.length*fontSize/2;
		// return tspanNode.getBoundingClientRect().width;   // Doesn't work properly in Firefox and Safari
		// return tspanNode.offsetWidth;                     // Depricated in Chrome, doesn't work in Firefox
	};
}

d3.selection.prototype.td = function( duration ) { 
	if ( duration ) return this.transition().duration( duration );
	else return this;
};

Array.prototype.get = function( prop, value ) {
	for (var i = 0; i < this.length; i++) {
		if ( this[i][prop] === value ) return this[i];
	}
};

Array.prototype.getIndex = function( prop, value ) {
	for (var i = 0; i < this.length; i++) {
		if ( this[i][prop] === value ) return i;
	}

	return -1;
};

Array.prototype.get2 = function( prop, value, prop2, value2 ) {
	var filtered = this.filter( function(d) { return (d[prop] === value) && (d[prop2] === value2); } );
	if ( filtered.length !== 0 ) return filtered[0];
};

Array.prototype.getAll = function( prop, value ) {
	var filtered = this.filter( function(d) { return d[prop] === value; } );
	if ( filtered.length !== 0 ) return filtered;
};