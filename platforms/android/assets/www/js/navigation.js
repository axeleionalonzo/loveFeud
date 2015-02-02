( function( $, undefined ) {
// Helper function that splits a URL just the way we want it
var processHash = function( url ) {
    var parsed = $.mobile.path.parseUrl( url ),
        queryParameters = {},
        hashQuery = parsed.hash.split( "?" );
    // Create name: value pairs from the query parameters
    $.each( ( hashQuery.length > 1 ? hashQuery[ 1 ] : "" ).split( "&" ), function() {
        var pair = this.split( "=" );
        if ( pair.length > 0 && pair[ 0 ] ) {
            queryParameters[ pair[ 0 ] ] =
                ( pair.length > 1 ? pair[ 1 ] : true );
        }
    });
    return {
        parsed: parsed,
        cleanHash: ( hashQuery.length > 0 ? hashQuery[ 0 ] : "" ),
        queryParameters: queryParameters
    };
};
$.mobile.document
    // When the page is about to change, we may want to modify the navigation process to
    // accommodate same-page navigation. Since we wish to make it appear as though we're navigating
    // between different pages, we need to queue the page update to occur right at the halfway
    // point of the transition associated with page-to-page navigation.
    .on( "pagecontainerbeforechange", function( event, data ) {
        var processedHash;
        if ( typeof data.toPage === "string" ) {
            processedHash = processHash( data.toPage );
            // We only affect navigation behavior when going to #question-page
            if ( processedHash.cleanHash === "#question-page" ) {
                // Set the url of the page - this will be used by navigation to set the
                // URL in the location bar
                $( "#question-page" ).jqmData( "url", processedHash.parsed.hash );
                // Allow same-page transition when coming from #question page
                data.options.allowSamePageTransition = ( data.options.fromPage &&
                    data.options.fromPage.attr( "id" ) === "question-page" );
                // Update the page when the outgoing animation completes. This involves two things:
                // 1. Removing the active class from the button used for navigation.
                // 2. Updating the page to make it look like the destination page.
                $.mobile.activePage.animationComplete( function() {
                    $.mobile.removeActiveLinkClass( true );
                    // Set the title from the query parameters
                    $( "#section" ).text( processedHash.queryParameters.section );
                });
            } elseif ( processedHash.cleanHash === "#question-page2" ) {
                $( "#question-page2" ).jqmData( "url", processedHash.parsed.hash );
                data.options.allowSamePageTransition = ( data.options.fromPage &&
                    data.options.fromPage.attr( "id" ) === "question-page2" );
                $.mobile.activePage.animationComplete( function() {
                    $.mobile.removeActiveLinkClass( true );
                    $( "#section" ).text( processedHash.queryParameters.section );
                });
            } elseif ( processedHash.cleanHash === "#third-page" ) {
                $( "#third-page" ).jqmData( "url", processedHash.parsed.hash );
                data.options.allowSamePageTransition = ( data.options.fromPage &&
                    data.options.fromPage.attr( "id" ) === "third-page" );
                $.mobile.activePage.animationComplete( function() {
                    $.mobile.removeActiveLinkClass( true );
                    $( "#section" ).text( processedHash.queryParameters.section );
                });
            } elseif ( processedHash.cleanHash === "#displayDataPage" ) {
                $( "#displayDataPage" ).jqmData( "url", processedHash.parsed.hash );
                data.options.allowSamePageTransition = ( data.options.fromPage &&
                    data.options.fromPage.attr( "id" ) === "displayDataPage" );
                $.mobile.activePage.animationComplete( function() {
                    $.mobile.removeActiveLinkClass( true );
                    $( "#section" ).text( processedHash.queryParameters.section );
                });
            } elseif ( processedHash.cleanHash === "#displayDataPage_player2" ) {
                $( "#displayDataPage_player2" ).jqmData( "url", processedHash.parsed.hash );
                data.options.allowSamePageTransition = ( data.options.fromPage &&
                    data.options.fromPage.attr( "id" ) === "displayDataPage_player2" );
                $.mobile.activePage.animationComplete( function() {
                    $.mobile.removeActiveLinkClass( true );
                    $( "#section" ).text( processedHash.queryParameters.section );
                });
            }
        }
    });
})( jQuery );