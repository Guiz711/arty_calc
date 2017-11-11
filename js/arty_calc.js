/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   arty_calc.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gmichaud <gmichaud@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/11/10 09:50:38 by gmichaud          #+#    #+#             */
/*   Updated: 2017/11/10 12:57:25 by gmichaud         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let min_range = 0;
let max_range = 0;
let errors = ["<strong>Error :</strong> Please choose an artillery type.",
				"<strong>Error :</strong> Target and Friendly distance and azimuth must not be the same.",
				"<strong>Error :</strong> Target and Friendly distance must not be both 0."]

function type_selected() {
	let arty_type = $('input[name="arty_type"]:checked').val();

	if ($('.alert').html() === errors[0]) {
		$('.alert').css('display', 'none');
	}
	$('#mortar, #howitzer, #field_arty, #gunboat').css('border-style', 'hidden');
	$('#' + arty_type).css('border-style', 'solid');
	last_arty = arty_type;
	switch (arty_type) {
		case "mortar" :
			min_range = 45;
			max_range = 65;
			break;
		case "howitzer" :
			min_range = 75;
			max_range = 150;
			break;
		case "field_arty" :
			min_range = 75;
			max_range = 150;
			break;
		case "gunboat" :
			min_range = 50;
			max_range = 100;
			break;
	}
}

function convert_angle(angle) {
	return ((angle > 360) ? angle - 360 : angle);
}

function rad(angle) {
	return (Math.PI * angle / 180);
}

function deg(angle) {
	return (angle * 180 / Math.PI);
}

function calc_data(e_dist, e_azi, f_dist, f_azi) {
	let a_delt = 0;
	let r_dist = 0;
	let a_step = 0;
	let r_azi = 0;

	a_delt = (e_azi > f_azi) ? rad(e_azi - f_azi) : rad(f_azi - e_azi);
	r_dist = Math.sqrt(e_dist * e_dist + f_dist * f_dist - 2 * e_dist * f_dist * Math.cos(a_delt));
	a_step = Math.round(deg(Math.asin(e_dist * Math.sin(a_delt) / r_dist)));
	r_azi = (e_azi > f_azi) ? f_azi + 180 - a_step : f_azi + 180 + a_step;
	if (r_dist < min_range) {
		$('#overlay').html('<p id = "warning"><strong>Warning :</strong> Target too close of arty.</p><div class="result"><p>Distance: ' + r_dist.toFixed(1) + 'm</p><p>Azimuth: ' + Math.round(r_azi) + '°</p></div>');
	} else if (r_dist > max_range) {
		$('#overlay').html('<p id = "warning"><strong>Warning :</strong> Target too far from arty.</p><div class="result"><p>Distance: ' + r_dist.toFixed(1) + 'm</p><p>Azimuth: ' + Math.round(r_azi) + '°</p></div>');
	} else {
		$('#overlay').html('<div class="result"><p>Distance: ' + r_dist.toFixed(1) + 'm</p><p>Azimuth: ' + Math.round(r_azi) + '°</p></div>');
	}
	$('#overlay').css('display', 'inline');
}

function verify_data(enn_dist, enn_azi, fri_dist, fri_azi) {
	if (enn_dist === fri_dist && enn_azi === fri_azi) {
		$('.alert').html(errors[1]);
		$('.alert').css('display', 'inline');
		return 1;
	}
	if (enn_dist === 0 && fri_dist === 0) {
		$('.alert').html(errors[2]);
		$('.alert').css('display', 'inline');
		return 1;
	}
	if ($('.alert').html() === errors[1] || $('.alert').html() === errors[2]){
		$('.alert').css('display', 'none');
	}
	return 0;
}

function get_data(e) {
	e.preventDefault();
	let enn_dist = parseFloat($('input[name="ennemy_dist"]').val());
	let enn_azi = parseFloat($('input[name="ennemy_azi"]').val());
	let fri_dist = parseFloat($('input[name="friendly_dist"]').val());
	let fri_azi = parseFloat($('input[name="friendly_azi"]').val());
	
	if (max_range === 0) {
		$('.alert').html(errors[0]);
		$('.alert').css('display', 'inline');
		return;
	}
	enn_dist = isNaN(enn_dist) ? 0 : enn_dist;
	enn_azi = isNaN(enn_azi) ? 0 : enn_azi;
	fri_dist = isNaN(fri_dist) ? 0 : fri_dist;
	fri_azi = isNaN(fri_azi) ? 0 : fri_azi;
	if (verify_data(enn_dist, enn_azi, fri_dist, fri_azi)) {
		return;
	}
	calc_data(enn_dist, enn_azi, fri_dist, fri_azi);
}

function clear_result() {
	$('#overlay').css('display', 'none');
}

function listen_events() {
	console.log("ready!");
	$('input[name="arty_type"]').change(type_selected);
	$('#send_btn').click(get_data);
	$('#overlay').click(clear_result);
}

$.when($.ready).then(listen_events);