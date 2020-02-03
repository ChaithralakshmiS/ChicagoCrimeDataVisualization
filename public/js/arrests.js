$(document).ready(function (){
  date = '05\/[0-9]+\/2019'
  $.ajax({
		"method": "GET",
		"url": "/arrests",
		"data": {date: date}
	}).then(function(response){
		var data = response;
    console.log(response);
    console.log("my data")
    // find the largest keys


    document.getElementById("arrests").innerHTML = data;
		//$("#bar-chartcanvas").data = data;

	});
});
