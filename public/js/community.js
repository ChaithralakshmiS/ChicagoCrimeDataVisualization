//$(document).ready(function () {
$(document).on("submit", "form", function (e) {
	var oForm = $(this);
	var formId = oForm.attr("id");
	console.log(formId);
	var firstValue = oForm.find("input").first().val();
	console.log(firstValue);
	area = firstValue;
	//$('.loader-container').addClass('loader');
	//var area = document.getElementById("submit").value;
	console.log(area);
	$.ajax({
		"method": "GET",
		"url": "/community",
    "data": {area: area}
	}).then(function(response){
		var data = response;
		console.log(data);
    console.log(typeof data);
		//$('.loader-container').removeClass('loader');
    var violent_crimes = ["SEX OFFENSE", "CRIM SEXUAL ASSAULT", "BATTERY", "ASSAULT", "KIDNAPPING", "HOMICIDE", "HUMAN TRAFFICKING"];
    var secondary_crimes = ["ROBBERY", "CRIMINAL DAMAGE", "THEFT", "ARSON", "BURGLARY", "MOTOR VEHICLE THEFT", "STALKING", "INTIMIDATION"];
    var crime_index = {};
    var rating = 0 ;
    var rating_string = '';
		var total_pop = 2716000;
		var pop_to_comm = total_pop/77;
    for(var k in data) crime_index[k]=data[k];
    console.log(crime_index);
    console.log(crime_index);
    Object.keys(crime_index).forEach(function (item) {
      crime_index[item] = ((crime_index[item] / pop_to_comm) * 1000);
    });
    console.log(crime_index); // gives the precentages
    // if the addition of violent crime % is > 15 % give rating
    Object.keys(crime_index).forEach(function (item) {
      if(violent_crimes.includes(item))
      {

        rating = (crime_index[item] * 1.25) + rating; // if violent the rate in which to multiple is 1.25
      }
      else if (secondary_crimes.includes(item)){

        rating = (crime_index[item] * 1) + rating; //take off a factor
      }
			else{
				rating = (crime_index[item] * 0.75) + rating;
			}
    });

    console.log("total rating");
    console.log(rating);
    // crime is measured per 100,000 residence so if the rating is 198.00 then per 1000 ppl 198 are bad
    if(rating < 150){
      console.log("Safe neighbor hood: about 85% safe");
      rating_string = "Safe neighbor hood: about 85% safe";
    }
    else if(rating > 150 && rating < 300)
    {
      console.log("Moderate neighborhood: is about 70% safe");
      rating_string = "Moderate neighborhood: is about 70% safe";
    }
		else if(rating > 300 && rating < 450)
		{
			console.log("This neighborhood is neither safe nor unsafe");
			rating_string = "This neighborhood is neither safe nor unsafe";
		}
    else{
      console.log("This neighborhood is not safe");
      rating_string = "This neighborhood is not safe";
    }
    document.write(rating + rating_string);
    //document.write(" ");
    //document.write(rating_string);

	});

});
