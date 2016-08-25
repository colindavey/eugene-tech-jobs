<?php require_once(DIR_APP . 'lib' . DIRECTORY_SEPARATOR . 'MongoQueryConstructor.php'); ?>
<?php
	class jobs extends Ox_AssemblerConstruct {
		
		function __construct() {
			$this->layout = 'ajax';
			$this->roles = array(
				'index'=>array('anonymous'),
				'edit'=>array('anonymous'),
				'getVerboseJobList'=>array('anonymous'),
				'addCompany'=>array('anonymous'),
				'updateCompany'=>array('anonymous'),
				'removeCompany'=>array('anonymous'),
				'populateDatabase'=>array('anonymous')
			);
		}
		
		public function index() {
			header('Content-Type: application/json');
			if($_SERVER['REQUEST_METHOD'] != "GET") return; //only allow GET method calls
			
			//set up DB, construct query, and retrieve data
			$db = Ox_LibraryLoader::DB();
			$query_constructor = new MongoQueryConstructor($_GET);
			$query = $query_constructor->getQuery();
			$company_docs = $db->Companies->find($query);
			
			//prepare data to send to client
			$company_objects = array();
			foreach($company_docs as $doc) {
				//collapse doc and strip fields not intended for client to see
				$reduced_doc = array(
					"name"=>$doc["name"],
					"link"=>$doc["link"],
					"state"=>$doc["location"]["state"],
					"city"=>$doc["location"]["city"],
					"openjobcount"=>$doc["openjobcount"]
				);
				array_push($company_objects, $reduced_doc);
			}
			echo json_encode($company_objects, JSON_FORCE_OBJECT); 
		}
		
		public function edit() {
			$this->layout = 'edit';
		}
		
		public function getVerboseJobList() {
			header('Content-Type: application/json');
			if($_SERVER['REQUEST_METHOD'] != "GET") return; //only allow GET method calls
			
			//set up DB, construct query, and retrieve data
			$db = Ox_LibraryLoader::DB();
			$query_constructor = new MongoQueryConstructor($_GET);
			$query = $query_constructor->getQuery();
			$company_docs = $db->Companies->find($query);
			
			//prepare data to send to client
			$company_objects = array();
			foreach($company_docs as $doc) {
				array_push($company_objects, $doc);
			}
			
			echo json_encode($company_objects, JSON_FORCE_OBJECT);
		}
		
		public function addCompany() {
			header('Content-Type: application/json');
			//only allow POST method calls
			if($_SERVER['REQUEST_METHOD'] != "POST") {
				echo json_encode(array("res"=>"NO"));
				return;
			}
			
			//require certain fields for success, otherwise terminate early
			$required_fields = array("name", "state", "city");
			foreach($required_fields as $field_name) {
				if(!isset($_POST[$field_name]) || empty($_POST[$field_name])) {
					echo json_encode(array("res"=>"NO"));
					return;
				}
			}
			
			$db = Ox_LibraryLoader::DB();
			
			if(!isset($_POST["openjobcount"])) $openjobcount = 0; //set a default value
			else $openjobcount = !is_numeric($_POST["openjobcount"]) ? 0 : max($_POST["openjobcount"], 0); //type-check and set a value floor
			
			$doc = array(
				"name"=>$_POST["name"],
				"link"=>$_POST["link"],
				"openjobcount"=>$_POST["openjobcount"],
				"location"=>array(
					"state"=>strtolower($_POST["state"]),
					"city"=>strtolower($_POST["city"])
				)
			);
			$db->Companies->insert($doc);
			
			//ensure that the insertion succeeded and make the document's id available to allow editing
			$company_docs = $db->Companies->find($doc);
			if($company_docs->hasNext()) {
				$doc = $company_docs->getNext();
				echo json_encode(array("res"=>"OK", "_id"=>$doc["_id"]));
			}
			else {
				echo json_encode(array("res"=>"NO"));
			}
		}
		
		public function updateCompany() {
			header('Content-Type: application/json');
			//only allow POST method calls
			if($_SERVER['REQUEST_METHOD'] != "POST") {
				echo json_encode(array("res"=>"NO"));
				return;
			}
			
			//require certain fields for success, otherwise terminate early
			$required_fields = array("_id", "name", "state", "city");
			foreach($required_fields as $field_name) {
				if(!isset($_POST[$field_name]) || empty($_POST[$field_name])) {
					echo json_encode(array("res"=>"NO"));
					return;
				}
			}
			
			//find and update doc or indicate failure
			$db = Ox_LibraryLoader::DB();
			$company_docs = $db->Companies->find(array("_id"=>(new MongoID($_POST["_id"]))));
			if($company_docs->hasNext()) {
				$doc = $company_docs->getNext();
				$doc["name"] = $_POST["name"];
				$doc["link"] = $_POST["link"];
				$doc["openjobcount"] = $_POST["openjobcount"];
				$doc["location"] = array(
					"state"=>strtolower($_POST["state"]),
					"city"=>strtolower($_POST["city"])
				);
				
				$db->Companies->update(array("_id"=>$doc["_id"]), $doc);
				echo json_encode(array("res"=>"OK"));
			}
			else {
				echo json_encode(array("res"=>"NO"));
			}
		}
		
		public function removeCompany() {
			header('Content-Type: application/json');
			//only allow POST method calls
			if($_SERVER['REQUEST_METHOD'] != "POST") {
				echo json_encode(array("res"=>"NO"));
				return;
			}
			
			//require existing document id
			if(!isset($_POST["_id"]) || empty($_POST["_id"])) {
				echo json_encode(array("res"=>"NO"));
				return;
			}
			
			//find and delete doc or indicate failure
			$db = Ox_LibraryLoader::DB();
			$company_docs = $db->Companies->find(array("_id"=>(new MongoID($_POST["_id"]))));
			
			if($company_docs->hasNext()) {
				$db->Companies->remove(array("_id"=>(new MongoID($_POST["_id"]))));
				echo json_encode(array("res"=>"OK"));
			}
			else {
				echo json_encode(array("res"=>"NO"));
			}
		}
		
		/* TEMPORARY - Used for testing, will delete/comment out/disable when no longer needed */
		public function populateDatabase() {
			header('Content-Type: application/json');
			$db = Ox_LibraryLoader::DB();
			$json_data = file_get_contents("https://spreadsheets.google.com/feeds/list/10plQlO7bPpGm-IsXR53Lxxcr5a4z4J31JczBX28G6os/od6/public/values?alt=json");
			$data_arr = json_decode($json_data, true);
			$data_arr = $data_arr["feed"]["entry"];
			
			foreach($data_arr as $index=>$job) {
				$db->Companies->insert(array(
					"name"=>$job["gsx\$employer"]["\$t"],
					"link"=>$job["gsx\$link"]["\$t"],
					"openjobcount"=>$job["gsx\$openjobcount"]["\$t"],
					"location"=>array(
						"state"=>"oregon",
						"city"=>"eugene"
					)
				));
			}
			echo json_encode(array("res"=>"OK"));
		}
	}
?>