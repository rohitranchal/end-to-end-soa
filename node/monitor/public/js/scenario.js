//Based on http://jsplumbtoolkit.com/demo/statemachine/demo-jquery.js
;(function() {
	jsPlumb.ready(function() {

		//Invoke service for user
		$('.try-it').click(function() {
			//Reder serverside and get the output
			$.post("/try_it", {link : $(this).data('link')}, function (data) {
				location.reload();
			});
		});

		//Handle update service trust levels
		$("#btn_update_tl").click(function() {
			//Get new values
			var vals = new Array();
			$(".form-control").each( function() {
				vals[vals.length] = {name : this.id, value: $(this).val()};
			});

			$.post("/update_service_tl", {values : vals}, function (data) {
				location.reload();
			});

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
				filter:".ep",				// only supported by jquery
				anchor:"Continuous",
				connector:["Straight"],
				connectorStyle:{ strokeStyle:"#5c96bc", lineWidth:2, outlineColor:"transparent", outlineWidth:4 },
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
				for(var i = 0; i < data.connections.length; i++) {
					var conn = data.connections[i];
					instance.connect({ source:'service' + conn[0], 
										target:'service' + conn[1]});
				}
				
			});

			

			//Positions
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

		});
	});
})();