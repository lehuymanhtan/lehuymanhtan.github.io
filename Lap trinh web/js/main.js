var login_bt = document.getElementById('login-bt');
var close_login_button = document.getElementById('close-login-button');
login_bt.addEventListener('click',show_login_windows);
close_login_button.addEventListener('click',hide_login_button);

function show_login_windows()
{
	a = document.getElementById('login');
	a.style.width = '100%';
	a.style.height = '100%';
}
function hide_login_button()
{
	a = document.getElementById('login');
	a.style.width = '0%';
	a.style.height = '0%';
}