$( document ).ready(function() {
	var default_algo = $('#default_algo_passive').text();
	$('#p' + default_algo).removeClass('btn-primary').addClass('btn-success');
	$('#p' + default_algo).text('Default');
	$('#collapse_p_panel' + default_algo).addClass('panel-success');

	default_algo = $('#default_algo_active').text();
	$('#a' + default_algo).removeClass('btn-primary').addClass('btn-success');
	$('#a' + default_algo).text('Default');
	$('#collapse_a_panel' + default_algo).addClass('panel-success');

	$('.btn').click(function() {
		$.post("/set_default_trust_algo", {algo_id : this.id}, function (data) {
				location.reload();
		});
	});

});