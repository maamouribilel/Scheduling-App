$(document).ready(function() {
  //delete appointment
  $('.delete-appointment').on('click', function(e) {

    $target = $(e.target);
    //console.log($target.attr('data-id'));
    const id = $target.attr('data-id');
//    console.log(id);
    $.ajax({
      type: 'DELETE',
      url: '/appointment/' + id,
      success: function(response) {
        alert('Deleting appointment');
        window.location.href = '/home';
      },
      error: function() {
        console.log(err);
      }

    });

  });
//delete activity
$('.delete-activity').on('click', function(e) {

  $target = $(e.target);
  //console.log($target.attr('data-id'));
  const id = $target.attr('data-id');
//    console.log(id);
  $.ajax({
    type: 'DELETE',
    url: '/activities/' + id,
    success: function(response) {
      alert('Deleting activity');
      window.location.href = '/activities/add';
    },
    error: function() {
      console.log(err);
    }

  });

});

//delete parc
$('.delete-parc').on('click', function(e) {

  $target = $(e.target);
  //console.log($target.attr('data-id'));
  const id = $target.attr('data-id');
//    console.log(id);
  $.ajax({
    type: 'DELETE',
    url: '/parcs/' + id,
    success: function(response) {
      alert('Deleting parc');
      window.location.href = '/parcs/add';
    },
    error: function() {
      console.log(err);
    }

  });

});
//admin cancel appointment
$('.delete-rv').on('click', function(e) {

  $target = $(e.target);
  //console.log($target.attr('data-id'));
  const id = $target.attr('data-id');
   console.log(id);
  $.ajax({
    type: 'DELETE',
    url: '/appointment/' + id,
    success: function(response) {
      alert('Deleting appointment');
      window.location.href = '/home_coach';
    },
    error: function() {
      console.log(err);
    }

  });

});

//confirm appointment
$('.confirm-appointment').on('click', function(e) {

  $target = $(e.target);
  //console.log($target.attr('data-id'));
  const id = $target.attr('data-id');
//    console.log(id);
  $.ajax({
    type: 'PUT',
    url: '/appointment/' + id,
    success: function(response) {
      alert('Confirming appointment');
      window.location.href = '/home_coach';
    },
    error: function() {
      console.log(err);
    }

  });

});

});

//messsage
$(".alert").delay(2500).slideUp(500, function() {
    $(this).alert('close');
});

//today
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }

today = yyyy+'-'+mm+'-'+dd;
document.getElementById("day").setAttribute("min", today);
