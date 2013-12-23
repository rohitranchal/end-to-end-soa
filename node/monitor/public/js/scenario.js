//Based on http://jsplumbtoolkit.com/demo/statemachine/demo-jquery.js
;(function() {
	jsPlumb.ready(function() {
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
			info.connection.getOverlay("label").setLabel(info.connection.id);
		});
		
		instance.doWhileSuspended(function() {
			instance.makeSource(windows, {
				filter:".ep",				// only supported by jquery
				anchor:"Continuous",
				connector:[ "Straight"],
				connectorStyle:{ strokeStyle:"#5c96bc", lineWidth:2, outlineColor:"transparent", outlineWidth:4 },
				maxConnections:5,
				onMaxConnections:function(info, e) {
					alert("Maximum connections (" + info.maxConnections + ") reached");
				}
			});						

			// initialise all '.w' elements as connection targets.
			instance.makeTarget(windows, {
				dropOptions:{ hoverClass:"dragHover" },
				anchor:"Continuous"				
			});
			
			instance.connect({ source:"item1", target:"item2" });

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
					left += 100;
					top += 100;
				} else {
					left += 200;
				}
				count++;

				if(left > 800) {
					left = 0;
				}
				
				
			});

		});
	});
})();