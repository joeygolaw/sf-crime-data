$(document).ready(function()
{
	// Initiates search parameters in URL after everything loads
	$(window).load(function(e) {
		window.location.hash = '';
		window.location.hash = '#' + 'search';
		});


    init();

    function init()
	{
        //moment.suppressDeprecationWarnings = true;

        window.addEventListener('popstate', urlSearchModule.initializeViewModelFromUrlParameters);

		urlSearchModule.initializeViewModelFromUrlParameters();
        formModule.init();
        mapModule.init();
        tableModule.init();


		$(":checkbox").change
		(
			function(e)
			{
				mapModule.drawIncidents(false);
			}
		);

		$(".ButtonExportCrimeData").click
		(
			function(e)
			{
				mapModule.toCSV();
			}
		);

		$("#ButtonViewDataset").click(function(e) {
			if($('body').hasClass('search-active')) {
				mapModule.ShowDataSet();
				}
			else {
				alert('There\'s no data to view. Try searching again.')
				}
			});

		$( "#ViewDataSet" ).dialog
		(
			{
				autoOpen: false,
				closeOnEscape: true,
				height: "auto",
//				minHeight: 400,
//				minWidth: 400,
				modal: true,
				position:
				{
					my: "center",
					at: "center",
					of: window,
					collision: "fit",
				},
				resizable: true,
				title: "View Dataset",
				buttons:
				[
					{
						text: "Export Crime Data",
						"class": 'bigger heavy button',
						click: function(e)
						{
							mapModule.toCSV();
						}
					}
				]
			}
		);

		inputSearch();
		inputDropdown();
		presetDateRange();
		}
	});
