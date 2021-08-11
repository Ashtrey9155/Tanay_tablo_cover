'use strict';

class TabloMondialOnline {
  constructor() {
    this.aircraftsObj = {
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
    }
    this.countErrors = 0;
    this.intervalID = null;
    this.abortID = null;
    this.abortPeopleID = [];
    this.peopleNodes = [];
    this.peopleNodesCount = 0;
    this.init();
  }

  init() {
    $('#flightSheduleTab').on('click','.boardItem', function(that) { 
      return function() {
        var id = $(this).get(0);
        var boardNumber = id.dataset.boardnumber;
        that.displayPeople(boardNumber)
      }
    }(this));
    this.ajaxLoads();
    this.intervalID = setInterval(function(that) {
      return function() {
        that.ajaxLoads(); 
      }
    }(this), 15000);
  }

  /*changeTab() {
    $(".loadsTab").toggle();
    $(".loadsPeo").toggle();
  }*/

  ajaxLoads()
  {
    // console.log("countErrors: " + countErrors);
    var xhr = $.ajax({
      url: 'ajax/getLoads.json?'+Math.random().toString().substr(2, 8),
      // async: false,
      type: 'GET',
      dataType: 'json',
      beforeSend : function(that) {
        return function() {
          that.onBeforeAjaxLoads();
        }
      }(this),
      success: function(that) {
        return function(data) {
          that.onSuccessAjaxLoads(data);
        }
      }(this),
      error: function(that) {
        return function() {
          that.onErrorAjaxLoads()
        }
      }(this)
    });
    this.abortID = setTimeout(function() {xhr.abort();}, 2000);
  }

  onBeforeAjaxLoads() {
      let html = this.getTableCellItem("loading");
      $("#flightSheduleTab").html(html);
      $("#loading").html(html);
      $("#loading").fadeIn("slow");
      $("#dateInfo font").html(this.getDate("date"));
      $("#time span").html(this.getDate("time"));
      $("#timeTopHead span").html(this.getDate("time"));    
  }

  onSuccessAjaxLoads(data) {
    clearTimeout(this.abortID);
    $('.errorinfo').addClass("none");
    // var tab = $("#flightSheduleTab");
    $("#loading").fadeOut("slow");
    if (data["loads"].length == 0)
    {
            let html = this.getTableCellItem("noLoads");
            $("#flightSheduleTab").html(html);
            $("#flightSheduleTab td").fadeIn("slow");
    }
    else
    {
      var html = "";
      var sortedObj = this.sortObj(data["loads"]);
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

      $("#dateInfo div").html("<span class=\"topHead\">" + this.getDate("date") + " " + "</span><span>" + textCountLoads + "</span>");
        this.buildPeople(sortedObj);
    }       	
  }

  onErrorAjaxLoads() {
    console.log("COUNT#:" + this.countErrors);
    if (this.countErrors === 5) {
      $('.errorinfo').removeClass("none");
      // $('.errorinfo').toggleClass('error');
      var html = this.getTableCellItem("error");
      $("#flightSheduleTab").html(html);
    } else {
      this.countErrors++;
      setTimeout(function(that) { 
        return function() {
          that.ajaxLoads();
        }
      }(this), 1000);
    }
  }


  buildPeople(loads) {
    $("#flightSheduleTab").html("");
    let countLoads = (loads.length < 4) ? loads.length : 4;
    this.peopleNodes = [];
    this.peopleNodesCount = countLoads;

    for(let i = 0; i < countLoads; i++)
      {
        var ld = loads[i];
        var objaircraft = this.aircraftsObj[this.normalize(ld["plane"])];
        // console.log("OBJ: " + objaircraft);
        if (ld["freePlaces"] < 0) ld["freePlaces"] = 0;
        let list = $(`<div class="flex-grow-1"></div>`)
        let head = $(`<div style="padding: 0 1em;" class="peopleHead d-flex flex-direction-row justify-content-space-between"></div>`);
        let takeoffNumber = $(`<div>Takeoff №` + ld["number"] + `</div>`);
        let timeView = $(`<div> ` + ld["timeLeft"] + ` min</div></div>`);
        let node = $(`<div class="d-flex width100 justify-content-center flex-grow-1 flex-direction-column"></div>`);

        head.appendTo(node);
        takeoffNumber.appendTo(head);
        timeView.appendTo(head);
        list.appendTo(node);
        this.peopleNodes.push(node);
        this.ajaxPeople(ld["number"], list);
      }
  }

  ajaxPeople(boardNumber, list) {
    // let today = new Date();
    let formatDate = this.getDate();
    var xhr = $.ajax({
        url: 'ajax/getPeople_'+formatDate+'_'+boardNumber+'.json?'+Math.random().toString().substr(2, 8),
        type: 'GET',
        // async: false,
        dataType: 'json',
        cache: false,
        beforeSend : function(that) {
          return function() {
            that.onBeforeAjaxPeople();
          }
        } (this),
        success: function(that, l, bn) {
          return function(data) {
            that.onSuccessAjaxPeople(data, l, bn);
          }
        }(this, list, boardNumber),
        error: function(that, l, bn) {
          return function(jqXHR, exception) {
            that.onErrorAjaxPeople(jqXHR, exception, l, bn);
          }
        }(this, list, boardNumber)
    });
    this.abortPeopleID[boardNumber] = setTimeout(function() {xhr.abort();}, 2000); 
  }

  onBeforeAjaxPeople() {
      let html = this.getTableCellItem("loading");
      // $("#flightSheduleTab").html('');
      $("#loading").html(html);
      $("#loading").fadeIn("slow");
  }

  onSuccessAjaxPeople(data, list, boardNumber) {
    clearTimeout(this.abortPeopleID[boardNumber]);
    // $("#flightSheduleTab").html("");
    $('.errorinfo').addClass("none");
    // $("#loading").fadeOut("slow");
    let countPeoples = data["people"].length;
    if (countPeoples === 0) {
      let html = "";
      html += this.getTableCellItem("noPeoples");
      list.html(html);
    }
    else
    {
      let htmlLeft = "";
    //   // let htmlRight = "";
      let countPeople = data["people"].length;

      for(let i = 0; i < countPeople; i++) {
          var pp = data["people"][i];
          htmlLeft += this.getTableCellItem("peoples", '', '', '', '', '', i + 1, pp["name"], pp["task"]);
      }
      list.append(htmlLeft);
    }       	
    
    this.onPeopleLoadFinish();
  }

  onPeopleLoadFinish() {
    this.peopleNodesCount--;
    if (this.peopleNodesCount == 0) {
      let peopleContainers = "";
      this.peopleNodes.map((node) => { peopleContainers += node.prop('outerHTML');});
      $("#flightSheduleTab").html(peopleContainers);
    }
    $("#loading").fadeOut("slow");
  }

  onErrorAjaxPeople(jqXHR, exception, list, boardNumber) {
    clearTimeout(this.abortPeopleID[boardNumber]);
    // $('.errorinfo').toggleClass('error');
    $('.errorinfo').removeClass("none");
    // let html = this.getTableCellItem("error");
    // jqXHR = null;  
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
    list.append("<div class=\"no-data\">no data</div>");
    this.onPeopleLoadFinish();
  }

  getTableCellItem(topic, ...other) {
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

  getDate(dt) {
    let answer;
    let today = new Date();
    let dd = today.getDate();
    let dd0 = (dd < 10) ? "0" + dd : dd;
    let mm = today.getMonth() + 1;
    let mm0 = ((mm) < 10) ? "0" + mm : mm;
    let YYYY = today.getFullYear();
    let hh = today.getHours();
    let min = today.getMinutes();
    let MM = (min < 10) ? "0" + min : min;
  
    let  monthNames = ["", "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
          "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
        ];
        let  monthNamesAng = ["", "Jan", "Feb", "Mar", "Apr", "May", "June",
          "July", "Aug", "Sept", "Oct", "Nov", "Dec"
      ];
    let formatDate = dd + " " + monthNamesAng[mm] + " " + YYYY;
    let formatTime = hh + ":" +  MM;
    let dateToday = YYYY + "-" + mm0 + "-" + dd0;
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

  sortObj(arr) {
    return arr.sort((a, b) => (a.number > b.number) ? 1 : -1);
  }

  displayPeople(boardNumber) {
    this.ajaxPeople(boardNumber);
    //this.changeTab();
  }

  normalize(name) {
    name = name.replace(/\s/g, '');
    return name;
  }

  static run () {
    return new TabloMondialOnline();
  }
};