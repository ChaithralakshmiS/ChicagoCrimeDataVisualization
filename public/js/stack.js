$(document).ready(function () {
  date = '04\/[0-9]+\/2019';
  $('.loader-container').addClass('loader');
  $.ajax({
    "method": "GET",
    "url": "/stack",
    "data": {date: date}
  }).then(function(response){
    var data =  response;
    console.log("heyyyyy")
    console.log(data)
    console.log(data['topThreeObj'])

    // do another call to get the arrest and domestic info
    // var keys = [];
    // keys =  Object.key(data);
    // console.log(data)

    $.ajax({
  		"method": "GET",
  		"url": "/arrest/domestic",
  		"data": {date: date, dict: data['topThreeObj']}
  	}).then(function(response2){
      console.log("whoooo")
      var data1 = response2['total']
  		var data2 = response2['arrest'];
      var data3 = response2['domestic']
      console.log(data2)
      console.log(data3)
      console.log('hello')
      console.log(data1)
      var data = applyData(data1, data2, data3, first_date, true);



    // console.log(response)
    // console.log("Arrest")
    // console.log(response['arrest'])
    // console.log(domestic)
    // console.log(response['domestics'])

    //$("#bar-chartcanvas").data = data;
    // $('.loader-container').removeClass('loader');

  });
  //var data = applyData(data['topThreeObj'], data2, data3, first_date, true);
});

  var chart;
  function applyData(dict, arr1, arr2, first_date, update){
    Chart.defaults.groupableBar = Chart.helpers.clone(Chart.defaults.bar);

    var helpers = Chart.helpers;
    Chart.controllers.groupableBar = Chart.controllers.bar.extend({
      calculateBarX: function (index, datasetIndex) {
        // position the bars based on the stack index
        var stackIndex = this.getMeta().stackIndex;
        return Chart.controllers.bar.prototype.calculateBarX.apply(this, [index, stackIndex]);
      },

      hideOtherStacks: function (datasetIndex) {
        var meta = this.getMeta();
        var stackIndex = meta.stackIndex;

        this.hiddens = [];
        for (var i = 0; i < datasetIndex; i++) {
          var dsMeta = this.chart.getDatasetMeta(i);
          if (dsMeta.stackIndex !== stackIndex) {
            this.hiddens.push(dsMeta.hidden);
            dsMeta.hidden = true;
          }
        }
      },

      unhideOtherStacks: function (datasetIndex) {
        var meta = this.getMeta();
        var stackIndex = meta.stackIndex;

        for (var i = 0; i < datasetIndex; i++) {
          var dsMeta = this.chart.getDatasetMeta(i);
          if (dsMeta.stackIndex !== stackIndex) {
            dsMeta.hidden = this.hiddens.unshift();
          }
        }
      },

      calculateBarY: function (index, datasetIndex) {
        this.hideOtherStacks(datasetIndex);
        var barY = Chart.controllers.bar.prototype.calculateBarY.apply(this, [index, datasetIndex]);
        this.unhideOtherStacks(datasetIndex);
        return barY;
      },

      calculateBarBase: function (datasetIndex, index) {
        this.hideOtherStacks(datasetIndex);
        var barBase = Chart.controllers.bar.prototype.calculateBarBase.apply(this, [datasetIndex, index]);
        this.unhideOtherStacks(datasetIndex);
        return barBase;
      },

      getBarCount: function () {
        var stacks = [];

        // put the stack index in the dataset meta
        Chart.helpers.each(this.chart.data.datasets, function (dataset, datasetIndex) {
          var meta = this.chart.getDatasetMeta(datasetIndex);
          if (meta.bar && this.chart.isDatasetVisible(datasetIndex)) {
            var stackIndex = stacks.indexOf(dataset.stack);
            if (stackIndex === -1) {
              stackIndex = stacks.length;
              stacks.push(dataset.stack);
            }
            meta.stackIndex = stackIndex;
          }
        }, this);

        this.getMeta().stacks = stacks;
        return stacks.length;
      },
    });

    var data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "rgba(99,255,132,0.2)",
          data: [59, 80, 81, 56, 55, 40, 65],
          stack: 1
        },
        {
          label: "My Second dataset",
          backgroundColor: "rgba(99,132,255,0.2)",
          data: [80, 81, 56, 55, 40, 65, 60],
          stack: 2
        },
        {
          label: "My Third dataset",
          backgroundColor: "rgba(255,99,132,0.2)",
          data: [60, 59, 80, 81, 56, 55, 40],
          stack: 2
        }
      ]
    };

    var ctx = document.getElementById("myChart").getContext("2d");
    if(update){
      //need to change the values of things
      for(var x = 0; x < Object.key(dict).length; x++)
      {
        Chart.data.labels[x] = Object.keys(dict)[x]; // get the labels
      };
      Chart.data.datasets[0].data = Object.values(dict);
      console.log(Chart.data.datasets[0].data)
      console.log('-------')
      Chart.data.datasets[1].data = arr2; //arrest
      console.log(Chart.data.datasets[1].data)
      console.log('-------')
      Chart.data.datasets[2].data = arr3; //domestic
      console.log(Chart.data.datasets[2].data)
      console.log('-------')

      Chart.update();

    }

    else{
      new Chart(ctx, {
        type: 'groupableBar',
        data: data,
        options: {
          scales: {
            yAxes: [{
              ticks: {
                max: 160,
              },
              stacked: true,
            }]
          }
        }
      });
    }
  };


  function initialChart(){
		var ctx = $("#myChart");
		data1 = [0, 0, 0, 0, 0];
    data2 = [0, 0, 0, 0, 0];
    data3 = [0, 0, 0, 0, 0];
		var data = applyData(data1, data2, data3);

	};

	initialChart();
});
