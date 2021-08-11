$('#flightSheduleTab').on('click','.sendBtn', function() { 
    let message = $(".message").val();
    let today = new Date;
    var utc_timestamp = Date.UTC(today.getUTCFullYear(),today.getUTCMonth(), today.getUTCDate(), today.getUTCHours() + 7, today.getUTCMinutes(), 0, 0);
    $.ajax({
      url: '/admin/message?msg='+message+'&until='+utc_timestamp,
      type: 'GET',
      datatype: 'json',
      beforesend: function() {
        console.log("Данные переданы: " + message + "; unix time: " + utc_timestamp);
      },
      success: function(data) {
        if (data.status === 200) {
          console.log("Данные переданы без ошибки");
        }
      },
      error: function() {
        console.log("error данные не переданы");
      } 
    });
  
});