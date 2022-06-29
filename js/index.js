/**
 * pairStore -> localStorage's pairs
 * pairId -> ID of the next pair
 */
let pairStore,
	pairId = 1;
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
 * Inside pairStore
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
		// pairId = 1;
	} else {
		try {
			pairStore = JSON.parse(localStorage.getItem('pairs'));
		} catch (e) {
			pairStore = localStorage.getItem('pairs');
		} finally {
			pairId = pairStore.length + 1;
			setPreviousPairs();
		}
	}

	if (localStorage.getItem('fontsList') === null) {
		$.ajax({
			url: 'https://www.googleapis.com/webfonts/v1/webfonts?sort=alpha&key=AIzaSyA9zIs6lEdAEasoxpvpuKeg9I8ml7Hu9f4',

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

/**
 * Adds a new pair of fonts on the page based on the previous one.
 */
function addPair() {
	console.log('oui');
	//Get List
	// const pairList = $('#pair-list');
	// console.log(pairList);

	//Copy the last id of the list
	const newPair = $(`#pair-${pairId - 1}`).clone();

	//Set ID for the new pair
	newPair.removeAttr('id').attr('id', `pair-${pairId}`);

	//Set the ID on old attributes
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

	// Color for the new pair
	const newPairColor = pairColors[pairId % pairColors.length];
	newPair.css('background-color', newPairColor);

	//Add pair to the list
	newPair.appendTo('#pair-list');
	newPair.find('.select-font').each(function () {
		$(this).select2();
	});
	pairId++;
	//localStorage.setItem('lastPairId', pairId);
	//TODO: Add new pair to pairStore;
}

/**
 * Update a pair of fonts on the screen.
 * @param event Event called.
 * @param pairId ID of the pair of font that has to be modified.
 */
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
			actualPair.find(`${fontToUpdate} .font-name`).each(function () {
				$(this).text(t.value);
			});
		},
	});
}

function addToPairStore(pairId, font1, font2) {}
