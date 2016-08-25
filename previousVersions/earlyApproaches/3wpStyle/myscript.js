jQuery(document).ready(function() {
	var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/10plQlO7bPpGm-IsXR53Lxxcr5a4z4J31JczBX28G6os/pubhtml';
	Tabletop.init({
		key: public_spreadsheet_url, 
		callback: updateDOM, 
		simpleSheet: true 
	});
});

function myCompare(a,b) {
  var nameA = a.employer.toUpperCase(); // ignore upper and lowercase
  var nameB = b.employer.toUpperCase(); // ignore upper and lowercase
//console.log(nameA + " " + nameB);
  if (nameA < nameB) {
//console.log('<');
    return -1;
  }
  if (nameA > nameB) {
//console.log('>');
    return 1;
  }

  // names must be equal
//console.log('=');
  return 0;
}

function updateDOM(data, tabletop) {
//	data = data.slice(0, 30);
//	data.sort(function(a,b){return myCompare(a,b)});
	data.sort(myCompare);
//	console.log(JSON.stringify(data));

	var numCompanies = data.length;
	var numJobs = 0;
	var item;
	for (var i = 0; i < numCompanies; i++) {
		numJobs += Number(data[i].openjobcount);
		item = '<li>';
		if (data[i].link === "") {
			item += data[i].employer;
		} else {
			item += '<a href="'; item += data[i].link; item += '" TARGET="link">';
			item += data[i].employer;
			item += '</a>';
		}
		item += ' ';
		item += data[i].openjobcount;
		item += '</li>';
		jQuery("#jobsList").append(item);
	}
	jQuery("#numCompanies").text(numCompanies);
	jQuery("#numJobs").text(numJobs);
}
