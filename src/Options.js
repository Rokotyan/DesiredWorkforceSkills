var ForceBubbleChartOptions = function( override ) {
	this.fillColors= ["#de262a", "#ca6958", "#b8b798", "#93bf88", "#7bc57c"]
	this.colorMap		=  {capability: "#fc4e2a", report: '#6D6F72'};
	this.highlightColor	= '#F2AE72';
	this.margin			=  {top: 60, right: 50, bottom: 60, left: 70};

	this.sizeVariable = {};
	this.sizeVariable.key = 'Budget Estimates 2016-17';

	this.nameVariable = {};
	this.nameVariable.key = 'Description';

	this.groupVariable = {};
	this.groupVariable.key = 'Revenue/Expense Type 2';

	this.colorVariable = {};
	this.colorVariable.key = 'change';

	this.forceBubbleChart					= {};
	this.forceBubbleChart.rMin				= 3;
	this.forceBubbleChart.rMax				= 45;
	this.forceBubbleChart.padding			= 1.5; // separation between same-color nodes
	this.forceBubbleChart.clusterPadding	= 6; // separation between different-color nodes

	this.dataLabels = {};
	this.dataLabels.enabled				= true;
	this.dataLabels.labelWrapping		= 'wrap'; // 'none','trim','wrap'
	this.dataLabels.labelTextMaxWidth	= 150;
	this.dataLabels.position			= 'outside';
	this.dataLabels.fontFamily			= "Source Sans Pro";
	this.dataLabels.fontStyle			= 'normal';
	this.dataLabels.textDecoration		= 'none';
	this.dataLabels.fontWeight			= 400;
	this.dataLabels.fontSize			= 14;
	this.dataLabels.textAnchor			=  'middle';
	this.dataLabels.textAlign			= 'center';


	for ( var prop in override ) {
		if ( override[ prop ].toString() === "[object Object]" ) {
			for ( var subProp in override[ prop ] )
				this[ prop ][ subProp ] = override[ prop ][ subProp ];
		}
		else this[ prop ] = override[ prop ];
	}
};