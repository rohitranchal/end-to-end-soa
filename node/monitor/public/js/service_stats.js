$( document ).ready(function() {
	var svc_id = $('#service_id').text();
	$.get('./get_service_stats?id=' + svc_id, function(stats) {

		var to = stats.to;
		var from = stats.from;

		for(var i  = 0; i < to.modules.length; i++) {
			var mod_name = to.modules[i].trust_module;
			
			var chart = new Array();

			//Go through to.data to gather values for this module
			for(var j = 0; j < to.data.length; j++) {
				var entry = to.data[j];

				//If the entry is for this trust module
				if(entry.trust_module == mod_name) {

					//Get the post trust value of to service
					chart[chart.length] = entry.to_post;
				}
			}

			//Add a div for the chart
			$('#trust_values_to').append('<div id ="to_' + i + '" style="height:300px; width:1000px;">');
			var plot1 = $.jqplot('to_' + i, [chart], {
				title: mod_name,
				series:[{showMarker:false}],
				axes:{
					xaxis:{
						label:'Interactions', min:0
					},
					yaxis:{
						label:'Trust Value', min:0, max:1
					}

				}
			});
		}

	});
});