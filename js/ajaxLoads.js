  let aircraftsObj = {
  "GreyL410УВПЭ3Siberia": {
    "name": "Grey L-410",
    "overPlaces": 18
  },
  "BlueL410УВПЭ3Ivanov": {
    "name": "Blue L-410",
    "overPlaces": 18
  },
  "TVS2МСRA07497": {
    "name": "TVS 07497",
    "overPlaces": 12
  }
  ,
  "AN-2": {
    "name": "AN-2",
    "overPlaces": 10
  }
};

function changeTab() {
  $(".loadsTab").toggle();
  $(".loadsPeo").toggle();
}

function ajaxLoads()
{
  var xhr = $.ajax({
    	url: 'ajax/getLoads.json?'+Math.random().toString().substr(2, 8),
      // async: false,
      type: 'GET',
      dataType: 'json',
      beforeSend : function() {  
        let html = getTableCellItem("loading");
        // $("#flightSheduleTab").html(html);
        // $("#loading").html(html);
        // $("#loading").fadeIn("slow");
        // let node = $("<div></div>");
        $("#dateInfo font").html(getDate("date"));
        $("#time span").html(getDate("time"));
        $("#timeTopHead span").html(getDate("time"));
      },
    	success: function(data) {
        // $('.errorinfo').addClass("none");
    		// var tab = $("#flightSheduleTab");
    		// $("#loading").fadeOut("slow");
    		if (data["loads"].length == 0)
    		{
          let html = getTableCellItem("noLoads");
          $("#flightSheduleTab").html(html);
          $("#flightSheduleTab td").fadeIn("slow");
    		}
    		else
    		{
    			var html = "";
    			var sortedObj = sortObj(data["loads"]);
          var i;
          var countLoads = data["loads"].length;
          // var countLoads = sortedObj.length;

          var textCountLoads;
          switch (true) {
            case countLoads ===1:
              textCountLoads = countLoads + " flight";
              break;
            default:
              textCountLoads = countLoads + " flights";
          }

    			$("#dateInfo div").html("<span class=\"topHead\">" + getDate("date") + " " + "</span><span>" + textCountLoads + "</span>");
    	    buildPeople(data["loads"]);
          html = html + "</tbody></table>";
          $("#flightSheduleTab").html(html);
    		}       	
    	},
    	error: function() {
        // $('.errorinfo').removeClass("none");
        // $('.errorinfo').toggleClass('error');
        var html = getTableCellItem("error");
        $("#flightSheduleTab").html(html);
      }

  });
  // setTimeout(function() {xhr.abort();}, 2000);
  
}


function buildPeople(loads) {
    // $("#flightSheduleTab").html("");
    let countLoads = (loads.length < 4) ? loads.length : 3;
    for(i = 0; i < countLoads; i++)
          {
            var ld = loads[i];
            var objaircraft = aircraftsObj[normolize(ld["plane"])];
            // console.log("OBJ: " + objaircraft);
            if (ld["freePlaces"] < 0) ld["freePlaces"] = 0;
            let list = $(`<div class="flex-grow-1"></div>`)
            let head = $(`<div style="padding: 0 1em;" class="d-flex flex-direction-row justify-content-space-between"></div>`);
            let takeoffNumber = $(`<div>Takeoff №` + ld["number"] + `</div>`);
            let timeView = $(`<div> ` + ld["timeLeft"] + ` min</div></div>`);
            let node = $(`<div class="d-flex width100 justify-content-center flex-grow-1 flex-direction-column"></div>`);

            head.appendTo(node);
            takeoffNumber.appendTo(head);
            timeView.appendTo(head);
            node.appendTo($("#flightSheduleTab"));
            ajaxPeople(ld["number"], list);
            // html += getTableCellItem("info", objaircraft["name"], ld["number"], ld["timeLeft"], objaircraft["overPlaces"], ld["freePlaces"]);
    }
}



/********************GET LIST PEOPLES IN BOARD**********************/

function ajaxPeople(boardNumber, list) {
  // let today = new Date();
  let formatDate = getDate();
  var xhr = $.ajax({
      url: 'ajax/getPeople_2021-08-09_'+boardNumber+'.json?'+Math.random().toString().substr(2, 8),
      type: 'GET',
      // async: false,
      dataType: 'json',
      cache: false,
      beforeSend : function() {  
        // let html = getTableCellItem("loading");
        // $("#flightSheduleTab").html('');
        // $("#loading").html(html);
        // $("#loading").fadeIn("slow");
      },
    	success: function(data) {
        // $("#flightSheduleTab").html("");
        // $('.errorinfo').addClass("none");
        // $("#loading").fadeOut("slow");
        let countPeoples = data["people"].length;
        if (countPeoples === 0) {
          let html = "";
          html += getTableCellItem("noPeoples");
          list.html(html);
          xhr = null;  
          changeTab();
          ajaxLoads();
          let timerId = setTimeout(function() {changeTab(); ajaxLoads(); }, peopleLoadTime);
          console.log("No people in board, timer 15 sec: " + timerId);
    		}
    		else
    		{
          console.log("success: ");
          let htmlLeft = "";
        //   // let htmlRight = "";
          let countPeoples = data["people"].length;

            for(let i = 0; i < countPeoples; i++)
            {
              var pp = data["people"][i];
                htmlLeft += getTableCellItem("peoples",'','','','','', i + 1, pp["name"], pp["task"]);
            }	
            htmlLeft += "</tbody></table>";
            list.appendTo($("#flightSheduleTab"));
            list.append(htmlLeft);
        }       	 
    	},
    	error: function(jqXHR, exception) {
        // $('.errorinfo').toggleClass('error');
        // $('.errorinfo').removeClass("none");
        // html = getTableCellItem("error");
        // xhr = null;  
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        // $('#post').html(msg);
        console.log("error: " + msg);
        // changeTab();
        // ajaxLoads();
      }
  });
  // setTimeout(function() {xhr.abort();}, 2000); 
}

function getWeather()
{
  $.ajax({
    	url: 'http://192.168.1.4/weather.php',
      type: 'POST',
      dataType: 'json',
    	success: function(data) {
        console.log(`weather: ${data.temp}`);
      }
  });
}

function getTableCellItem(topic, ...other) {
  var html;

  var [plane, number, timeLeft, overPlaces, freePlaces, n, pName] = other;

  switch (topic)
  {
    case "info":
      html = `
      <div class="boardItem shadow d-flex justify-content-space-between padding-0_2em padding-0_1em" data-boardnumber="${number}">
        <div class="d-flex flex-direction-column flex0_1_auto11">
          <div class="bold">
            № ${number}
          </div>
          <div class="color-grey">
            ${plane}
          </div>
        </div>
        <div class="d-flex">
          <div class="imgSkydive">
            <img src="images/skydiving-man-icon.png">
          </div>
          <div class="d-flex flex-direction-column flex-end flex0_1_em11 width3_2em">
            <div class="color-grey">
              ${timeLeft} min
            </div>
            <div class="d-flex flex-align-items-center color-grey">
              ${overPlaces - freePlaces} / ${overPlaces}
            </div>
          </div>
        </div>
      </div>`;
      break;
    case "peoples":
      html = `
      <div class="boardItem shadow d-flex padding-0_2em">
        <div class="d-flex width100">
          <div class="flex0_1_em bold"><font>${n}</font></div>
          <div class="flex0_1_auto"><font>${pName}</font></div>
        </div>
      </div>
      `;
      break;
    case "error":
      html = ` 
      <div class="d-flex justify-content-center flex1_1_auto flex-align-items-center flex-direction-column error-align-center ">
        <div><font class="font-size-5em">503</font></div>
        <div>Service Unavailable</div>
      </div>
      `;
      break;
    case "noLoads":
        html = `
        <div class="d-flex justify-content-center flex1_1_auto flex-align-items-center flex-direction-column error-align-center ">
          <div><font class="font-size-3em">No flights</font></div>
        </div>
        `;
        break;
    case "loading":
      html = `
      <div>
          <div class="dot-pulse"></div>
      </div>
      `;
      break;
    default:
      html = `
      <div class="d-flex justify-content-center flex1_1_auto flex-align-items-center flex-direction-column error-align-center ">
        <div><font class="font-size-3em">Flights is empty</font></div>
      </div>
      `;
      break;
  }
  
return html;
}

function getDate(dt) {
  var answer;
  var today = new Date();
  var dd = today.getDate();
  var dd0 = (dd < 10) ? "0" + dd : dd;
  var mm = today.getMonth() + 1;
  var mm0 = ((mm) < 10) ? "0" + mm : mm;
  var YYYY = today.getFullYear();
  var hh = today.getHours();
  var min = today.getMinutes();
  var MM = (min < 10) ? "0" + min : min;

  var  monthNames = ["", "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
        "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
      ];
  var  monthNamesAng = ["", "Jan", "Feb", "Mar", "Apr", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
  var formatDate = dd + " " + monthNamesAng[mm] + " " + YYYY;
  var formatTime = hh + ":" +  MM;
  var dateToday = YYYY + "-" + mm0 + "-" + dd0;
  switch(dt) {
    case "date":
      answer = formatDate;
      break;
    case "time":
      answer = formatTime;
      break;
    default:
      answer = dateToday;
  }
  return answer;
}

function sortObj(arr) {
  return arr.sort((a, b) => (a.number > b.number) ? 1 : -1);
}

function normolize(name) {
  name = name.replace(/\s/g, '');
  return name;
}
/*/////////////////CLICK ON THE TABLO////////////////// */
$('#flightSheduleTab').on('click','.boardItem', function() {
    var id = $(this).get(0);
    var boardNumber = id.dataset.boardnumber;
    displayPeople(boardNumber)
});

function displayPeople(boardNumber) {
  ajaxPeople(boardNumber);
  changeTab();
}


// $('.loadsPeo').on('click','', function() {
//   changeTab();
// });

// $('#peopleSheduleTab').on('click','', function() {
//   changeTab();
// });