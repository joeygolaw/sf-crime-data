function inputSearch() {
	$( '.search-field input' ).on( 'focus', function() {
		$(this).parent().addClass( 'focus' );
		});

	$( '.search-field input' ).on( 'blur', function() {
		$(this).parent().removeClass( 'focus' );
		});
	};

function inputDropdown() {
	$( '.dropdown-button' ).on( 'click', function() {
		// Close any adjacent dropdowns
		if ($(this).parent( '.dropdown-field' ).siblings( '.dropdown-field' ).hasClass( 'active' )) {
			$(this).parent( '.dropdown-field' ).siblings( '.dropdown-field' ).removeClass( 'active' );
			$(this).parent( '.dropdown-field' ).siblings( '.dropdown-field' ).find( '.dropdown-field, .dropdown-popup' ).removeClass( 'active' );
			};

		// Close dropdown if already open
		if ($(this).parent( '.dropdown-field' ).hasClass('active')) {
			$(this).parent( '.dropdown-field' ).removeClass( 'active' );
			$(this).siblings( '.dropdown-popup' ).find( '.dropdown-field, .dropdown-popup' ).removeClass( 'active' );
			}

		// Open dropdown
		else {
			$(this).parent( '.dropdown-field' ).addClass( 'active' );
			$(this).siblings( '.dropdown-popup' ).addClass( 'active' );
			}

		event.stopPropagation();
		});

	$( '.dropdown-cancel' ).on( 'click', function() {
		$(this).closest( '.dropdown-field' ).removeClass( 'active' );
		$(this).closest( '.dropdown-field' ).find( '.dropdown-field, .dropdown-popup' ).removeClass( 'active' );

		event.stopPropagation();
		});
	};

function presetDateRange() {
	$( '#date-range-presets' ).on( 'click', '.button', function() {

		// Remove selected class from all other buttons
		$(this).siblings( '.button' ).removeClass( 'selected' );
		// Add selected class to clicked button
		$(this).addClass( 'selected' );
		// Close dropdown
		$(this).parents( '.dropdown-content' ).first().find( '.dropdown-field, .dropdown-popup, .dropdown-button' ).removeClass( 'active' );

		// Set date range variables
		var $button = $(this).closest( '.dropdown-field' ).children( '.dropdown-button' );
		var $previousTitle = $button.text();
		var $currentTitle = $(this).text();

		if ( $previousTitle == $currentTitle ) {
			// Do nothing
			}

		else {
			$button.text( $currentTitle );
			}
		});
	};
