/**
 * Created by Ishtiaque on 8/22/2016.
 */
angular.module("ngSachin")
	.factory("dataFactory", ["$http", function ($http) {

		/**This function can be used to fetch a particular player's data from cricapi.com
		* Required paramerter: pid - unique player id
		* */
		function getPlayerData(pid) {
			return $http.get("http://cricapi.com/api/playerStats?pid=" + pid);
		}

		/**This function can be used to fetch a Sachin Tendulkar's data from the source
		 * In this case, source is a json file on our server.
		 * */
		function getSachinData() {
			return $http.get('data/sachin.json');
		}
		/**This function can be used to fetch a competitor's data from the source
		 * In this case, source is a json file on our server.
		 * */
		function getCompetitorData() {
			return $http.get('data/competitors.json');
		}
 		return {
			getPlayerData: getPlayerData,
			getSachinData: getSachinData,
		  getCompetitorData: getCompetitorData
		}
	}]);