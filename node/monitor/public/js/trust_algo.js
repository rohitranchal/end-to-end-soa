$( document ).ready(function() {
	var default_algo = $('#default_algo_passive').text();
	$('#p' + default_algo).removeClass('btn-primary').addClass('btn-success');
	$('#p' + default_algo).text('Default');
	$('#collapse_p_' + default_algo).addClass('in');

	default_algo = $('#default_algo_active').text();
	$('#a' + default_algo).removeClass('btn-primary').addClass('btn-success');
	$('#a' + default_algo).text('Default');
	$('#collapse_a_' + default_algo).addClass('in');

	$('.btn').click(function() {
		$.post("/set_default_trust_algo", {algo_id : this.id}, function (data) {
				location.reload();
		});
	});

});