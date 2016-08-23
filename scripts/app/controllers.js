/**
 * Created by Ishtiaque on 8/22/2016.
 */
angular.module("ngSachin")
	.controller("SachinCtrl", ["$scope", "dataFactory", function ($scope, dataFactory) {
		$scope.sachinData = [];
		$scope.competitorsData = [];

		$scope.sachinStatHolder = {
			battingScore : 0,
			battingAvg : 0,
			wickets : 0,
			runsConceded : 0,
			bowlingAvg : 0,
			catches : 0,
			stumps : 0,
			matchesWon : 0,
			matchesLost : 0,
			timesOut : 0,
			topScore : 0,
			hundreds : 0,
			fifty : 0
		};

		$scope.compDataHolder = {
			players: [],
			runs: [],
			hundreds: [],
			fifties: []
		}

		//for historical data purposes
		var runHistoryLabels = [];
		var runHistoryData = [];

		//fetching Sachin's data
		dataFactory.getSachinData().success(function (response) {
			$scope.sachinData = response;
			//after data is fetched, calculate the totals
			$scope.sachinData.forEach(calculateTotals);
			//after stats are generated, add his data to the cometitor's data holder
			$scope.compDataHolder.players.push("Sachin Tendulkar");
			$scope.compDataHolder.runs.push($scope.sachinStatHolder.battingScore);
			$scope.compDataHolder.hundreds.push($scope.sachinStatHolder.hundreds);
			$scope.compDataHolder.fifties.push($scope.sachinStatHolder.fifty);
			//after stats are generated, create the charts for visualization
			renderMatchesCharts();
			renderRunHistoryChart(runHistoryLabels, runHistoryData);
		}).error(function (error) {
			console.log("Error in fetching Sachin's data.");
		});

		//fetching competitor's data
		dataFactory.getCompetitorData().success(function(response){
			$scope.competitorsData = response;
			$scope.competitorsData.forEach(addToCompDataHolder);
			renderComparatorCharts();
		}).error(function (error) {
			console.log("Error in fetching competitors data.");
		});

		//This function calculates the totals in sachin's career.
		function calculateTotals(eachMatch){
			//-- This block mainly converts the batting score to a number from its numerous possible types --//
			var batScr = eachMatch["batting_score"];
			if(typeof batScr === "number"){
				//when batted and was out
				$scope.sachinStatHolder.timesOut++;
			}else if(batScr.charAt(batScr.length - 1) == "*"){
				//when batted and was not-out, the values are given as "58*" meaning 58 not out.
				batScr = Number(batScr.slice(0, batScr.length-1));
			}else{
				//when DNB - Did Not Bat
				batScr = 0;
			}
			//-- ----------------------------------------------------------------------------------------- --//
		  //Adding the score to the total
			$scope.sachinStatHolder.battingScore += batScr;
			//calculating top score
			if(batScr > $scope.sachinStatHolder.topScore){
				$scope.sachinStatHolder.topScore = batScr;
			}
			//calculating 100s and 50s
			if(batScr >= 50){
				if(batScr >= 100){
					$scope.sachinStatHolder.hundreds++;
				}else{
					$scope.sachinStatHolder.fifty++;
				}
			}

			$scope.sachinStatHolder.wickets += (typeof eachMatch["wickets"] === "number") ? eachMatch["wickets"] : 0;
			$scope.sachinStatHolder.runsConceded += (typeof eachMatch["runs_conceded"] === "number") ? eachMatch["runs_conceded"] : 0;
			$scope.sachinStatHolder.catches += (typeof eachMatch["catches"] === "number") ? eachMatch["catches"] : 0;
			$scope.sachinStatHolder.stumps += (typeof eachMatch["stumps"] === "number") ? eachMatch["stumps"] : 0;
			if(eachMatch["match_result"].toLowerCase() == "lost"){
				$scope.sachinStatHolder.matchesLost++;
			}else{
				$scope.sachinStatHolder.matchesWon++;
			}
			//calculating overall stats here
			$scope.sachinStatHolder.totalMatches = $scope.sachinStatHolder.matchesWon + $scope.sachinStatHolder.matchesLost;
			$scope.sachinStatHolder.battingAvg = ($scope.sachinStatHolder.battingScore / $scope.sachinStatHolder.timesOut).toFixed(2);
			$scope.sachinStatHolder.bowlingAvg = ($scope.sachinStatHolder.runsConceded / $scope.sachinStatHolder.wickets).toFixed(2);

			//creating the timeline
			runHistoryLabels.push(eachMatch["date"]);
			runHistoryData.push(batScr);
		}//end of calculateTotals()


		function addToCompDataHolder(eachPlayer){
			$scope.compDataHolder.players.push(eachPlayer["name"]);
			$scope.compDataHolder.runs.push(eachPlayer["total_runs"]);
			$scope.compDataHolder.hundreds.push(eachPlayer["hundreds"]);
			$scope.compDataHolder.fifties.push(eachPlayer["fifties"]);
		}

		function renderMatchesCharts(){
			var matchesChartCtx = document.getElementById("matchesChart");//.getContext("2d");
			var data1 = {
				labels: [
					"Matches Won",
					"Matches Lost",
				],
				datasets: [
					{
						data: [$scope.sachinStatHolder.matchesWon, $scope.sachinStatHolder.matchesLost],
						backgroundColor: [
							"#FF6384",
							"#36A2EB"
						],
						hoverBackgroundColor: [
							"#FF6384",
							"#36A2EB"
						]
					}]
			};
			var options1 = {
				cutoutPercentage: 0,
				rotation: -0.5 * Math.PI,
				circumference: 2 * Math.PI
			}
			// For a pie chart
			var matchesPieChart = new Chart(matchesChartCtx,{
				type: 'pie',
				data: data1,
				options: options1
			});
		}

		function renderRunHistoryChart(userLabels, userData){
			var runHistoryChartCtx = document.getElementById("runHistoryChart");
			var data = {
				labels: userLabels,
				datasets: [
					{
						label: "Runs scored",
						fill: false,
						lineTension: 0.1,
						backgroundColor: "rgba(75,192,192,0.4)",
						borderColor: "rgba(75,192,192,1)",
						borderCapStyle: 'butt',
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: 'miter',
						pointBorderColor: "rgba(75,192,192,1)",
						pointBackgroundColor: "#fff",
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: "rgba(75,192,192,1)",
						pointHoverBorderColor: "rgba(220,220,220,1)",
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
						data: userData,
						spanGaps: true
					}
				]
			};
			var options = {
				showLines: true,
				spanGaps: true
			};
			var myLineChart = new Chart(runHistoryChartCtx, {
				type: 'line',
				data: data,
				options: options
			});
		}

		function renderComparatorCharts(){
			var runsCtx = document.getElementById("runsChart");
			var hundredsCtx = document.getElementById("hundredsChart");
			var fiftiesCtx = document.getElementById("fiftiesChart");

			var data1 = {
				labels: $scope.compDataHolder.players,
				datasets: [
					{
						label: "Total Runs in Career",
						backgroundColor: [
							'rgba(255, 99, 132, 0.7)',
							'rgba(54, 162, 235, 0.7)',
							'rgba(255, 206, 86, 0.7)',
							'rgba(75, 192, 192, 0.7)',
							'rgba(153, 102, 255, 0.7)',
							'rgba(255, 159, 64, 0.7)'
						],
						borderColor: [
							'rgba(255,99,132,1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 159, 64, 1)'
						],
						borderWidth: 1,
						data: $scope.compDataHolder.runs,
					}
				]
			};
			var myBarChart = new Chart(runsCtx, {
				type: 'bar',
				data: data1
			});

			var data2 = {
				labels: $scope.compDataHolder.players,
				datasets: [
					{
						label: "No. of 100s",
						backgroundColor: [
							'rgba(255, 99, 132, 0.7)',
							'rgba(54, 162, 235, 0.7)',
							'rgba(255, 206, 86, 0.7)',
							'rgba(75, 192, 192, 0.7)',
							'rgba(153, 102, 255, 0.7)',
							'rgba(255, 159, 64, 0.7)'
						],
						borderColor: [
							'rgba(255,99,132,1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 159, 64, 1)'
						],
						borderWidth: 1,
						data: $scope.compDataHolder.hundreds,
					}
				]
			};
			var myBarChart = new Chart(hundredsCtx, {
				type: 'bar',
				data: data2
			});

			var data3 = {
				labels: $scope.compDataHolder.players,
				datasets: [
					{
						label: "No. of Fifties",
						backgroundColor: [
							'rgba(255, 99, 132, 0.7)',
							'rgba(54, 162, 235, 0.7)',
							'rgba(255, 206, 86, 0.7)',
							'rgba(75, 192, 192, 0.7)',
							'rgba(153, 102, 255, 0.7)',
							'rgba(255, 159, 64, 0.7)'
						],
						borderColor: [
							'rgba(255,99,132,1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 159, 64, 1)'
						],
						borderWidth: 1,
						data: $scope.compDataHolder.fifties,
					}
				]
			};
			var myBarChart = new Chart(fiftiesCtx, {
				type: 'bar',
				data: data3
			});

		}//end of renderComparatorChats
	}]);//end of controller
