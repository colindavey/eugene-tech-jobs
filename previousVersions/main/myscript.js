jQuery(document).ready(function() {
	var spreadsheetJson = 'https://spreadsheets.google.com/feeds/list/10plQlO7bPpGm-IsXR53Lxxcr5a4z4J31JczBX28G6os/od6/public/values?alt=json';
    data = [];
    jQuery.getJSON(spreadsheetJson, function(response){
        // standardize data type for each company (1 company per row in the google docs spreadsheet)
        data = _(response.feed.entry).map(function(cell){
            return {
                "name": cell.gsx$employer.$t + '',
                "link": cell.gsx$link.$t + '',
                "openings": cell.gsx$openjobcount.$t * 1
            };
            return company;
        });
        initDataDOM(data);
        jQuery('#chkHiring').on('click',toggleHiring);
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
    
	// To allow experimenting with grouping by rows, although it doesn't allow three columns
    var tryRows_b = false;
    if (!tryRows_b) {
		companiesHtml = companies.reduce(function(carry, jobsGroup){
			return carry + makeItem(jobsGroup, tryRows_b);
		}, '');
		companiesHiringHtml = companiesHiring.reduce(function(carry, jobsGroup){
			return carry + makeItem(jobsGroup, tryRows_b);
		}, '');
	} else {
		companiesHtml = companies.chunk(4).reduce(function(carry, jobsGroup){
			return carry + makeRow(jobsGroup);
		}, '');
		companiesHiringHtml = companiesHiring.chunk(4).reduce(function(carry, jobsGroup){
			return carry + makeRow(jobsGroup);
		}, '');
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

function makeRow(companyGroup){
    return '<div class="row">'+_(companyGroup).reduce(function(result, company){
        return result + makeItem(company, true);
    },'')+'</div>';
}

function makeItem(company, tryRows_b) {
	if (!tryRows_b) {
		item = '<article class="company-item col-sm-6 col-md-4 col-lg-3"><div>';
	} else {
		item = '<article class="company-item col-sm-6 col-md-3"><div>';
	}

	item += '<div class="col-xs-1">';
	item += '<span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span>';
	item += '</div>';

	item += '<div class="col-xs-9">';
// 	item += '<div class="col-xs-8">';
// 	item += '<div class="col-xs-10">';
	item += (company.link ? '<a href="' + company.link + '" target="link">' + company.name + '</span></a>' : company.name);
	item += '</div>';

 	item += '<div class="col-xs-1">';
//  	item += '<div class="col-xs-2">';
// 	item += '<div class="col-xs-4">';
	item += '<span class="company-job-openings">' + (company.openings ? '<span class="label label-primary">' + company.openings+'</span>' : '<span class="no-openings">&#8211;</span>') + '</span>';
// 	item += '<span>' + (company.openings ? '<span class="label label-primary">' + company.openings+'</span>' : '<span>&#8211;</span>') + '</span>';
	item += '</div>';

	item += '</div></article>';
	return item;
}
