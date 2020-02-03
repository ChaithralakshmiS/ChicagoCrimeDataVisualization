$(document).ready(function (){
  date1 = '03\/[0-9]+\/2019'
  date2 = '04\/[0-9]+\/2019'
  $.ajax({
		"method": "GET",
		"url": "/monthly",
		"data": {date: date1}
	}).then(function(response){
		var data1 = response;

    $.ajax({
  		"method": "GET",
  		"url": "/monthly",
  		"data": {date: date2}
  	}).then(function(response2){
  		var data2 = response2;
      var precent = (data2 - data1)/(data1)

      precent = precent * 100
      precent = Math.round(precent)

    // find the largest keys

    var change = '';
    if (data1 > data2){
      change = "-"
    }
    else if (data2 > data1){
      change = "+"
    }
    else{
      change=''
    }
    console.log("change")
    console.log(change)
    $('#progressbar').attr('aria-valuenow', precent).css('width', precent);
    document.getElementById("crime_precentage").innerHTML = change + precent +"%" ;
		//$("#bar-chartcanvas").data = data;


	});
});

});
