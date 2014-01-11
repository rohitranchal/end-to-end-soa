var editor = ace.edit('params-editor');
editor.setTheme('ace/theme/chrome');
editor.getSession().setMode('ace/mode/json');
editor.setShowPrintMargin(false);
editor.setFontSize('16px');

$('#param-edit').on('hidden.bs.modal', function (e) {
	var val = editor.getSession().getValue();
	var sid = $('#service_id').text();
	$.post("/update_service_params", {id: sid, params : val}, function (data) {
		location.reload();
	});
});