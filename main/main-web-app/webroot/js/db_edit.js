jQuery(document).ready(function() {
	//API call,  retrieve jobs data and initialize UI
	jQuery.ajax({
		url: '/jobs/getVerboseJobList',
		type: 'GET',
		success: function (response) {
			data = _(response).map(function(cell){
				return {
					"_id": cell._id.$id + '',
					"name": cell.name + '',
					"link": cell.link + '',
					"state": cell.location.state + '',
					"city": cell.location.city + '',
					"openjobcount": cell.openjobcount * 1
				};
			});
			initDataDOM(data);
		}
	});
	
	var search = jQuery('#search');
	var name_search = jQuery('#nameSearch');
	var state_search = jQuery('#stateSearch');
	var city_search = jQuery('#citySearch');
	var open_job_search = jQuery('#openjobSearch');
	
	//set real-time search filter functionality
	jQuery(search).keyup(function() {
		//get filter values
		var name_filter = jQuery.trim(jQuery(this).find(name_search).val()).toLowerCase();
		var state_filter = jQuery.trim(jQuery(this).find(state_search).val()).toLowerCase();
		var city_filter =jQuery.trim(jQuery(this).find(city_search).val()).toLowerCase();
		var open_job_filter = jQuery.trim(jQuery(this).find(open_job_search).val()).toLowerCase();
		
		//get companies and apply filter
		var companies = jQuery('.company-item');
		companies.show().filter(function() {
			//get values of company fields
			var name_text = jQuery(this).find('.name').val().toLowerCase();
			var state_text = jQuery(this).find('.state').val().toLowerCase();
			var city_text = jQuery(this).find('.city').val().toLowerCase();
			var open_job_text = parseInt(jQuery(this).find('.openjobcount').val());
			
			//compare company field values to filter values
			return name_text.indexOf(name_filter) < 0
				|| state_text.indexOf(state_filter) < 0
				|| city_text.indexOf(city_filter) < 0
				|| open_job_text < open_job_filter;
		}).hide();
	});
	
	jQuery('#clearButton').click(function() {
		jQuery(name_search).val("");
		jQuery(state_search).val("");
		jQuery(city_search).val("");
		jQuery(open_job_search).val("");
		jQuery(search).keyup();
	});
});

var companiesHtml;
var numCompanies;

function initDataDOM(data) {
	//sort companies alphabetically
    var companies = _(data).sortBy(function(company){
        return company.name.toUpperCase();
    });

    numCompanies = companies.size();
    companiesHtml = "";
	var outerColumnStyle = "col-sm-12 col-md-6";
	var cutoff1 = Math.ceil(numCompanies/4);
	var cutoff2 = Math.ceil(numCompanies/2);
	var cutoff3 = Math.ceil(numCompanies/4 * 3);
	
	companiesHtml += makeOuterColumn(0, cutoff1, cutoff2, companies, outerColumnStyle);
	companiesHtml += makeOuterColumn(cutoff2, cutoff3, numCompanies, companies, outerColumnStyle);
	
	jQuery("#jobsList").empty();
	jQuery("#jobsList").append(companiesHtml);
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
		columnHtml += makeItem(companies.get(i), companies.get(i)._id);
	}
	columnHtml += '</div>';
	return columnHtml;
}

function makeItem(company, id) {
	item =
		'<article class="company-item">' +
			'<div class="company-label" data-toggle="collapse" data-target="#company' + id + '">' +
				'<span class="company-title" id="companyTitle' + id + '">' + company.name + '</span>' +
			'</div>' +
			'<div id="company' + id + '" class="collapse">' +
				'<div class="company-input">' +
					'<input type="text" placeholder="Company*" value="' + company.name + '" class="name required"></input>' +
				'</div>' +
				'<div class="company-input">' +
					'<input type="text" placeholder="Careers Page" value="' + company.link + '" class="link"></input>' +
				'</div>' +
				'<div class="company-input">' +
					'<input type="text" placeholder="State*" value="' + company.state + '" class="state required"></input>' +
				'</div>' +
				'<div class="company-input">' +
					'<input type="text" placeholder="City*" value="' + company.city + '" class="city required"></input>' +
				'</div>' +
				'<div class="company-input">' +
					'<input type="text" placeholder="# of Openings" value="' + company.openjobcount + '" class="openjobcount"></input>' +
				'</div>' +
				'<div class="company-input">' +
					'<button class="update-button disable-target" onclick="updateCompany(\'' + id + '\')">Update</button>' +
					'<button class="delete-button disable-target" onclick="deleteCompany(\'' + id + '\')">Delete</button>' +
				'</div>' +
				'<div class="company-input">' +
					'<span class="res-msg"></span>' +
				'</div>' +
			'</div>' +
		'</article>';
	return item;
}

function insertItem(company_name, company_html) {
	company_name = company_name.toLowerCase();
	var companies = jQuery(".inner").children();
	var num_companies = companies.length;
	
	//base case, just insert at the beginning of the first column
	if(num_companies == 0) {
		jQuery(jQuery(".outer").children()[0]).prepend(company_html);
		return;
	}
	
	//find first company which comes alphabetically after input company if such a company exists
	var insertion_index = 0;
	for(insertion_index; insertion_index < num_companies; insertion_index++) {
		var cur_company_name = jQuery(companies[insertion_index]).find(".name").val().toLowerCase();
		if(company_name < cur_company_name) break;
	}
	
	//insert company
	if(insertion_index == num_companies)
		jQuery(companies[insertion_index - 1]).after(company_html);
	else
		jQuery(companies[insertion_index]).before(company_html);
}

function balanceColumns() {
	var outer_columns = jQuery("#jobsList").children();
	
	//set the four inner columns for easy access
	var columns = [];
	for(var i = 0; i < 4; i++) {
		columns.push(jQuery(outer_columns[Math.floor(i/2)]).children()[i%2]);
	}
	
	//get number of companies in each column
	var lengths = [];
	for(var i = 0; i < 4; i++) {
		lengths.push(jQuery(columns[i]).children().length);
	}
	
	//calculate expected number of companies in each column based on large screen
	var expected_lengths = [];
	for(var i = 0; i < 4; i++) {
		var len = Math.ceil(numCompanies/4 * (i+1)) - Math.ceil(numCompanies/4 * i);
		expected_lengths.push(len);
	}
	
	//check each of the four columns
	for(var i = 0; i < 4; i++) {
		if(lengths[i] > expected_lengths[i]) {
			//if over expected length, push the bottom-most element to the top of the right-adjacent column
			var company = jQuery(columns[i]).children()[lengths[i]-1];
			var target = jQuery(columns[(i+1)%4]).children()[0];
			jQuery(company).insertBefore(target);
			
			//be sure to update lengths of columns after moving items around!
			lengths[i]--;
			lengths[(i+1)%4]++;
		}
		else if(lengths[i] < expected_lengths[i]) {
			//if under expected length, pull the top-most element from the right-adjacent column and place at the bottom
			var company = jQuery(columns[(i+1)%4]).children()[0];
			var target = jQuery(columns[i]).children()[lengths[i]-1];
			jQuery(company).insertAfter(target);
			
			//be sure to update lengths of columns after moving items around!
			lengths[i]++;
			lengths[(i+1)%4]--;
		}
	}
}

function addCompany() {
	var required_fields = jQuery(".new-company-inputs .required");
	setButtonsDisabled(true);
	setMessageText("");
	
	//base case checking, don't proceed if missing a required field
	if(checkMissingRequiredFields(required_fields)) {
		setMessageText((new Date()).toLocaleTimeString() + ': failed to add company');
		setButtonsDisabled(false);
		return;
	}
	
	//set commonly accessed elements here, reduces errors from making changes in multiple places
	var name_field = jQuery("#addName");
	var link_field = jQuery("#addLink");
	var state_field = jQuery("#addState");
	var city_field = jQuery("#addCity");
	var open_job_field = jQuery("#addOpenjobcount");
	
	//retrieve input values
	var out_name = jQuery(name_field).val();
	var out_link = jQuery(link_field).val();
	var out_state = jQuery(state_field).val();
	var out_city = jQuery(city_field).val();
	var out_openjobcount = jQuery(open_job_field).val();
	out_openjobcount = out_openjobcount ? out_openjobcount : 0; //default to 0 if empty
	
	//API call, send data for creation and update UI
	jQuery.ajax({
		url: '/jobs/addCompany',
		type: 'POST',
		data: {
			name: out_name,
			link: out_link,
			city: out_city,
			state: out_state,
			openjobcount: out_openjobcount
		},
		success: function (response) {
			if(response.res == "OK") {
				//on success, display a message and clear the input fields
				setMessageText((new Date()).toLocaleTimeString() + ': added ' + out_name);
				jQuery(name_field).val("");
				jQuery(link_field).val("");
				jQuery(state_field).val("");
				jQuery(city_field).val("");
				jQuery(open_job_field).val("");
				
				var new_obj = {
					_id: response._id.$id,
					name: out_name,
					link: out_link,
					state: out_state,
					city: out_city,
					openjobcount: out_openjobcount
				};
				
				//update UI with new company
				numCompanies++;
				insertItem(new_obj.name, makeItem(new_obj, new_obj._id));
				balanceColumns();
				jQuery("#search").keyup(); //applies filters to new entry in UI if applicable
			}
			else {
				setMessageText((new Date()).toLocaleTimeString() + ': failed to add ' + out_name);
			}
			setButtonsDisabled(false);
		}
	}).fail(function() {
		setMessageText((new Date()).toLocaleTimeString() + ': failed to add ' + out_name);
		setButtonsDisabled(false);
	});
}

function updateCompany(id) {
	//set commonly accessed elements here, reduces errors from making changes in multiple places
	var company_input_base_str = "#company" + id + " .company-input";
	var company_required_fields = jQuery(company_input_base_str + " .required");
	var company_name_label = jQuery("#companyTitle" + id);
	setCompanyMessageText(id, "");
	setButtonsDisabled(true);
	
	//base case checking, don't proceed if missing a required field
	if(checkMissingRequiredFields(company_required_fields)) {
		setCompanyMessageText(id, (new Date()).toLocaleTimeString() + ': failed to update ' + jQuery(company_name_label).html());
		setButtonsDisabled(false);
		return;
	}
	
	//retrieve input values
	var out_name = jQuery(company_input_base_str + " .name").val();
	var out_link = jQuery(company_input_base_str + " .link").val();
	var out_state = jQuery(company_input_base_str + " .state").val();
	var out_city = jQuery(company_input_base_str + " .city").val();
	var out_openjobcount = jQuery(company_input_base_str + " .openjobcount").val();
	out_openjobcount = out_openjobcount ? out_openjobcount : 0; //default to 0 if empty
	
	//API call, send data for update
	jQuery.ajax({
		url: '/jobs/updateCompany',
		type: 'POST',
		data: {
			_id: id,
			name: out_name,
			link: out_link,
			city: out_city,
			state: out_state,
			openjobcount: out_openjobcount
		},
		success: function (response) {
			//display success/fail message
			if(response.res == "OK") {
				setCompanyMessageText(id, (new Date()).toLocaleTimeString() + ': updated ' + out_name);
				jQuery(company_name_label).html(out_name);
			}
			else {
				var old_name = jQuery(company_name_label).html();
				setCompanyMessageText(id, (new Date()).toLocaleTimeString() + ': failed to update ' + old_name);
			}
			setButtonsDisabled(false);
		}
	}).fail(function() {
		var old_name = jQuery(company_name_label).html();
		setCompanyMessageText(id, (new Date()).toLocaleTimeString() + ': failed to update ' + old_name);
		setButtonsDisabled(false);
	});
}

function deleteCompany(id) {
	setButtonsDisabled(true);
	setMessageText("");
	
	//API call, send entry id for deletion and update UI
	jQuery.ajax({
		url: '/jobs/removeCompany',
		type: 'POST',
		data: {
			_id: id
		},
		success: function (response) {
			//display success/error message
			if(response.res == "OK") {
				var name = jQuery("#company" + id + " .company-input .name").val();
				setMessageText((new Date()).toLocaleTimeString() + ': deleted ' + name);
				
				//update UI
				jQuery("#company" + id).parent().remove();
				numCompanies--;
				balanceColumns();
			}
			else {
				setCompanyMessageText(id, (new Date()).toLocaleTimeString() + ': failed to delete ' + name);
			}
			setButtonsDisabled(false);
		}
	}).fail(function() {
		setCompanyMessageText(id, (new Date()).toLocaleTimeString() + ': failed to delete ' + name);
		setButtonsDisabled(false);
	});
}

function checkMissingRequiredFields(required_fields) {
	//iterate through required fields, highlight missing fields with red bordering, return
	//bool reflecting if a required field is missing
	var missing_field = false;
	jQuery(required_fields).css("border","");
	for(var i = 0; i < required_fields.length; i++) {
		if(!jQuery(required_fields[i]).val()) {
			missing_field = true;
			jQuery(required_fields[i]).css("border","1px solid red");
		}
	}
	
	return missing_field;
}

function setMessageText(msg_str) {
	//set the success/fail main message
	jQuery("#resMsg").html(msg_str);
}

function setCompanyMessageText(id, msg_str) {
	//set the success/fail company message
	jQuery("#company" + id + " .company-input .res-msg").html(msg_str);
}

function setButtonsDisabled(disabled_b) {
	//disable/enable buttons to help control database requests
	jQuery(".disable-target").prop("disabled", disabled_b);
}