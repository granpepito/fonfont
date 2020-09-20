/**
 * pairStore -> localStorage's pairs
 * pairId -> id of the next pair
 */
let pairStore, pairId;
const pairColors = [
	'#feb2b2',
	'#fbd38d',
	'#faf089',
	'#9ae6b4',
	'#81e6d9',
	'#90cdf4',
	'#a3bffa',
	'#d6bcfa',
	'#fbb6ce',
];

/**
 * Pair Structure:
 * {
 * 	pairId	: int,
 * 	font1		: String,
 * 	font2		: String,
 * 	color		: hex
 * }
 * 
 * Example
 * {
			pairId: 0,
			font1: 'Raleway',
			font2: 'Open Sans',
			color: '#90cdf4',
		}
	*/

$(document).ready(function () {
	//let fontsList;
	if (localStorage.getItem('pairs') === null) {
		const pairs = [];
		pairStore = localStorage.setItem('pairs', JSON.stringify(pairs));
		pairId = 1;
	} else {
		try {
			pairStore = JSON.parse(localStorage.getItem('pairs'));
		} catch (e) {
			pairStore = localStorage.getItem('pairs');
		} finally {
			pairId = pairStore.length++;
			setPreviousPairs();
		}
	}

	if (localStorage.getItem('fontsList') === null) {
		$.ajax({
			url:
				'https://www.googleapis.com/webfonts/v1/webfonts?sort=alpha&key=AIzaSyA9zIs6lEdAEasoxpvpuKeg9I8ml7Hu9f4',

			dataType: 'json',
			dataFilter: function (data, type) {
				const d = JSON.parse(data);
				const results = groupFontsByCategory(d.items);
				return JSON.stringify(results);
			},
		}).done(function (data) {
			let empty = true;
			let i = 0;
			let d;
			try {
				d = JSON.parse(data);
			} catch (e) {
				console.error(e);
				d = data;
			}

			//Verify that the we have some items to store in the le local storage
			while (empty) {
				if (Object.keys(d[i]).length !== 0) {
					empty = false;
				}
				i++;
			}
			if (!empty) {
				localStorage.setItem('fontsList', JSON.stringify(data));
			}

			//Add the list of fonts to .select-font select
			$('.select-font').select2({
				data: d,
				// minimumInputLength: 3,
			});
		});
		//TODO: verify if error

		// $('.select-font').select2({
		// 	ajax: {
		// 		url: 'https://www.googleapis.com/webfonts/v1/webfonts',
		// 		data: function (params) {
		// 			var query = {
		// 				sort: 'alpha',
		// 				key: 'AIzaSyA9zIs6lEdAEasoxpvpuKeg9I8ml7Hu9f4',
		// 			};

		// 			return query;
		// 		},
		// 		processResults: function (data) {
		// 			let results = [];

		// 			results = groupFontsByCategory(data.items);

		// 			let empty = true;
		// 			let i = 0;
		// 			while (empty) {
		// 				if (Object.keys(results[i]).length !== 0) {
		// 					empty = false;
		// 				}
		// 				i++;
		// 			}

		// 			if (!empty) {
		// 				localStorage.setItem(
		// 					'fontsList',
		// 					JSON.stringify(results)
		// 				);
		// 			}

		// 			return {
		// 				results,
		// 			};
		// 		},
		// 	},
		// 	minimumInputLength: 3,
		// });
	} else {
		//Get fonts list from local Storage
		try {
			$('.select-font').select2({
				data: JSON.parse(localStorage.getItem('fontsList')),
				// minimumInputLength: 3,
			});
		} catch (e) {
			console.error(e);
			$('.select-font').select2({
				data: localStorage.getItem('fontsList'),
				// minimumInputLength: 3,
			});
		}
	}

	function groupFontsByCategory(fonts) {
		let sansSerif, serif, display, handW, mono;

		//TODO: Use reduce instead of filter and map
		//Find serif fonts
		serif = fonts
			.filter((fontInfo) => fontInfo.category === 'serif')
			.map((fontInfo) => {
				return {
					id: fontInfo.family,
					text: fontInfo.family,
				};
			});
		//Find sans-serif fonts
		sansSerif = fonts
			.filter((fontInfo) => fontInfo.category === 'sans-serif')
			.map((fontInfo) => {
				return {
					id: fontInfo.family,
					text: fontInfo.family,
				};
			});
		//Find display fonts
		display = fonts
			.filter((fontInfo) => fontInfo.category === 'display')
			.map((fontInfo) => {
				return {
					id: fontInfo.family,
					text: fontInfo.family,
				};
			});
		//Find handwriting fonts
		handW = fonts
			.filter((fontInfo) => fontInfo.category === 'handwriting')
			.map((fontInfo) => {
				return {
					id: fontInfo.family,
					text: fontInfo.family,
				};
			});
		//Find monospace fonts
		mono = fonts
			.filter((fontInfo) => fontInfo.category === 'monospace')
			.map((fontInfo) => {
				return {
					id: fontInfo.family,
					text: fontInfo.family,
				};
			});

		return [
			{
				text: 'Serif',
				children: serif,
			},
			{
				text: 'Sans-Serif',
				children: sansSerif,
			},
			{
				text: 'Display',
				children: display,
			},
			{
				text: 'Monospace',
				children: mono,
			},
			{
				text: 'Handwriting',
				children: handW,
			},
		];
	}
});

function setPreviousPairs() {}

function addPair() {
	console.log('oui');
	//Get List
	// const pairList = $('#pair-list');
	// console.log(pairList);

	//Copy the last id of the list
	const newPair = $(`#pair-${pairId - 1}`).clone();

	//Set id for the new pair
	newPair.removeAttr('id').attr('id', `pair-${pairId}`);

	//Change attributes of "select" elements
	newPair
		.find(`label[for^=pair-${pairId - 1}]`)
		.replaceWith(
			`<label class="font-1" for="pair-${pairId}-select-font-1">First Font</label>`
		);
	newPair
		.find(`#pair-${pairId - 1}-select-font-1`)
		.removeAttr('id data-select2-id onchange')
		.attr('id', `pair-${pairId}-select-font-1`)
		.attr('data-select2-id', `pair-${pairId}-select-font-1`)
		.attr('onchange', `updatePair(event, ${pairId})`);
	newPair
		.find(`#pair-${pairId - 1}-select-font-2`)
		.removeAttr('id data-select2-id')
		.attr('id', `pair-${pairId}-select-font-2`)
		.attr('data-select2-id', `pair-${pairId}-select-font-2`)
		.attr('onchange', `updatePair(event, ${pairId})`);

	// New color per pair
	newPair.css('background-color', pairColors[pairId % pairColors.length]);

	//Add pair to the list
	newPair.appendTo('#pair-list');
	pairId++;
	//localStorage.setItem('lastPairId', pairId);
	//TODO: Add new pair to pairStore;
}

function updatePair(event, pairId) {
	const t = event.target;
	const actualPair = $(`#pair-${pairId}`);
	const fontToUpdate = $(t).attr('id').includes('font-1')
		? '.font-1'
		: '.font-2';

	WebFont.load({
		google: {
			families: [`${t.value}:400,700`],
		},
		timeout: 2000,
		active: () => {
			console.log('fontToUpdate: ' + fontToUpdate + '\n ' + t.value);
			actualPair.find(fontToUpdate).css('font-family', t.value);
		},
	});
}
