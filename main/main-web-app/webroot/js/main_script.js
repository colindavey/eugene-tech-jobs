jQuery(document).ready(function() {
	jQuery.ajax({
		url: '/jobs/',
		type: 'GET',
		data: {
			locations: {0: {state: "oregon", city: "eugene"}}
		},
		success: function (response) {
			data = _(response).map(function(cell){
				return {
					"name": cell.name + '',
					"link": cell.link + '',
					"openings": cell.openjobcount * 1
				};
			});
			initDataDOM(data);
	
			jQuery('#chkHiring').on('click',toggleHiring);
		}
	});
});

var companiesHtml;
var companiesHiringHtml;
var numCompanies;
var numCompaniesHiring;

function toggleHiring() {
	jQuery("#jobsList").empty();
	updateDOM();
}

function initDataDOM(data) {
    // alpha sort by name
    var companies = _(data).sortBy(function(company){
        return company.name.toUpperCase();
    });
    // filter for hiring companies
	var companiesHiring = _(companies).filter(function(entry){
        return (entry.openings);
    });

    numCompanies = companies.size();
    numCompaniesHiring = companiesHiring.size();
    companiesHtml = "";
	companiesHiringHtml = "";
    
	var jobHtml;
    for(var i = 0; i < numCompanies; i++) {
		jobHtml = makeItem(companies.get(i));
		companiesHtml += jobHtml;
		if(companies.get(i).openings) companiesHiringHtml += jobHtml;
	}
	
    jQuery("#numJobs").text(companies.sumBy('openings'));
	updateDOM();
}

function updateDOM() {
	if (jQuery("#chkHiring").prop("checked")) {
		jQuery("#numCompanies").text(numCompaniesHiring);
		jQuery("#jobsList").append(companiesHiringHtml);
	} else {
		jQuery("#numCompanies").text(numCompanies);
		jQuery("#jobsList").append(companiesHtml);
	}
}

function makeItem(company) {
	item =
		'<article class="company-item col-sm-6 col-md-4 col-lg-3"><div>' +
			'<div class="col-xs-1">' +
				'<span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span>' +
			'</div>' +
			'<div class="col-xs-9">' +
				(
				company.link
				? '<a href="' + company.link + '" target="link">' + company.name + '</span></a>'
				: company.name
				) +
			'</div>' +
			'<div class="col-xs-1">' +
				'<span class="company-job-openings">' +
					(
					company.openings
					? '<span class="label label-primary">' + company.openings+'</span>'
					: '<span class="no-openings">&#8211;</span>'
					) +
				'</span>' +
			'</div>' +
		'</div></article>';
	return item;
}