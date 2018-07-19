var formModule = (function(window, $) {

    function _init() {
        _initializeAddressSearchInput();
        _initializeAddressSearchRadiusRangeSlider();
        _initializeDateRange();
        _initializeLastUpdatedDateText();

		_initializedShowHideTimePeriod();
    }

	function _initializedShowHideTimePeriod()
	{
		/**/
		$("#data-updated").appendTo('#date-range-picker');

		$("#TimePeriodButton").hover
		(
			function(e)
			{
				//$("#data-updated").toggle();
				$("#TimePeriodButton").attr("data-title",$("#data-updated").html().slice(3,-4));
			}
		);

		/**
		$("#TimePeriodButton").on
		(
			'click',
			function(e)
			{
				$("#data-updated").toggle();
			}
		);
		/**/
	}

	function _initializeAddressSearchInput()
	{

		var client = new MapboxClient(resourceTokensModule.MAPBOX_ACCESS_TOKEN);
		$( "#input-address" ).autocomplete(
		{
			source: function (request, response)
			{
				var ResultDate = []	; //geocodeForward
				client.geocodeForward(request.term + ", San Francisco, California, United States", function(err, data, res)
				{
					data.features.forEach(function(item, i, arr)
					{
						var Temp = [];
						Temp.label = item.place_name;
						Temp.id = item.id;
						Temp.properties = item.properties;
						Temp.geometry = item.geometry;
						ResultDate.push(Temp);
					});
					$(".ui-front").css("z-index", "1000");
					$("#ui-id-1").css("z-index", "1000");
					response(ResultDate);
				});
			},
			minLength: 3,
			select: function (event, ui)
			{
				var selectedOption = [];
				selectedOption.name = ui.item.name;
				selectedOption.latitude = ui.item.geometry.coordinates[1];
				selectedOption.longitude = ui.item.geometry.coordinates[0];

				_afterAddressSelect(selectedOption);
				return false;
            }
		});
	}

/************************************************************************************
    function _initializeAddressSearchInput() {
        $('#input-address').typeahead({
            source: addressService.getAddressSuggestions,
            minLength: 4,
            items: 10,
            delay: 150,
            display: 'text',
            afterSelect: _afterAddressSelect
          });
    }
/************************************************************************************/



    function _initializeAddressSearchRadiusRangeSlider() {
        $('#range-slider').noUiSlider({
            start: viewModelModule.searchRadius,
            step: 1,
            connect: 'lower',
            range: {
                min: [0],
                max: [5280]
            }
        })
        .on({
            set: function() {
                viewModelModule.searchShapeType = 'radial';
                viewModelModule.searchRadius = $(this).val();
                pageModule.loadIncidentData();
            }
        })
        .Link('lower').to($('#range-slider-input'), null, wNumb({
            decimals: 0
        }));
    }

    function _initializeDateRange() {

        var startDate = moment(viewModelModule.startDate);
        var endDate = moment(viewModelModule.endDate);
				var currentYear = (new Date()).getFullYear();

				// remove year if current year
				if (startDate.year() === currentYear && endDate.year() === currentYear) {
						startDate = startDate.format('MMM DD');
						endDate = endDate.format('MMM DD');
						}
				else {
						startDate = startDate.format('MMM DD, YYYY');
						endDate = endDate.format('MMM DD, YYYY');
						}

        $('#daterange').html(startDate + ' - ' + endDate).addClass( 'active' );

        $('#daterange').daterangepicker({
            ranges: {
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Quarter': [moment().startOf('quarter'), moment().endOf('quarter')],
                'Last Quarter': [moment().subtract(3, 'months').startOf('quarter'), moment().subtract(3, 'months').endOf('quarter')],
                'This Year': [moment().startOf('year'), moment()],
                'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
            },
            startDate: moment().subtract(44, 'days'),
            endDate: moment().subtract(14, 'days'),
            format: 'MM/DD/YYYY',
            opens: "left"
        }, function(startDate, endDate) {
						// remove year if current year
						if (startDate.year() === currentYear && endDate.year() === currentYear) {
								var formattedStartDate = startDate.format('MMM DD');
								var formattedEndDate = endDate.format('MMM DD');
								}
						else {
								var formattedStartDate = startDate.format('MMM DD, YYYY');
								var formattedEndDate = endDate.format('MMM DD, YYYY');
								}

            viewModelModule.startDate = startDate.format('YYYY-MM-DD');
            viewModelModule.endDate = endDate.format('YYYY-MM-DD');

            $('#daterange').html(formattedStartDate + ' - ' + formattedEndDate);

            pageModule.loadIncidentData();
        });
    }

    function _initializeLastUpdatedDateText() {
        incidentService.findMostRecentIncident(function(mostRecentIncident) {
            $('#data-updated').html('No data available after &nbsp;'
              + moment(mostRecentIncident.date).format('MMM DD, YYYY'));
        });
    }

    function _afterAddressSelect(selectedOption) {
        viewModelModule.searchShapeType = 'radial';
        viewModelModule.searchAddress = selectedOption.name;
        viewModelModule.latitude = selectedOption.latitude;
        viewModelModule.longitude = selectedOption.longitude;

        pageModule.loadIncidentData();
    }

    return {
        init: _init
    };

})(window, jQuery);
