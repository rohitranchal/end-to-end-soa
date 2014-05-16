var db = require('../../db');
var module_name = 'Client Feedback';
var client_feedback_weight = 0.8;
var init_trust = 5;
var intr_window = 5;
var conf_belief, int_belief;
var dest_svc_trust;
var mean_weight;
var mean_fading = 0.5;
var fb_summary;

var client_feedback_trust = function(interaction_id) {

	db.get_trust_configuration(module_name, function(config) {
		if (typeof config != 'undefined') {
			fb_summary = JSON.parse(config.data);
		} else {
			fb_summary = new Array();
		}

		//Get from and to service IDs from the interaction table
		db.get_interaction_data(interaction_id, function(interaction_data) {

			if(interaction_data.start == null) {
				return;
			}

			db.get_servicce_interactions(interaction_data.from_service, interaction_data.to_service, intr_window, function(interactions) {

				var svc_feedback, svc_sat, svc_wt, fading;
				var summation_cb = 0, coefficient = 0, sum_wts = 0, summation_ib;

				intr_window = interactions.length;

				for(var i = 0; i < intr_window; i++) {
					svc_feedback = JSON.parse(interactions[i].feedback);
					svc_sat = svc_feedback.satisfaction;
					svc_wt = svc_feedback.weight;
					fading =  intr_window - i / intr_window;
					summation_cb += svc_sat * svc_wt * fading;
					coefficient += svc_wt * fading;
					sum_wts += svc_wt;
				}

				conf_belief = summation_cb / coefficient;

				mean_weight = sum_wts / intr_window;

				for(var i = 0; i < intr_window; i++) {
					svc_feedback = JSON.parse(interactions[i].feedback);
					svc_sat = svc_feedback.satisfaction;
					summation_ib += (svc_sat * mean_weight * mean_fading - conf_belief)^2
				}

				int_belief = (summation_ib / intr_window)^0.5;
				for (var i = 0; i < fb_summary.length; i++) {

					if (fb_summary[i].id == interaction_data.to_service) {

						// have interaction records about this dest
						for (var j = 0; j < fb_summary[i].callers.length; j++) {

							if (fb_summary[i].callers[j].id == interaction_data.from_service) {

								// have interaction records for this caller
								// increment num calls, cal new cb, ib
								fb_summary[i].callers[j].cb = (fb_summary[i].callers[j].cb * fb_summary[i].callers[j].num_calls + conf_belief) / (fb_summary[i].callers[j].num_calls + 1);
								fb_summary[i].callers[j].ib = (fb_summary[i].callers[j].ib * fb_summary[i].callers[j].num_calls + int_belief) / (fb_summary[i].callers[j].num_calls + 1);
								fb_summary[i].callers[j].num_calls += 1;

								conf_belief = fb_summary[i].callers[j].cb;
								int_belief = fb_summary[i].callers[j].ib;
								break;
							}
						}
						if (j == fb_summary[i].callers.length) {
							// don't have interaction records for this caller
							var tmp_caller = {'id' : interaction_data.from_service, 'num_calls' : 1};
							tmp_caller.cb = conf_belief;
							tmp_caller.ib = int_belief;
							fb_summary[i].callers[j] = tmp_caller;
						}
						break;
					}
				}
				if (i == fb_summary.length) {
					// don't have interaction records about this dest
					var tmp_caller = {'id' : interaction_data.from_service, 'num_calls' : 1};
					tmp_caller.cb = conf_belief;
					tmp_caller.ib = int_belief;
					var tmp_fb = {'id' : interaction_data.to_service};
					tmp_fb.callers = new Array();
					tmp_fb.callers[0] = tmp_caller;
					fb_summary[i] = tmp_fb;
				}

				dest_svc_trust = conf_belief - int_belief / 2;

				db.get_service_trust_level_for_module(interaction_data.from_service, module_name, function(from_trust){

					db.get_service_trust_level_for_module(interaction_data.to_service, module_name, function(to_trust){

						if(from_trust == -1) {
							from_trust = init_trust;//bootstrap trust with a default value
						} else {
							from_trust = from_trust.trust_level;
						}

						if(to_trust == -1) {
							to_trust = init_trust;//bootstrap trust with a default value
						} else {
							to_trust = to_trust.trust_level;
						}

						//Update interaction trust levels
						db.set_interaction_trust_level_for_module(interaction_id, module_name, from_trust, from_trust, to_trust, dest_svc_trust);

						//Update trust level of service
						db.set_service_trust_level_for_module(interaction_data.to_service, module_name, dest_svc_trust);

						db.set_trust_configuration(module_name, JSON.stringify(fb_summary));

					});
				});

			});

		});

	});
};

module.exports = {name : module_name, alg : client_feedback_trust};
