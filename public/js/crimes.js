$(document).ready(function () {
	first_date = '05\/[0-9]+\/2019';
	$('.loader-container').addClass('loader');
	$.ajax({
		"method": "GET",
		"url": "/crime",
		"data": {date: first_date}
	}).then(function(response){
		var data = applyData(response, first_date, true);
		//$("#bar-chartcanvas").data = data;
		$('.loader-container').removeClass('loader');

	});
	var chart;
	function applyData(dict, first_date, update){
		var data = {

			labels : Object.keys(dict),
			datasets : [
				{
					label : "Crime Reported",
					data : Object.values(dict),
					backgroundColor : [

					//"rgba(10, 20, 30, 0.3)"

					 ],
					borderColor : [
						//"rgba(10, 20, 30, 1)",
					],
					borderWidth : 0.5

				} //,
				// {
        //   label : "Case where Arrests Made",
				// 	data : [dict2],
				// 	backgroundColor : [
        //
				// 	 ],
				// 	borderColor : [
				// 		//"rgba(10, 20, 30, 1)",
				// 	],
				// 	borderWidth : 0.5
				// }
			]
		};
		var options = {
			title : {
				display : false,
				position : "top",
				text : "Crime Stats Totals for the Month",
				fontSize : 18,
				fontColor : "#111"
			},
			legend : {
				display : false,
				position : "bottom"
			},
			scales : {
				xAxes: [{
					gridLines: {
						display:false
					},
					ticks: {
						autoSkip: false,

					},
					scaleLabel: {
						display: false,
						labelString: 'Crime Type'
					}
				}],
				yAxes : [{
					ticks : {
						min : 0

					},
					scaleLabel: {
						display: true,
						labelString: 'Total Occurance'
					},
					gridLines: {
						display:false
					}
				}]
			}
		};
		var ctx = $("#bar-chartcanvas");
		if(update){
      Object.keys(dict).forEach(function(key) {
        var obj = {};
        if (dict[key] < 50)
        {
          // console.log("in the if loop")
          // console.log("the dictionary key value");
          // console.log(dict[key]);
          delete dict[key];
          delete key;
          // console.log(dict[key]);
        }
      });

			var props = Object.keys(dict).map(function(key) {
				return { key: key, value: this[key] };
			}, dict);
			props.sort(function(p1, p2) { return p2.value - p1.value; });
			var topThree = props.slice(0, 10);
			var topThreeObj = props.slice(0, 10).reduce(function(obj, prop) {
				obj[prop.key] = prop.value;
				return obj;
			}, {});

      // console.log("my diction from crimes.js");
      // console.log(dict);
			chart.data.datasets[0].data = Object.values(topThreeObj);
			//chart.data.datasets[1].data = dict2;
			var backgroundColor = [];
			for (var x = 0; x < Object.keys(topThreeObj).length; x++)
			{
				backgroundColor.push("rgba(65, 131, 215, 1)");
			}

			chart.data.datasets[0].backgroundColor = backgroundColor;
			chart.options.title.text = options.title.text;
      // console.log(dict.length)

			for(var x = 0; x < Object.keys(topThreeObj).length; x++)
			{
				chart.data.labels[x] = Object.keys(topThreeObj)[x];
			};
			chart.update();

		}
		else{
			chart = new Chart(ctx, {
				type : "bar",
				data : data,
				options : options
			});
		}
};


	function initialChart(){
		var ctx = $("#bar-chartcanvas");
		var dict =  {"ASSAULT": 0,
		"BATTERY": 0,
		"NARCOTICS": 0,
		"CRIMINAL DAMAGE": 0,
		"OTHER OFFENSE": 0,
		// "ROBBERY": 0,
		// "BURGLARY": 0,
		// "THEFT": 0,
		// "CRIMINAL TRESPASS": 0,
		// "MOTOR VEHICLE THEFT": 0,
		// "INTERFERENCE WITH PUBLIC OFFICER": 0,
		// "PUBLIC PEACE VIOLATION": 0,
		// "DECEPTIVE PRACTICE": 0,
		// "LIQUOR LAW VIOLATION": 0,
		// "OFFENSE INVOLVING CHILDREN": 0,
		// "WEAPONS VIOLATION": 0,
		// "SEX OFFENSE": 0,
		// "CRIM SEXUAL ASSAULT": 0,
		// "ARSON": 0,
		"HOMICIDE": 0};
		var data = applyData(dict);

	};

	initialChart(); // default case; all 0s
});
