$( document ).ready(function() {
	$.get('/hb_stats_service_data?service=' + $('#service').text(), function (data) {
		
		//Chart arrays
		var mem_used = new Array();
		var mem_total = new Array();
		var uptime = 0;
		//populate chart data
		for(var i = 0; i < data.length; i++) {
			tmp = JSON.parse(data[i].data);
			mem_used[i] = tmp.process.memoryUsage.heapUsed/(1024*1024);
			mem_total[i] = tmp.process.memoryUsage.heapTotal/(1024*1024);
			uptime = tmp.process.uptime;
		}

		$('#uptime').text('Service uptime : ' + uptime);
		//Render chart
		var mem_plot = $.jqplot ('mem', [mem_used, mem_total], {
			title: 'Heap Memory Usage'
		});
		var mem_used_plot = $.jqplot ('mem_used', [mem_used], {
			title: 'Heap Memory Usage: Used'
		});
		var mem_total_plot = $.jqplot ('mem_total', [mem_total], {
			title: 'Heap Memory Usage: Total'
		});
	});


	$.get('/inflow_service_req_rates?service=' + $('#service').text(), function (data) {

		//Chart arrays
		var rates = new Array(20);

		//populate chart data
		for(var i = 0; i < data.length; i++) {
			rates[19-i] = data[i].count;
		}

		//Render chart
		var mem_plot = $.jqplot ('req_rate', [rates], {
			title: 'Requests Per Second'
		});
	});
	
});