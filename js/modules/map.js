	mapModule = (function(window,$)
	{

	var ResultJSON;

    var MAPBOX_ACCESS_TOKEN = resourceTokensModule.MAPBOX_ACCESS_TOKEN;
    var MAPBOX_MAP_STYLE_ID = 'lightfox.1n10e3dp';
    var MAP_CONTAINER_ELEMENT_ID = 'map';

//	var FIRST_RUN = true;

    var SEARCH_MARKER_GEOJSON = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: { 'marker-size': 'large' }
    };
/*the following objects sets the custom marker icons for each CSCategory*/
    var iconArray= ["crimeIcon", "assaultIcon","arsonIcon","burglaryIcon","datingIcon","domesticIcon",
    "drugsIcon",'hateIcon',"liquorIcon","motorIcon", "robberyIcon", "sexIcon", "stalkingIcon","weaponsIcon"];

    for(i=0; i<iconArray.length; i++){
      iconArray[i]= L.icon(
          {
              iconUrl: './gfx/' + iconArray[i] + '.svg',
              iconSize: [40,40],
              iconAnchor: [20,40],
              popupAnchor: [0,-35]
          }
        )
      }

/*the following is old code using built in Mapbox Maki icons
    var INCIDENT_MARKER_PROPERTIES = {
        'marker-color': '#000080',
        'marker-symbol': 'police',
        'marker-size': 'small'
    };*/

    var SHAPE_STYLE_SETTINGS = {
        color: '#0033ff',
        fillColor: '#0033ff',
        weight: 5,
        fillOpacity: 0.2,
        opacity: 0.5
    };


    var DRAW_CONTROL_SETTINGS = {
        draw: {
            polyline: false,
            polygon: { shapeOptions: SHAPE_STYLE_SETTINGS },
            rectangle: false,//{ shapeOptions: SHAPE_STYLE_SETTINGS },
            circle: false,//{ shapeOptions: SHAPE_STYLE_SETTINGS },
        }
    };

    var INCIDENT_CLUSTER_LAYER_SETTINGS = {
        showCoverageOnHover: false
    };

    var METERS_PER_FOOT = 0.3048;

    var searchAreaGroup = L.featureGroup();
    var incidentLayer, incidentClusterGroup;

    var map;

    function _init()
	{
        L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
        map = L.mapbox.map(MAP_CONTAINER_ELEMENT_ID, MAPBOX_MAP_STYLE_ID)
		.addControl(L.mapbox.geocoderControl('mapbox.places'));

		$(".mapbox-icon-geocoder").hide();

		/**
		L.mapbox.tileLayer('mapbox.satellite').addTo(map);
		L.mapbox.tileLayer('mapbox.places').addTo(map);
		**/


		var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{
			attribution: '&copy; <a href="http://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
		});

		var googleSatellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
		{
			subdomains:['mt0','mt1','mt2','mt3'],
			attribution: '&copy; <a href="https://www.google.com/permissions/geoguidelines.html" target="_blank">Google</a> contributors'
		});

		var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
		{
			subdomains:['mt0','mt1','mt2','mt3'],
			attribution: '&copy; <a href="https://www.google.com/permissions/geoguidelines.html" target="_blank">Google</a> contributors'
		});


		var baseLayers = {
			"OpenStreetMap": osm,
			"Google Satellite": googleSatellite,
			"Google Street": googleStreets
		};

		//L.control.layers(baseLayers/*, overlays/**/).addTo(map);

		/**/
		//var layerControl = L.control.layers(null, baseLayers, {position: 'topleft'});
		//layerControl.addTo(map);
		/**/
		//var layerControl = L.control({position: 'topleft'}).layers(baseLayers).addTo(map);

		/*
		var editableLayers = new L.FeatureGroup();

		DRAW_CONTROL_SETTINGS.edit =
		{
			draw:
			{
				polyline: false,
				polygon: false, //{ shapeOptions: SHAPE_STYLE_SETTINGS },
				rectangle: false, //{ shapeOptions: SHAPE_STYLE_SETTINGS },
				circle: false, //{ shapeOptions: SHAPE_STYLE_SETTINGS }
			},
			featureGroup: editableLayers
		};
		/**/
        var drawControl = new L.Control.Draw(DRAW_CONTROL_SETTINGS).addTo(map);


        searchAreaGroup.addTo(map);

        map.on('draw:created', _afterDraw);

		map.on('click', _afterDraw);


        var legend = L.control({position: 'topright'});
        legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
		/****/
        div.innerHTML = '<div> <button type="button" id="legend-button" class="button smaller" data-toggle="modal" data-target="#myLegend">' +
                        'Legend </button></div>'
		/****/
		/*
		div.innerHTML = '';
		var t = 		'<div sytle = "legend">' +
						'<button type="button" id="about-button" class="btn btn-primary btn-sm" >About </button><br>' +
						'<button type="button" id="about-button" class="btn btn-primary btn-sm" >How To </button><br>' +
						'<button type="button" id="legend-button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myLegend">Legend </button>' +
						'</div>';
		/**/
         return div;
         };
         legend.addTo(map);
         }

    function _afterDraw(e) {
        switch(e.layerType) {
            case 'polygon': _afterDrawPolygon(e);
                break;
            case 'rectangle': _afterDrawRectangle(e);
                break;
            case 'circle': _afterDrawCircle(e);
                break;
            case 'marker': _afterDrawMarker(e);
                break;

/****
			default:
				console.log(e);
				e.layer = new Object();
				e.layer._latlng = e.latlng;
				_afterDrawMarker(e);
			break;
/****/
        }
    }

    function _afterDrawPolygon(e) {
        viewModelModule.searchShapeType = 'polygon';
        viewModelModule.searchGeoJson = e.layer.toGeoJSON();
        viewModelModule.latitude = e.layer._latlngs[0].lat;
        viewModelModule.longitude = e.layer._latlngs[0].lng;
        viewModelModule.searchAddress = null;
        pageModule.loadIncidentData();
    }

    function _afterDrawRectangle(e) {
        viewModelModule.searchShapeType = 'polygon';
        viewModelModule.searchGeoJson = e.layer.toGeoJSON();
        viewModelModule.latitude = e.layer._latlngs[1].lat;
        viewModelModule.longitude = e.layer._latlngs[1].lng;
        viewModelModule.searchAddress = null;
        pageModule.loadIncidentData();
    }

    function _afterDrawCircle(e) {
        viewModelModule.searchShapeType = 'radial';
        viewModelModule.latitude = e.layer._latlng.lat;
        viewModelModule.longitude = e.layer._latlng.lng;
        viewModelModule.searchRadius = _convertFromMetersToFeet(e.layer._mRadius);
        viewModelModule.searchAddress = null;
        pageModule.loadIncidentData();
    }

    function _afterDrawMarker(e) {
        viewModelModule.searchShapeType = 'radial';
        viewModelModule.latitude = e.layer._latlng.lat;
        viewModelModule.longitude = e.layer._latlng.lng;
        viewModelModule.searchAddress = null;
        pageModule.loadIncidentData();
    }

    function _drawPolygonIncidents(incidentGeoJson) {
        _drawPolygonSearchArea();
        _drawIncidents(incidentGeoJson);
    }

    function _drawRadialIncidents(incidentGeoJson) {
        _drawRadialSearchArea();
        _drawIncidents(incidentGeoJson);
    }

    function _drawPolygonSearchArea() {
        var searchAreaGeoJson = viewModelModule.searchGeoJson;
        var searchAreaLayer = L.mapbox.featureLayer(searchAreaGeoJson)
            .setStyle(SHAPE_STYLE_SETTINGS);

        searchAreaGroup.clearLayers()
            .addLayer(searchAreaLayer);
    }

    function _drawRadialSearchArea() {
        var latitude = viewModelModule.latitude,
            longitude = viewModelModule.longitude,
            radius = _convertFromFeetToMeters(viewModelModule.searchRadius);

        var searchMarkerGeoJson = $.extend(true, {}, SEARCH_MARKER_GEOJSON, {
            geometry: { coordinates: [ longitude, latitude ] }
        });

        var searchMarkerLayer = L.mapbox.featureLayer(searchMarkerGeoJson);
        var searchAreaLayer = L.circle([latitude, longitude], radius);

        searchAreaGroup.clearLayers()
            .addLayer(searchMarkerLayer)
            .addLayer(searchAreaLayer);
    }
    /*_drawIncident function is the actual rendering process of putting a incdidentGeoJson on
    to a map*/
    function _drawIncidents(incidentGeoJson)
	{
		if ("boolean" != typeof incidentGeoJson)
			ResultJSON = incidentGeoJson;
		$("#records-match-count").html(ResultJSON.features.length);

		// Add class to body when search has results.
		// This class is used to check for search results when "View Dataset" button is clicked.
		// A browser alert is shown when there's no search results (defined in "start.js").
		if(ResultJSON.features.length === undefined) {
			$('body').removeClass('search-active');
			}
		else if(ResultJSON.features.length === 0) {
			$('body').removeClass('search-active');
			}
		else {
			$('body').addClass('search-active');
			}


		var General_Crime_count = 0;
		var Arson_count = 0;
		var Assault_count = 0;
		var Burglary_count = 0;
		var Dating_Violence_count = 0;
		var Domestic_Violence_count = 0;
		var Drug_Possession_count = 0;
		var Hate_Crime_count = 0;
		var Liquor_Violation_count = 0;
		var Motor_Vehicle_Theft_count = 0;
		var Robbery_count = 0;
		var Sex_Crimes_count = 0;
		var Stalking_count = 0;
		var Weapons_Possessions_count = 0;

        if(incidentLayer)
		{
            map.removeLayer(incidentLayer)
        }

        if(incidentClusterGroup)
		{
            map.removeLayer(incidentClusterGroup);
        }
        /*makes a MapBox featurelayer that adds geojson to a map read lyzidiamond.com/posts/external-geojson-mapbox*/
        incidentLayer = L.mapbox.featureLayer();
        /*maker clustering with leaflet read: asmaloney.com/2015/06/code/clustering-markers-on-leaflet-maps*/
        incidentClusterGroup = new L.MarkerClusterGroup(INCIDENT_CLUSTER_LAYER_SETTINGS);
        /*the below code is the old way of assigning icon to a incident using built in mapbox Maki icons*/
        /*$.each(incidentGeoJson.features, function(index, feature) {
            $.extend(feature.properties, INCIDENT_MARKER_PROPERTIES);
        });*/
        /*the following is the actual descision making process of assigning icons to a certain CSCategory*/
        //incidentLayer.setGeoJSON(incidentGeoJson).eachLayer(function(layer)

		//var iconArray= ["crimeIcon", "assaultIcon","arsonIcon","burglaryIcon","datingIcon","domesticIcon","drugsIcon",'hateIcon',"liquorIcon","motorIcon", "robberyIcon", "sexIcon", "stalkingIcon","weaponsIcon"];
		incidentLayer.setGeoJSON(ResultJSON).eachLayer(function(layer)
		{
			var show = false;
          //this line below changes icon using leaflet Icon objects.
			switch(true)
			{
				case (layer.feature.properties.cscategory==="AGGRAVATED ASSAULT"):
					layer.setIcon(iconArray[1]);
					Assault_count++;
					if ($("#assault").is(':checked'))
						show = true;
				break;

				case(layer.feature.properties.cscategory==="ARSON"):
					layer.setIcon(iconArray[2]);
					Arson_count++;
					if ($("#arson").is(':checked'))
						show = true;
				break;

				case (layer.feature.properties.cscategory==="BURGLARY"):
					layer.setIcon(iconArray[3]);
					Burglary_count++;
					if ($("#burglary").is(':checked'))
						show = true;
				break;

				case (layer.feature.properties.cscategory==="DATING VIOLENCE"):
					layer.setIcon(iconArray[4]);
					Dating_Violence_count++;
					if ($("#dating-violence").is(':checked'))
						show = true;
				break;

				case(layer.feature.properties.cscategory==="DOMESTIC VIOLENCE"):
					layer.setIcon(iconArray[5]);
					Domestic_Violence_count++;
					if ($("#domestic-violence").is(':checked'))
						show = true;
				break;

				case(layer.feature.properties.cscategory==="DRUG-RELATED VIOLATIONS"):
					layer.setIcon(iconArray[6]);
					Drug_Possession_count++;
					if ($("#drug-possession").is(':checked'))
						show = true;
				break;

				case(layer.feature.properties.cscategory==="HATE CRIMES"):
					layer.setIcon(iconArray[7])
					Hate_Crime_count++;
					if ($("#hate-crime").is(':checked'))
						show = true;
				break;

				case(layer.feature.properties.cscategory==="LIQUOR LAW VIOLATIONS"):
					layer.setIcon(iconArray[8]);
					Liquor_Violation_count++;
					if ($("#liquor-violation").is(':checked'))
						show = true;
				break;

				case(layer.feature.properties.cscategory==="MOTOR VEHICLE THEFT"):
					layer.setIcon(iconArray[9]);
					Motor_Vehicle_Theft_count++;
					if ($("#vehicle-theft").is(':checked'))
						show = true;
				break;

				case(layer.feature.properties.cscategory==="ROBBERY"):
					layer.setIcon(iconArray[10]);
					Robbery_count++;
					if ($("#robbery").is(':checked'))
						show = true;
				break;

				case(layer.feature.properties.cscategory==="SEX OFFENSES"):
					layer.setIcon(iconArray[11]);
					Sex_Crimes_count++;
					if ($("#sex-crimes").is(':checked'))
						show = true;
				break;

				case(layer.feature.properties.cscategory==="STALKING"):
					layer.setIcon(iconArray[12]);
					Stalking_count++;
					if ($("#stalking").is(':checked'))
						show = true;
				break;

				case(layer.feature.properties.cscategory==="WEAPONS POSSESSION"):
					layer.setIcon(iconArray[13]);
					Weapons_Possessions_count++;
					if ($("#weapons-possession").is(':checked'))
						show = true;
				break;

				default:
					layer.setIcon(iconArray[0]);
					General_Crime_count++;
					if ($("#general-crime").is(':checked'))
						show = true;
				break;
			}


			switch (layer.feature.properties.resolution.toLowerCase())
			{
				case ("Arrest, Booked").toLowerCase():
					if ($("#arrest-booked").is(':checked'))
						show = show && true;
					else
						show = show && false;
				break;

				case ("Arrest, Cited").toLowerCase():
					if ($("#arrest-cited").is(':checked'))
						show = show && true;
					else
						show = show && false;
				break;

				case ("Cleared-Contact Juvenile for more info").toLowerCase():
					if ($("#cleared-contact").is(':checked'))
						show = show && true;
					else
						show = show && false;
				break;

				case ("Exceptional Clearance").toLowerCase():
					if ($("#exceptional-clearance").is(':checked'))
						show = show && true;
					else
						show = show && false;
				break;

				case ("Juvenile Booked").toLowerCase():
					if ($("#juvenile-booked").is(':checked'))
						show = show && true;
					else
						show = show && false;
				break;

				default:
					if ($("#unfounded").is(':checked'))
						show = show && true;
					else
						show = show && false;
				break;
			}


			if (show)
			{
				incidentClusterGroup.addLayer(layer);
				layer.bindPopup(_buildIncidentPopupContent(layer.feature.properties));
			}
        });
        incidentLayer.clearLayers();

        map.addLayer(incidentLayer)
            .addLayer(incidentClusterGroup)
            .fitBounds(searchAreaGroup.getBounds());

		$("#Arson_count").html(Arson_count);
		$("#General_Crime_count").html(General_Crime_count);
		$("#Assault_count").html(Assault_count);
		$("#Burglary_count").html(Burglary_count);
		$("#Dating_Violence_count").html(Dating_Violence_count);
		$("#Domestic_Violence_count").html(Domestic_Violence_count);
		$("#Drug_Possession_count").html(Drug_Possession_count);
		$("#Hate_Crime_count").html(Hate_Crime_count);
		$("#Liquor_Violation_count").html(Liquor_Violation_count);
		$("#Motor_Vehicle_Theft_count").html(Motor_Vehicle_Theft_count);
		$("#Robbery_count").html(Robbery_count);
		$("#Sex_Crimes_count").html(Sex_Crimes_count);
		$("#Stalking_count").html(Stalking_count);
		$("#Weapons_Possessions_count").html(Weapons_Possessions_count);
    }

    function _buildIncidentPopupContent(properties) {
        var newDate = properties.date;
        var formattedDate = newDate.slice(5,7) + "/" + newDate.slice(8,10) + "/" + newDate.slice(0,4);
        return properties.descript + " on " + formattedDate;
    }

    function _convertFromFeetToMeters(feet) {
        return feet * METERS_PER_FOOT;
    }

    function _convertFromMetersToFeet(meters) {
        return meters / METERS_PER_FOOT;
    }

	function _toCSV() {

		var dateTime = new Date();
		var hh = dateTime.getHours();
		var h = hh;
		var m = dateTime.getMinutes();
		var s = dateTime.getSeconds();
		var dd = "AM";

		if (h >= 12) {
			h = hh - 12;
			dd = "PM";
			}
		if (h == 0) {
			h = 12;
			}

		h = h < 10 ? "0" + h : h;
		m = m < 10 ? "0" + m : m;
		s = s < 10 ? "0" + s : s;

		var FileName = "SF Crime Data Export — " + $.datepicker.formatDate('yy-mm-dd', dateTime) + " — " + h + "." + m + "." + s + " " + dd;
		var LineForShow = _GetOnlyForSave();
		var LineArray = new Array();

		LineArray[0] = '"date","time","address","category","cscategory","resolution","pddistrict","description","incidntnum"\r\n';

		LineForShow.forEach
		(
			function (item)
			{
				LineArray[LineArray.length] = 	'"' + item.properties.date + '","' +
													item.properties.time + '","' +
													item.properties.address + '","' +
													item.properties.category + '","' +
													item.properties.cscategory + '","' +
													item.properties.resolution + '","' +
													item.properties.pddistrict + '","' +
													item.properties.descriptn + '","' +
													item.properties.incidntnum + '"\r\n';
			}
		);

		saveAs(
				new Blob(LineArray,
				{
					type : 'text/csv'
				}),
				FileName + '.csv');
	}

	function _GetOnlyForSave()
	{
		var result = new Array();
		ResultJSON.features.forEach
		(
			function (item)
			{
				var show = false;
				switch(item.properties.cscategory)
				{
					case "AGGRAVATED ASSAULT":
						if ($("#assault").is(':checked'))
							show = true;
					break;

					case "ARSON":
						if ($("#arson").is(':checked'))
							show = true;
					break;

					case  "BURGLARY":
						if ($("#burglary").is(':checked'))
							show = true;
					break;

					case  "DATING VIOLENCE":
						if ($("#dating-violence").is(':checked'))
							show = true;
					break;

					case "DOMESTIC VIOLENCE":
						if ($("#domestic-violence").is(':checked'))
							show = true;
					break;

					case "DRUG-RELATED VIOLATIONS":
						if ($("#drug-possession").is(':checked'))
							show = true;
					break;

					case "HATE CRIMES":
						if ($("#hate-crime").is(':checked'))
							show = true;
					break;

					case "LIQUOR LAW VIOLATIONS":
						if ($("#liquor-violation").is(':checked'))
							show = true;
					break;

					case "MOTOR VEHICLE THEFT":
						if ($("#vehicle-theft").is(':checked'))
							show = true;
					break;

					case "ROBBERY":
						if ($("#robbery").is(':checked'))
							show = true;
					break;

					case "SEX OFFENSES":
						if ($("#sex-crimes").is(':checked'))
							show = true;
					break;

					case "STALKING":
						if ($("#stalking").is(':checked'))
							show = true;
					break;

					case "WEAPONS POSSESSION":
						if ($("#weapons-possession").is(':checked'))
							show = true;
					break;

					default:
						if ($("#general-crime").is(':checked'))
							show = true;
					break;
				}


				switch (item.properties.resolution.toLowerCase())
				{
					case ("Arrest, Booked").toLowerCase():
						if ($("#arrest-booked").is(':checked'))
							show = show && true;
						else
							show = show && false;
					break;

					case ("Arrest, Cited").toLowerCase():
						if ($("#arrest-cited").is(':checked'))
							show = show && true;
						else
							show = show && false;
					break;

					case ("Cleared-Contact Juvenile for more info").toLowerCase():
						if ($("#cleared-contact").is(':checked'))
							show = show && true;
						else
							show = show && false;
					break;

					case ("Exceptional Clearance").toLowerCase():
						if ($("#exceptional-clearance").is(':checked'))
							show = show && true;
						else
							show = show && false;
					break;

					case ("Juvenile Booked").toLowerCase():
						if ($("#juvenile-booked").is(':checked'))
							show = show && true;
						else
							show = show && false;
					break;

					default:
						if ($("#unfounded").is(':checked'))
							show = show && true;
						else
							show = show && false;
					break;
				}


				if (show)
				{
					result[result.length] = item;
				}
			}
		);
		return result;
	}

	function _ShowDataSet() {

		var LineForShow = _GetOnlyForSave();
		var table = '\n\n' +
			'\n\n<div class="dataset-table">' +
			'\n\n\n<div class="table-head-wrapper">' +
			'\n\n\n\n<table class="table-head">' +
			'\n\n\n\n\n<tr>' +
			'\n\n\n\n\n\n<th class="date"><span>Date</span></th>' +
			'\n\n\n\n\n\n<th class="time"><span>Time</span></th>' +
			'\n\n\n\n\n\n<th class="address"><span>Address</span></th>' +
			'\n\n\n\n\n\n<th class="category-sfpd"><span>Category<br><b>SFPD</b></span></th>' +
			'\n\n\n\n\n\n<th class="category-cs"><span>Category<br><b>Clery Act</b></span></th>' +
			'\n\n\n\n\n\n<th class="resolution"><span>Resolution</span></th>' +
			'\n\n\n\n\n\n<th class="district-sfpd"><span>District</span></th>' +
			'\n\n\n\n\n\n<th class="description"><span>Description</span></th>' +
			'\n\n\n\n\n\n<th class="incident-number"><span>Incident No.</span></th>' +
			'\n\n\n\n\n</tr>' +
			'\n\n\n\n</table>' +
			'\n\n\n</div>' +
			'\n\n' +
			'\n\n\n<div class="table-body-wrapper">' +
			'\n\n\n\n<table class="table-body">';

		LineForShow.forEach (
			function (item) {
				oldDate = item.properties.date;
				newDate = oldDate.slice(5,7) + "-" + oldDate.slice(8,10) + "-" + oldDate.slice(0,4);

				table += 	'\n\n\n\n<tr>' +
										'\n\n\n\n\n<td class="date"><span>' + newDate + '</td>' +
										'\n\n\n\n\n<td class="time"><span>' + item.properties.time + '</span></td>' +
										'\n\n\n\n\n<td class="address"><span>' + item.properties.address + '</span></td>' +
										'\n\n\n\n\n<td class="category-sfpd"><span>' + item.properties.category + '</span></td>' +
										'\n\n\n\n\n<td class="category-cs"><span>' + item.properties.cscategory + '</span></td>' +
										'\n\n\n\n\n<td class="resolution"><span>' + item.properties.resolution + '</span></td>' +
										'\n\n\n\n\n<td class="district-sfpd"><span>' + item.properties.pddistrict + '</span></td>' +
										'\n\n\n\n\n<td class="description"><span>' + item.properties.descriptn + '</span></td>' +
										'\n\n\n\n\n<td class="incident-number"><span>' + item.properties.incidntnum + '</span></td>' +
									'\n\n\n\n</tr>' +
									'\n\n';
				}
			);

		table += '\n\n' +
					'\n\n\n\n</table>' +
					'\n\n\n</div>' +
					'\n\n</div>';

		$("#ViewDataSetInfo").html(table.toLowerCase());
		$("#ViewDataSet").dialog({show: {effect: 'drop', direction: 'down', duration: 300}, hide: {effect: 'drop', direction: 'up', duration: 300}});
		$("#ViewDataSet").dialog("open");
	}

    return {
        init: _init,
        drawPolygonIncidents: _drawPolygonIncidents,
        drawRadialIncidents: _drawRadialIncidents,
		drawIncidents: _drawIncidents,
		toCSV: _toCSV,
		ShowDataSet: _ShowDataSet,
    };

})(window, jQuery);
