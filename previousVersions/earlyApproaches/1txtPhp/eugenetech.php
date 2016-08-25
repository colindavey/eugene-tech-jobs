<?php

// Dynamic version
$joblist = array();
// tab-delimited
// $fp = fopen('jobs.txt','r');
// while (($line = fgetcsv($fp, 0, "\t")) !== FALSE) if ($line) $joblist[] = $line;
// csv
$fp = fopen('jobs.csv','r');
while (($line = fgetcsv($fp, 0, ",")) !== FALSE) if ($line) $joblist[] = $line;

fclose($fp);

// Hard-coded version
// $joblist = array (
// 	array("On Time Systems", "http://www.otsys.com/employment.php", "3"),
// 	array("lunarlogic", "https://www.lunarlogic.com/careers", "1"),
// 	array("Analytic Spot", "http://analyticspot.com/about.html#join-us", "3"),
// 	array("SheerID", "http://www.sheerid.com/jobs-at-sheerid/", "4"),
// 	array("Palo Alto Software", "http://www.paloalto.com/about-us/careers", "5"),
// );

$numCompanies = count($joblist);

$numJobs = 0;
for ($i = 0; $i < $numCompanies; $i++) {
	$numJobs += $joblist[$i][2];
}

function etGetNumCompanies() {
	echo $GLOBALS['numCompanies'];
}

function etGetNumJobs() {
	echo $GLOBALS['numJobs'];
}

function etGetJobsList() {
	for ($i = 0; $i < $GLOBALS['numCompanies']; $i++) {		$item = '';
		$item = '<li>';
		$item .= '<a href="';
		$item .= $GLOBALS['joblist'][$i][1];
		$item .= '" TARGET="link">';
		$item .= $GLOBALS['joblist'][$i][0];
		$item .= '</a>';
		$item .= ' ';
		$item .= $GLOBALS['joblist'][$i][2];
		$item .= '</li>';
		echo $item;
	}
}

?>
