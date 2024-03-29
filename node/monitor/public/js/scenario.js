//Based on http://jsplumbtoolkit.com/demo/statemachine/demo-jquery.js
var live_connections = new Array();

//The number of updates already applied
var update_index = 0;

var service_update_index = 0;

;(function() {
	jsPlumb.ready(function() {

		//TODO: Revise this and remove the hidden section
		$('#scenario_config').hide();

		//Invoke service for user
		$('.try-it').click(function() {
			//Render serverside and get the output
			$.post("/try_it", {link : $(this).data('link')}, function (data) {
				alert(data);
				// location.replace('/scenario?type=' + $('#scenario_type').text() + '&s_id=' + $('#scenario_id').text() + '&test=abc');
			});
		});

		//Decide service toggle button display
		$('.svc_status').each(function() {
			if (this.id == -1) {
				$('#btn_toggle_svc').text('Start Services');
				$('#btn_toggle_svc').removeClass('btn-danger').addClass('btn-default');
			}
		});

		//Toggle services
		$('.svc_toggle').click(function() {
			var svcs_toggle = new Array();
			var count = 0;
			$('.svc_name').each(function() {
				svc_data = this.id.split("_");
				svcs_toggle[count] = new Array();
				svcs_toggle[count].push(svc_data[1]);
				svcs_toggle[count].push(svc_data[0]);
				count++;
			});

			if ($(this).hasClass('btn-default')) {
				for (var i=0; i<count; i++) {
					if (svcs_toggle[i][1] == -1) {

						var svc_id = svcs_toggle[i][0];
						$.post("/toggle_service", {service_id : svc_id}, function (data) {
							location.reload();
						});
					}
				}
			} else {
				for (var i=0; i<count; i++) {
					if (svcs_toggle[i][1] != -1) {

						var svc_id = svcs_toggle[i][0];
						$.post("/toggle_service", {service_id : svc_id}, function (data) {
							location.reload();
						});
					}
				}
			}
		});


		// setup some defaults for jsPlumb.
		var instance = jsPlumb.getInstance({
			Endpoint : ["Dot", {radius:2}],
			HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:2 },
			ConnectionOverlays : [
				[ "Arrow", {
					location:1,
					id:"arrow",
					length:14,
					foldback:0.8
				} ],
				[ "Label", { label:"FOO", id:"label", cssClass:"aLabel" }]
			],
			Container:"scenario-container"
		});

		var windows = jsPlumb.getSelector(".w");

		instance.draggable(windows);

		instance.bind("click", function(c) {
			instance.detach(c);
		});

		instance.bind("connection", function(info) {
			info.connection.getOverlay("label").setLabel('');
		});

		instance.doWhileSuspended(function() {
			instance.makeSource(windows, {
				filter:".ep",       // only supported by jquery
				anchor:"Continuous",
				connector:["Straight"],
				connectorStyle:{ strokeStyle:"#6E6E6E", lineWidth:2, outlineColor:"transparent", outlineWidth:4 },
				maxConnections:6,
				onMaxConnections:function(info, e) {
					alert("Maximum connections (" + info.maxConnections + ") reached");
				}
			});

			// initialise all '.w' elements as connection targets.
			instance.makeTarget(windows, {
				dropOptions:{ hoverClass:"dragHover" },
				anchor:"Continuous"
			});

			var s_id = $('#scenario_id').text();
			var s_type = $('#scenario_type').text();

			$.getJSON( "/scenario_topology?type=" + s_type + "&s_id=" + s_id, function( data ) {

				//Default service states
				for(var i = 0; i < data.services.length; i++) {
					var service = data.services[i];
					if($('#service' + service).data('port') == -1) {
						$('#service' + service).addClass('svc_stopped');
					} else {
						$('#service' + service).addClass('svc_live');
						$('#service_data_' + service).html('<div class=\'svc_content\'> Port:' + $('#service' + service).data('port') + '</div>');
					}
				}

				//Override service states
				if(typeof data.status != 'undefined') {
					for(var i = 0; i < data.status.length; i++) {
						var svc_status = data.status[i];
						// $('#service' + svc_status.service).removeClass('svc_live');
						$('#service' + svc_status.service).addClass(svc_status.status);
					}
				}

				//If the topology definition provides position information
				if(typeof data.pos != 'undefined') {
					for(var i = 0; i < data.pos.length; i++) {
						var pos = data.pos[i];
						$('#service' + pos.id).css({
							left : pos.x,
							top : pos.y
						});
					}
				} else {

					//Generate Positions
					var left = 0;
					var top = 0;
					var count = 0;
					$(".w").each(function(i) {
						$(this).css({
							left: left,
							top: top
						});

						if(count%2 > 0) {
							left += 150;
							top += 150;
						} else {
							left += 300;
						}
						count++;

						if(left > 500) {
							left = 0;
						}
					});

				}

				//Create connections
				for(var i = 0; i < data.connections.length; i++) {
					var conn = data.connections[i];
					var c = jsPlumb.connect({ source:'service' + conn[0],
										target:'service' + conn[1],
										anchor:"Continuous",
										connector:["Straight"],
										paintStyle:{ lineWidth:2, strokeStyle:"#6E6E6E" },
										endpoint: "Blank",
										overlays:[
											["Arrow", {
												location:1,
												id:"arrow",
												length:14,
												foldback:0.8
											}]
										]
									});

					//Store the connection globally to be able to access it later
					var connections_from = live_connections[conn[0]];
					if( connections_from == null) {
						connections_from = new Array();
						live_connections[conn[0]] = connections_from;
					}
					connections_from[conn[1]] = c;

				}

				//Populate actions
				if(typeof data.actions != 'undefined') {
					var action_html = "";
					for(var i = 0; i < data.actions.length; i++) {
						var action = data.actions[i];
						action_html += "<div class='panel'><button data-url='" + action.invoke_url + "' class='btn svc_act btn-default'><img height='35px' src='images/" + action.type + ".png'/>" + action.name + "</button></div>";
					}
					$('#scenario-actions').html(action_html);
				}

				$('.svc_act').click(function() {
					$.post('/svc_action', {link : $(this).data('url')}, function( data ) {
						alert(data);
					});
				});


				//Periodically get connection updates
				setInterval(function() {

					$.get('/get_connection_updates?from=' + update_index, function(updates) {

						update_index += updates.length;

						for(var i = 0; i < updates.length; i++) {
							var update = updates[i];
							if(update.action == 'break') {

								//See if we have the from connection
								var connections_from = live_connections[update.from];
								if(connections_from != null) {

									//See if we have the to connection
									var conn = connections_from[update.to];

									if(typeof conn != 'undefined') {
										//break connection
										jsPlumb.detach(conn);
									}
								}
							} else {

								var c = jsPlumb.connect({ source:'service' +  update.from,
											target:'service' +  update.to,
											anchor:"Continuous",
											connector:["Straight"],
											paintStyle:{ lineWidth:4 , strokeStyle:"#81BEF7" },
											endpoint: "Blank",
											overlays:[
												["Arrow", {
													location:1,
													id:"arrow",
													length:14,
													foldback:0.8
												}]
												]
										});
							}
						}
					});
				}, 1000);

			});

		});
	});


})();


$( document ).ready(function() {

	//Get the list of interaction authorization algos
	$.get('/get_int_authz_algo_list', function(algos) {

		var algos_html = '';
		for(var i = 0; i < algos.length; i++) {
			algos_html += "<div class='panel'>" + algos[i].name + '</div>';
		}
		$('#int-authz-policies').html(algos_html);
	});

	//Preiodically refresh trust values
	setInterval(function() {
		// $('#trust-mgmt-policies').hide()
		// $('#trust-mgmt-policies').html('')
		var s_id = $('#scenario_id').text();
		var s_type = $('#scenario_type').text();
		$.get('/get_scenario_trust_levels?type=' + s_type + '&s_id=' + s_id, function(algos) {
			var algos_html = '';

			$('.service_trust_data').each(function() {
				$(this).html('');
			});

			for(var i = 0; i < algos.length; i++) {
				var tm_name = algos[i].trust_module;
				var services = algos[i].services;
				algos_html += "<div class='panel col-md-4'>";
				algos_html += "<h4>" + tm_name + "</h4>";
				algos_html += "<table class='table table-striped table-bordered'>";
				algos_html += "<tr><th>Service</th><th>Trust Level</th></tr>";
				for(var j = 0; j < services.length; j++) {
					algos_html += "<tr><td>" + services[j].display_name + "</td><td>" + services[j].trust_level + "</td></tr>";
					$('#service_trust_' + services[j].id).append('<tr class=\'svc_content_tl\'><td>' + tm_name + '</td><td>' + services[j].trust_level.toFixed(3) + '</td></tr>');
				}
				algos_html += "</table>";
				algos_html += "</div>";
			}
			$('#trust-mgmt-policies').html(algos_html);

		});
	}, 1000);


	//Periodically get service updates
	setInterval(function() {

		$.get('/get_service_updates?from=' + service_update_index , function(updates) {

			service_update_index += updates.length;

			for(var i = 0; i < updates.length; i++) {
				var update = updates[i];
				if(update.action == 'add') {
					$('#service' + update.service).addClass(update.state);
				} else {
					$('#service' + update.service).removeClass(update.state);
				}
			}
		});
	}, 1000);

});
