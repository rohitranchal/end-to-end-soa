$( document ).ready(function() {

	$('.service').each(function() {
		var svc_id = $(this).attr('id');

		$.get('./get_service_stats?id=' + svc_id, function(stats) {
			var to = stats.to;
			var from = stats.from;

			$('#service_name_' + svc_id).text(stats.svc_data.display_name);

			if(to.modules.length == 0) {
				$('#service_panel_' + svc_id).remove();
			}

			var chart_added = false;

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

				if(chart.length != 0) {

					chart_added = true;
					$('#' + svc_id).append('<div id = "' + svc_id+ '_' + i + '"></div>');
					var plot1 = $.jqplot(svc_id + '_' + i, [chart], {
						title: mod_name,
						series:[{showMarker:false}],
						axes:{
							xaxis:{
								label:'Interactions', min:0,
							},
							yaxis:{
								label:'Trust Value', min:0, max:1
							}
						}
					});

				}
			}

			if(chart_added == false) {
				$('#' + svc_id).remove();
			}
			
		});
	});

	$('.collapse').collapse()

});