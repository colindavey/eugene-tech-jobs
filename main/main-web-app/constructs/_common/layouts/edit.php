<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">
    <link rel="stylesheet" type="text/css" media="all" href="/css/db_edit.css" />
    <?php //Ox_WidgetHandler::CSS() ?>
    <?php //Ox_WidgetHandler::JS() ?>
    <?php //Ox_WidgetHandler::HtmlTitle() ?>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.13.1/lodash.min.js"></script>
	<script type="text/javascript" src="/js/db_edit.js"></script>
</head>
<body>
<header class="top-level-container">
    Editing Layout
</header>

<section class="top-level-container">
<div class="center">
	<div id="search">
		<input type="text" class="search" id="nameSearch" placeholder="Company Search"></input>
		<input type="text" class="search" id="stateSearch" placeholder="State Search"></input>
		<input type="text" class="search" id="citySearch" placeholder="City Search"></input>
		<input type="text" class="search" id="openjobSearch" placeholder="Open Position Search"></input>
	</div>
	<div id="clearSearch">
		<button class="search" id="clearButton">Clear</button>
	</div>
	<div class="new-company-inputs">
		<input type="text" id="addName" class="company-add-input required" placeholder="Company*"></input>
		<input type="text" id="addLink" class="company-add-input" placeholder="Careers Page"></input>
		<input type="text" id="addState" class="company-add-input required" placeholder="State*"></input>
		<input type="text" id="addCity" class="company-add-input required" placeholder="City*"></input>
		<input type="text" id="addOpenjobcount" class="company-add-input" placeholder="# of Openings"></input>
	</div>
	<div class="new-company-inputs">
		<button id="addButton" onclick="addCompany()" class="company-add-input disable-target">Add Company</button>
	</div>
	<div>
		<span id="resMsg"></span>
	</div>
    <div id="jobsList" class="container-fluid"></div>
</div>
</section>

<footer class="top-level-container">
    <?php echo date('Y-m-d H:i:s');?>
</footer>
</body>
</html>
