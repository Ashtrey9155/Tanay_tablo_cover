$('#flightSheduleTab').on('click','.sendBtn', function() { 
    let message = $(".message").val();
    let hours = $("#toHourId").val();
    let minutes = $("#toMinId").val();
    let today = new Date;
    let utc_timestamp = (Date.UTC( today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        hours,
        minutes,
        0, 0) / 1000) - 7*3600;
    $.ajax({
      url: '/admin/message?msg=' + message + '&until=' + utc_timestamp,
      type: 'GET',
      datatype: 'json',
      beforesend: function() {
        $(".infoMessage").html("Данные переданы: " + message );
        console.log("Данные переданы: " + message + "; unix time: " + utc_timestamp);
      },
      success: function(data) {
        if (data.result === "OK") {
          $(".infoMessage").html("Сообщение успешно сохранено на табло");
          console.log("Данные переданы без ошибки");
        }
      },
      error: function() {
        $(".infoMessage").html("Сообщение передано с ошибкой");
        console.log("error данные не переданы");
      },
      finally: function() {
        setTimeout(function(){
          $(".infoMessage").html("");
        }, 3000);
      }
    });
  
});

$('#flightSheduleTab').on('click','.remBtn', function() { 
  let message = '';
  let today = new Date;
  var utc_timestamp = (Date.UTC( today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      today.getUTCHours(),
      today.getUTCMinutes(),
      0, 0) / 1000);
  $.ajax({
    url: '/admin/message?msg=' + message + '&until=' + utc_timestamp,
    type: 'GET',
    datatype: 'json',
    beforesend: function() {
      $(".infoMessage").html("Данные переданы: " + message );
      console.log("Данные переданы: " + message + "; unix time: " + utc_timestamp);
    },
    success: function(data) {
      if (data.result === "OK") {
        $(".infoMessage").html("Сообщение успешно удалено");
        console.log("Данные переданы без ошибки");
      }
    },
    error: function() {
      $(".infoMessage").html("Сообщение передано с ошибкой");
      console.log("error данные не переданы");
    },
    finally: function() {
      setTimeout(function(){
        $(".infoMessage").html("");
      }, 3000)
    }
  });

});