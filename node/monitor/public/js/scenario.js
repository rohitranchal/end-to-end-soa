//Based on http://jsplumbtoolkit.com/demo/statemachine/demo-jquery.js
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
				location.reload();
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
						console.log('Start id:' + svcs_toggle[i][0]);
						var svc_id = svcs_toggle[i][0];
						$.post("/toggle_service", {service_id : svc_id}, function (data) {
							location.reload();
						});
					}
				}
			} else {
				for (var i=0; i<count; i++) {
					if (svcs_toggle[i][1] != -1) {
						console.log('Stop id:' + svcs_toggle[i][0]);
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
					instance.connect({ source:'service' + conn[0],
										target:'service' + conn[1],
										paintStyle:{ strokeStyle:"red", lineWidth:10 }});
				}

				//Populate actions
				if(typeof data.actions != 'undefined') {
					var action_html = "";
					for(var i = 0; i < data.actions.length; i++) {
						var action = data.actions[i];
						action_html += "<div class='panel'><button data-url='" + action.invoke_url + "' class='btn svc_act btn-default'><img height='50px' src='images/" + action.type + ".png'/>" + action.name + "</button></div>";
					}
					$('#scenario-actions').html(action_html);
				}

				$('.svc_act').click(function() {
					$.post('/svc_action', {link : $(this).data('url')}, function( data ) {
						alert(data);
						location.reload();
					});
				});

			});

		});
	});

	//Get the list of interaction authorization algos
	$.get('/get_int_authz_algo_list', function(algos) {

		var algos_html = '';
		for(var i = 0; i < algos.length; i++) {
			algos_html += "<div class='panel'>" + algos[i].name + '</div>';
		}
		$('#int-authz-policies').html(algos_html);
	});

	//Get the list of trust management algos
	$.get('/get_trust_algo_list', function(algos) {

		var algos_html = '';
		for(var i = 0; i < algos.length; i++) {
			algos_html += "<div class='panel'>" + algos[i].name + '</div>';
		}
		$('#trust-mgmt-policies').html(algos_html);
	});

})();