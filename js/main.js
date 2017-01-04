var colors = {
	base: d3.rgb( '#3868AF' ),
	comparator: d3.rgb( '#FBC861' ).darker()
};

var map = {
	'potus': '@potus',
	'flotus': '@flotus',
	'whitehouse': '@whitehouse',
	'electome': 'Election-engaged accounts'
};

var base = 'potus';
var comparator = 'electome';

d3.csv( 'data/all.csv', function ( response ) {

	d3.select( '#viz-base-dropdown' ).selectAll( 'li' )
		.data( Object.keys( map ) )
		.enter()
		.append( 'li' )
		.classed( 'viz-dropdown-li', true )
		.text( function ( d ) { return map[d] } );
	d3.select( '#viz-comparator-dropdown' ).selectAll( 'li' )
		.data( Object.keys( map ) )
		.enter()
		.append( 'li' )
		.classed( 'viz-dropdown-li', true )
		.text( function ( d ) { return map[d] } );

	document.getElementById( 'viz-base-dropdown-name' ).addEventListener( 'click', function () {
		document.getElementById( 'viz-base-dropdown' ).classList.toggle( 'active' );
	} );
	document.getElementById( 'viz-comparator-dropdown-name' ).addEventListener( 'click', function () {
		document.getElementById( 'viz-comparator-dropdown' ).classList.toggle( 'active' );
	} );

	[].forEach.call( document.getElementById( 'viz-base-dropdown' ).getElementsByClassName( 'viz-dropdown-li' ), function ( el ) {
		el.addEventListener( 'click', function () {
			base = d3.select( el ).datum();
			document.getElementById( 'viz-base-dropdown-name' ).innerHTML = map[base];
			render();
		} );
	} );

	[].forEach.call( document.getElementById( 'viz-comparator-dropdown' ).getElementsByClassName( 'viz-dropdown-li' ), function ( el ) {
		el.addEventListener( 'click', function () {
			comparator = d3.select( el ).datum();
			document.getElementById( 'viz-comparator-dropdown-name' ).innerHTML = map[comparator];
			render();
		} );
	} );

	var render = function () {

		var raw = response.sort( function ( a, b ) {
			return a[base] < b[base] ? 1 : -1;
		} ).slice( 0, 5 );

		var data = raw.map( function ( d ) {
			return { topic: d.topic, location: 'base', value: parseFloat( d[base] ) };
		} ).concat( raw.map( function ( d ) {
			return { topic: d.topic, location: 'comparator', value: parseFloat( d[comparator] ) };
		} ) ).sort( function ( a, b ) {
			return a.topic > b.topic ? 1 : -1;
		} );


		var xScale = d3.scaleLinear()
			.domain( [ 0, d3.max( data, function ( d ) { return d.value; } ) ] )
			.range( [ 0, 700 ] );
		d3.select( '#viz' )
			.attr( 'width', 960 )
			.attr( 'height', 10 * 30 );

		d3.select( '#viz' ).selectAll( 'rect' ).remove();
		d3.select( '#viz' ).selectAll( 'rect' )
			.data( data )
			.enter()
			.append( 'rect' )
			.attr( 'x', 260 )
			.attr( 'y', function ( d, i ) {
				return i * 30; 
			} )
			.attr( 'width', function ( d ) {
				return xScale( d.value );
			} )
			.attr( 'height', 20 )
			.style( 'fill', function ( d ) {
				return colors[d.location];
			} );

		d3.select( '#viz' ).selectAll( 'text' ).remove();
		d3.select( '#viz' ).selectAll( 'text.label' )
			.data( data )
			.enter()
			.append( 'text' )
			.classed( 'label', true )
			.attr( 'y', function ( d, i ) {
				return i * 30;
			} )
			.attr( 'x', 240 )
			.attr( 'text-anchor', 'end' )
			.attr( 'fill', function ( d, i ) {
				return i % 2 === 0 ? 'transparent' : 'black';
			} )
			.text( function ( d ) {
				return d.topic;
			} );
		d3.select( '#viz' ).selectAll( 'text.value' )
			.data( data )
			.enter()
			.append( 'text' )
			.attr( 'y', function ( d, i ) {
				return i * 30 + 15;
			} )
			.attr( 'x', 270 )
			.attr( 'text-anchor', 'start' )
			.attr( 'fill', 'black')
			.text( function ( d ) {
				return ( Math.round( d.value * 10000 ) / 100 ) + '%';
			} );
	};

	render();

} );