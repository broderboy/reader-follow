jQuery(document).ready(function() {
	console.log('hi');
	jQuery('#contacts').dataTable( {
		"bJQueryUI": true,
		"sScrollY": "400px",
        "bPaginate": false,
        "bStateSave": true,
        "aaSorting": [[2,'asc']],
        "bProcessing": true
	} );
} );