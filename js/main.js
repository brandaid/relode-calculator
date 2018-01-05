// Carousel

$('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    items: 1,
    autoplay: true,
    navText: false,
    dots: true
})

// Sticky Bar

$(document).ready(function(){
	var altura = $('.sticky-bar').offset().top;

	$(window).on('scroll', function(){
		if ( $(window).scrollTop() > altura ){
			$('.sticky-bar').addClass('sticky-bar-fixed');
		} else {
			$('.sticky-bar').removeClass('sticky-bar-fixed');
		}
	});

  $('#smooth-scroll').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top - 100
	    }, 900, 'swing', function () {
	        window.location.hash = target;
	    });
	});
});
// Calculator

        var rates;
        var groupedByCity;
        document.onload = loadJSON(function(response) {
                             // Parse JSON string into object
                               rates = JSON.parse(response);
                              var groupBy = function(xs, key) {
                                                return xs.reduce(function(rv, x) {
                                                (rv[x[key]] = rv[x[key]] || []).push(x);
                                                return rv;
                                                 }, {});
                                                 };
                                groupedByCity=groupBy(rates, 'CityStateCodePostalCode');


                               renderCities(groupedByCity);
                               calculate(rates);


                            });

        function loadJSON(callback) {
            var xobj = new XMLHttpRequest();
                xobj.overrideMimeType("application/json");
            xobj.onreadystatechange = function () {
                  if (xobj.readyState == 4 && xobj.status == "200") {
                    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                    callback(xobj.responseText);
                  }
            };
            xobj.open('GET', '../assets/JobsForCalculator.json', true); // Replace 'rates' with the path to your file

            xobj.send(null);
        }

        function calculate(values){
            var AllPositionsCurrency = document.getElementById("job").selectedOptions[0].getAttribute('data-success');
            var selectedCity = document.getElementById("location").selectedOptions[0].textContent;
            if ( AllPositionsCurrency != null){
            var AllPositionsNumber = Number(AllPositionsCurrency.replace(/[^0-9\.-]+/g,""));
            var AgentCommissionPercentage = parseInt(document.getElementById("job").selectedOptions[0].getAttribute('data-comission'));
            var OpenPositions = document.getElementById("job").selectedOptions[0].getAttribute('data-positions');
            var cuantity = document.getElementById("listnumber").value;
            var budget = document.getElementById("budget");
            var budgetSticky = document.getElementById("sticky-number");
            var citySticky = document.getElementById("could-earn-location");
            var reward = (AgentCommissionPercentage / 100) * (AllPositionsNumber / OpenPositions);
            var finalReward = reward *cuantity;
            var roundReward = Math.round(finalReward * 100) / 100;
            const numberWithCommas = (x) => {
                var parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return parts.join(".");

            }
            budget.innerHTML = (numberWithCommas(roundReward))? "$" + (numberWithCommas(roundReward)) : "$0" ;
            budgetSticky.innerHTML = (numberWithCommas(roundReward))? "$" + (numberWithCommas(roundReward)) : "$0" ;
            citySticky.innerHTML = (roundReward > 0)? "What you could earn in " + selectedCity : "Find out what could you earn";
            }

        }

        function renderCities(rawObj){
            var allCities = Object.keys(rawObj).sort();
            allCities = allCities.filter(item => item !== "All locations, ALL.");
            allCities.unshift("All locations ALL 00000");
            var citySelect = document.getElementById('location');
            var therender = "<option value="+">my location</option>";
            citiesFilter = [];
              for(var i =0; i < allCities.length; i++){
              	var nozip = allCities[i].substring(0, allCities[i].length-6);
              	citiesFilter.push(nozip);
              };
               var uniqueCities = [];
				$.each(citiesFilter, function(i, el){
				    if($.inArray(el, uniqueCities) === -1) uniqueCities.push(el);
				});
            uniqueCities.forEach(function(item){
                 var test = item.localeCompare("All locations ALL");
                 if (test == 0){
                  therender += '<option value="'+item.replace(/,\s?|\./g, " ")+'">All locations</option>';
                 } else {
                   var str = item;
				   var len = str.length;
				   var x = str.substring(0, len-3) + "," + str.substring(len-3) + ".";
                  therender += '<option value="'+item+'">'+x+'</option>';
                 }


            });
            citySelect.innerHTML = therender;
        }

        function renderJobs(thecity, rawObj){

        	cities = Object.keys(rawObj).filter(function (propertyName) {
			    return propertyName.indexOf(thecity) === 0;
			});

			var jobArray = [];

        	cities.forEach(function(item){
	        	for(var i =0; i < rawObj[item].length; i++){
	        		jobArray.push(rawObj[item][i]);
				}
			})

          var JobSelect = document.getElementById('job');
          var therender = "<option value=''>i'm connected to...</option>";
          jobArray.forEach(function(item){

          	if (item['Sum of QuantityMinusHiredJobCandidateCount'] > 0){
               therender += '<option value="'+item.JobName+'" data-comission="'+ item['Sum of AgentCommissionPercentage'] +'" data-success="'+ item['Sum of ContractedSuccessForAllPositions'] +'" data-positions="'+ item['Sum of QuantityMinusHiredJobCandidateCount'] +'">'+item.JobName+'</option>';
          	}
          });

          JobSelect.innerHTML = therender;
        }
