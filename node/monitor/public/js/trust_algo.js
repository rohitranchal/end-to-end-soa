$( document ).ready(function() {
	var default_algo = $('#default_algo').text();
	$('#' + default_algo).removeClass('btn-primary').addClass('btn-success');

	$('#' + default_algo).text('Default');


	$('.btn').click(function() {
		$.post("/set_default_trust_algo", {algo_id : this.id}, function (data) {
				location.reload();
		});
	});

});