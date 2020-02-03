$(document).ready(function (){
  today = new Date();
  yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  var dd = yesterday.getDate();
  var mm = yesterday.getMonth()+1; //January is 0!

  var yyyy = yesterday.getFullYear();
  if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} yesterday = mm+'/'+dd+'/'+yyyy;
  console.log(yesterday);
  $.ajax({
		"method": "GET",
		"url": "/comminuty/total",
		"data": {date: yesterday}
	}).then(function(response){
		var data = response;
    console.log(response);
    console.log("my data")
    // find the largest keys
    var highest = Object.keys(response).reduce(function(a, b){ return response[a] > response[b] ? a : b });
    console.log(highest);

    document.getElementById("community").innerHTML = highest;
		//$("#bar-chartcanvas").data = data;


	});
});
