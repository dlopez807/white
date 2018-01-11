if (sessionStorage.separator)
	$('#separator').val(sessionStorage.separator);	
$('#separator').change(function(){ 
	sessionStorage.separator = $(this).val();
});

if (sessionStorage.limit)
	$('#limit').val(sessionStorage.limit);	
$('#limit').change(function(){ 
	sessionStorage.limit = $(this).val();
});

$('#white').keydown(function(event) {
	if (event.which == 13 && !event.shiftKey) {
		$(this).closest("form").submit();
    event.preventDefault();
    return false;
	}
});

$('#wp').submit(function(event) {
	event.preventDefault();
	$.ajax({
		url: '/survey',
		method: 'POST',
		data: $('#wp').serialize(),
		success: function(data) {
			console.log('success');
			$('#data').empty().append(data);
		},
		error: function(data) {
			console.log('error');
		}
	});
})

$(document).ready(function() {
	$('body').css('display', 'block');
	$('#white').focus();
})

$('#territories > tr').each(function() {
	console.log($('territory', this).innerHtml());
})