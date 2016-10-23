<?php
	class MongoQueryConstructor {
		private $_query_args_array; //the array to be constructed into a mongo query
		private $_get_data; //data received from client via $_GET
		
		function __construct($get_data = null) {
			$this->_query_args_array = array();
			
			if(!is_null($get_data)) {	
				$this->_get_data = $get_data;
				$this->addLocationsFromGETParams();
				$this->addMinimumJobCountFromGETParams();
			}
		}
		
		function addLocationsFromGETParams() {
			if(!isset($this->_get_data["locations"]) || count($this->_get_data["locations"]) == 0) return; //don't bother working on an empty data set
			$get_locations = $this->_get_data["locations"];
			$this->_query_args_array['$or'] = array();
			
			//states are unique, but city names may not be--make state required but city optional
			for($i = 0; isset($get_locations[$i]); $i++) {
				if(!isset($get_locations[$i]["state"])) continue;
				$new_location = array("location.state"=>strtolower($get_locations[$i]["state"]));
				if(isset($get_locations[$i]["city"])) $new_location["location.city"] = strtolower($get_locations[$i]["city"]);
				array_push($this->_query_args_array['$or'], $new_location);
			}
			
			//despite "locations" param containing data, data may not have been usable--don't bother using useless query
			if(count($this->_query_args_array['$or']) == 0) unset($this->_query_args_array['$or']);
		}
		
		function addMinimumJobCountFromGETParams() {
			$minimum = isset($this->_get_data["minopenings"]) ? $this->_get_data["minopenings"] : 0;
			if(!is_numeric($minimum) || $minimum <= 0) return; //don't bother adding missing or useless query
			$this->_query_args_array["openjobcount"] = array('$gte'=>$minimum);
		}
		
		function addStateAndCities($state = null, $cities = null) {
			if(is_null($state)) return;
			if(!isset($this->_query_args_array['$or'])) $this->_query_args_array['$or'] = array();
			$entry = array("location.state"=>strtolower($state));
			if(!is_null($cities) && count($cities) > 0) {
				$lower_case_cities = array();
				for($i = 0; $i < count($cities); $i++) {
					$lower_case_cities[] = strtolower($cities[$i]);
				}
				$entry["location.city"] = array('$in'=>$lower_case_cities);
			}
			
			$this->_query_args_array['$or'][] = $entry;
		}
		
		function getQuery() {
			return $this->_query_args_array;
		}
	}
?>