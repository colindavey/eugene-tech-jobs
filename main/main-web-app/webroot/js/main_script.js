jQuery(document).ready(function() {
	jQuery.ajax({
		url: '/jobs/oregon/',
		type: 'GET',
		success: function (response) {
			data = _(response).map(function(cell){
				return {
					"name": cell.name + '',
					"link": (cell.link && cell.link.indexOf("http") < 0 ? "http://" + cell.link : cell.link) + '',
					"openings": cell.openjobcount * 1,
					"city": cell.city
				};
			});
			initDataDOM(data);
	
			jQuery('#chkHiring').on('click',toggleHiring);
		}
	});
	
	jQuery('#cityFilters').change(function() {
		var city_filter = jQuery('#cityFilters').val();
		var all_companies = jQuery('.company-item');
		if(city_filter != "blank") {
			all_companies.hide();
			var filtered_companies = jQuery('.city_' + city_filter);
			filtered_companies.show();
		}
		else {
			all_companies.show();
		}
		var numCompanies = jQuery(".company-item:visible").length;
		var numCompaniesHiring = 0;
		jQuery(".company-job-openings .label-primary:visible").each(function() {
			numCompaniesHiring += parseInt(jQuery(this).text());
		});
		jQuery("#numCompanies").text(numCompanies);
		jQuery("#numJobs").text(numCompaniesHiring);
	});
});

var companiesHtml;
var companiesHiringHtml;

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

    var numCompanies = companies.size();
    var numCompaniesHiring = companiesHiring.size();
    companiesHtml = "";
	companiesHiringHtml = "";
    var outerColumnStyle = "col-sm-12 col-md-6";
	
	var cutoff1 = Math.ceil(numCompanies/4);
	var cutoff2 = Math.ceil(numCompanies/2) + (numCompanies % 4 == 2 ? 1 : 0);
	var cutoff3 = Math.ceil(numCompanies/4 * 3);
	companiesHtml += makeOuterColumn(0, cutoff1, cutoff2, companies, outerColumnStyle);
	companiesHtml += makeOuterColumn(cutoff2, cutoff3, numCompanies, companies, outerColumnStyle);
	
	cutoff1 = Math.ceil(numCompaniesHiring/4);
	cutoff2 = Math.ceil(numCompaniesHiring/2) + (numCompaniesHiring % 4 == 2 ? 1 : 0);
	cutoff3 = Math.ceil(numCompaniesHiring/4 * 3);
	companiesHiringHtml += makeOuterColumn(0, cutoff1, cutoff2, companiesHiring, outerColumnStyle);
	companiesHiringHtml += makeOuterColumn(cutoff2, cutoff3, numCompaniesHiring, companiesHiring, outerColumnStyle);
	
	jQuery("#numJobs").text(companies.sumBy('openings'));
	setCityDropdownFilters(data);
	updateDOM();
}

function getUniqueCities(data) {
	var unique = [];
	for(var i = 0; i < data.size(); i++) {
		if(unique.indexOf(data.get(i).city) < 0) unique.push(data.get(i).city);
	}
	unique.sort(function(a, b) {
		return a.localeCompare(b);
	});
	
	return unique;
}

function setCityDropdownFilters(data) {
	var cities = getUniqueCities(data);
	var dropdownHtml = "<option value=\"blank\"> -- </option>";
	for(var i = 0; i < cities.length; i++) {
		dropdownHtml += "<option value=\"" + cities[i].replace(" ", "_") + "\">" + cities[i] + "</option>";
	}
	jQuery("#cityFilters").append(dropdownHtml);
}

function updateDOM() {
	if (jQuery("#chkHiring").prop("checked")) {
		jQuery("#jobsList").append(companiesHiringHtml);
	} else {
		jQuery("#jobsList").append(companiesHtml);
	}
	jQuery('#cityFilters').change();
}

function makeOuterColumn(begin, middle, end, companies, bootstrap_style_str) {
	var innerColumnStyle = "col-sm-12 col-lg-6";
	var columnHtml = '<div class="outer ' + bootstrap_style_str + '">';
	columnHtml += makeInnerColumn(begin, middle, companies, innerColumnStyle);
	columnHtml += makeInnerColumn(middle, end, companies, innerColumnStyle);
	columnHtml += '</div>';
	return columnHtml;
}

function makeInnerColumn(start, end, companies, bootstrap_style_str) {
	var columnHtml = '<div class="inner ' + bootstrap_style_str + '">';
    for(var i = start; i < end; i++) {
		columnHtml += makeItem(companies.get(i));
	}
	columnHtml += '</div>';
	return columnHtml;
}

function makeItem(company) {
	var item =
		'<article class="company-item row city_' + company.city.replace(" ", "_") + '"><div>' +
			'<div class="col-xs-9">' +
				(
				company.link
				? '<a href="' + company.link + '" target="_blank" onclick="trackOutboundLink(\'' + company.link + '\');return false;">' + company.name + '</span></a>'
				: company.name
				) +
			'</div>' +
			'<div class="col-xs-3">' +
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
