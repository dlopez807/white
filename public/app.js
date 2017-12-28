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
	if (event.keyCode == 13) {
		$(this).submit();
		return false;
	}
});

// $('#wp').submit(function(event) {
// 	event.preventDefault();
// 	$.ajax({
// 		url: '/bacon',// '/survey',
// 		method: 'POST',
// 		data: {
// 			white: $('#white').val(),
// 			separator: $('#separator').val(),
// 			limit: $('#limit').val()
// 		},
// 		dataType: 'application/json',
// 		success: function(data) {
// 			//console.log(data);
// 			console.log('hello');
// 		},
// 		error: function(data) {
// 			console.log(data);
// 			console.log('error');
// 		}
// 	});
// })

$(document).ready(function() {
	$('body').css('display', 'block');
	$('#white').focus();
})