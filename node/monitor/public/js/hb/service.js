$( document ).ready(function() {

	$.svc_monitor = {};
	$.svc_monitor.mem_plot = {};
	$.svc_monitor.mem_used_plot = {};
	$.svc_monitor.mem_total_plot = {};
	$.svc_monitor.req_rate_plot = {};

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
		$.svc_monitor.mem_plot = $.jqplot ('mem', [mem_used, mem_total], {
			title: 'Heap Memory Usage'
		});
		$.svc_monitor.mem_used_plot = $.jqplot ('mem_used', [mem_used], {
			title: 'Heap Memory Usage: Used'
		});
		$.svc_monitor.mem_total_plot = $.jqplot ('mem_total', [mem_total], {
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
		$.svc_monitor.req_rate_plot = $.jqplot ('req_rate', [rates], {
			title: 'Requests Per Second'
		});

	});


	//Preiodically update
	setInterval(function(){
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

			if($.svc_monitor.mem_plot) {
				$.svc_monitor.mem_plot.destroy();
			}
			$.svc_monitor.mem_plot = $.jqplot ('mem', [mem_used, mem_total], {
				title: 'Heap Memory Usage'
			});

			if($.svc_monitor.mem_used_plot) {
				$.svc_monitor.mem_used_plot.destroy();
			}
			$.svc_monitor.mem_used_plot = $.jqplot ('mem_used', [mem_used], {
				title: 'Heap Memory Usage: Used'
			});

			if($.svc_monitor.mem_total_plot) {
				$.svc_monitor.mem_total_plot.destroy();
			}
			$.svc_monitor.mem_total_plot = $.jqplot ('mem_total', [mem_total], {
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

			if($.svc_monitor.req_rate_plot) {
				$.svc_monitor.req_rate_plot.destroy();
			}
			$.svc_monitor.req_rate_plot = $.jqplot ('req_rate', [rates], {
				title: 'Requests Per Second'
			});

		});
	},2000);
	
});