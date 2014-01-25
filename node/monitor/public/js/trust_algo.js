$( document ).ready(function() {
	var default_algo = $('#default_algo_passive').text();
	var passive_algos = default_algo.split(",");
	for(var i = 0; i < passive_algos.length; i++) {

		$('#p' + passive_algos[i]).removeClass('btn-primary').addClass('btn-danger');
		$('#p' + passive_algos[i]).text('Disable');
		$('#collapse_p_panel' + passive_algos[i]).addClass('panel-success');	
	}

	default_algo = $('#default_algo_active').text();
	var active_algos = default_algo.split(",");
	for(var i = 0; i < active_algos.length; i++) {
		$('#a' + active_algos[i]).removeClass('btn-primary').addClass('btn-danger');
		$('#a' + active_algos[i]).text('Disable');
		$('#collapse_a_panel' + active_algos[i]).addClass('panel-success');	
	}

	$('.btn').click(function() {
		$.post("/toggle_trust_algo", {algo_id : this.id}, function (data) {
				location.reload();
		});
	});

});