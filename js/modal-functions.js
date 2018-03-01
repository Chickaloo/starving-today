
// edit user info modal
$('#user-editor').on('hidden.bs.modal', function () {
  window.alert('hidden event fired!');
})


//edit recipe modal
$('#recipe-editor').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus');
});
