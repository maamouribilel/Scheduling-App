$(document).ready(function() {
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'agendaWeek,month,agendaDay,listWeek'
    },
    defaultDate: '2017-12-12',
    navLinks: true, 

    weekNumbers: true,
    weekNumbersWithinDays: true,
    weekNumberCalculation: 'ISO',

    editable: true,
    eventSources: [
        {
            url: './api/events',
            type: 'get',
        }


    ]
  });

});
