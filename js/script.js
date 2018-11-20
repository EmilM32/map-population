
$(document).ready(function(){

	  var mymap = L.map('mapid').setView([52.071067, 19.391820],6);

    var openmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZW1pbG0zMiIsImEiOiJjam9oNHZlOXAwZnVzM2tvYTZyN3dqY3h6In0.YUiuPjlmHWA74lRsxrVTwg', {
  		maxZoom: 18,
  		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
  			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  		id: 'mapbox.streets'
  	});
    openmap.addTo(mymap);

    //EPSG:2180 POLAND
    proj4.defs('EPSG:2180', '+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_def');

    function onEachFeature(feature, layer) {
      if (feature.properties && feature.properties.nazwa) {
        layer.bindPopup(feature.properties.nazwa);
      }
			layer.on({
				 mouseover: highlightFeature,
				 mouseout: resetHighlight,
				 click: zoomToFeature
	 		})
    }

		function style(feature) {
			return {
		  	fillColor: getColor(feature.properties.populacja),
				weight: 2,
				opacity: 0.2,
				color: "#000000",
				fillOpacity: 0.7
			}
		}

    L.Proj.geoJson(wojewodztwa, {
	      onEachFeature: onEachFeature,
				style: style
	    }).addTo(mymap);

			function highlightFeature(e) {
		    var layer = e.target;

		    layer.setStyle({
							weight: 2,
							color: "#000000",
							fillOpacity: 0.9
				    });


				    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				        layer.bringToFront();
				    }

				info.update(layer.feature.properties);
			}

			function zoomToFeature(e) {
			    mymap.fitBounds(e.target.getBounds());
			}

			function resetHighlight(e) {
					var layer = e.target;

					layer.setStyle({
								weight: 2,
								color: "#000000",
								fillOpacity: 0.7
							});

					info.update();
			}

			var info = L.control();

			info.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'info');
			    this.update();
			    return this._div;
			};

			info.update = function (props) {
			    this._div.innerHTML = '<h4>Populacja</h4>' +  (props ?
			        '<b>' + props.nazwa + ':</b> ' + props.populacja + '<br />'
							+'<b>Mężczyźni:</b> ' + props.popul_m + '<br />'
							+'<b>Kobiety:</b> ' + props.popul_k
			        : 'Wybierz województwo');
			};

			info.addTo(mymap);

			function getColor(d) {
				return d > 5500000   ? '#5e1e04' :
						d > 4700000   ? '#7f2704' :
						d > 4000000   ? '#c34001' :
						d > 3500000   ? '#ee6510' :
						d > 2800000   ? '#fd9243' :
						d > 2200000   ? '#fdbd83' :
						d > 1500000   ? '#fee0c2' :
												 		'#fff5eb' ;
			}

			var legend = L.control({position: 'bottomright'});

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 1500000, 2200000, 2800000, 3500000, 4000000, 4700000, 5500000],
			        labels = [];

			    for (var i = 0; i < grades.length; i++) {
			        div.innerHTML +=
			            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
			            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
			    }

			    return div;
			};

			legend.addTo(mymap);

			L.Control.Watermark = L.Control.extend({
				    onAdd: function(map) {
								var div = L.DomUtil.create('div', 'watermark');

								div.innerHTML = "Województwa populacja";

								return div;

				    },

				    onRemove: function(map) {}
				});

				L.control.watermark = function(opts) {
				    return new L.Control.Watermark(opts);
				}

				L.control.watermark({ position: 'bottomleft' }).addTo(mymap);

});
