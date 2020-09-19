$(document).ready(function () {
	/**
	 * pairStore -> localStorage's pairs
	 * pairId -> id of the next pair
	 */
	let pairStore, pairId;
	init();
	/**
	 * Pair Structure:
	 * {
	 * 	pairId	: int,
	 * 	font1		: String,
	 * 	font2		: String,
	 * 	color		: hex
	 * }
	 */

	function init() {
		let fontsList;
		if (localStorage.getItem('pairs') === null) {
			const pairs = [
				{
					pairId: 0,
					font1: 'Raleway',
					font2: 'Open Sans',
					color: '#90cdf4',
				},
			];
			pairStore = localStorage.setItem('pairs', JSON.stringify(pairs));
			pairId = 1;
		} else {
			pairStore = JSON.parse(localStorage.getItem('pairs'));
			pairId = pairStore.length++;
			setPreviousPairs();
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
				console.log(data);
				const d = JSON.parse(data);
				while (empty) {
					if (Object.keys(d[i]).length !== 0) {
						empty = false;
					}
					i++;
				}

				if (!empty) {
					localStorage.setItem('fontsList', data);
				}

				$('.select-font').select2({
					data: d,
					minimumInputLength: 3,
				});
			});
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
			$('.select-font').select2({
				data: JSON.parse(localStorage.getItem('fontsList')),
				minimumInputLength: 3,
			});
		}
	}

	function setData() {}

	function setPreviousPairs() {}

	function addPair() {
		//Get List
		// const pairList = $('#pair-list');
		// console.log(pairList);

		//Copy the last id of the list
		const newPair = $(`#pair-${pairId - 1}`).clone();

		//Set id for the new pair
		newPair.removeAttr('id').attr('id', `pair-${pairId}`);
		console.log(newPair);
		//Add pair to the list
		newPair.appendTo('#pair-list');
		pairId++;
		//localStorage.setItem('lastPairId', pairId);
		pairStore;
	}

	function updatePair(pairId, font1, font2) {}

	function groupFontsByCategory(fonts) {
		let sansSerif, serif, display, handW, mono;

		//TODO: Use reduce instead of filter and map
		serif = fonts
			.filter((fontInfo) => fontInfo.category === 'serif')
			.map((fontInfo) => {
				return {
					id: fontInfo.family,
					text: fontInfo.family,
				};
			});
		sansSerif = fonts
			.filter((fontInfo) => fontInfo.category === 'sans-serif')
			.map((fontInfo) => {
				return {
					id: fontInfo.family,
					text: fontInfo.family,
				};
			});
		display = fonts
			.filter((fontInfo) => fontInfo.category === 'display')
			.map((fontInfo) => {
				return {
					id: fontInfo.family,
					text: fontInfo.family,
				};
			});
		handW = fonts
			.filter((fontInfo) => fontInfo.category === 'handwriting')
			.map((fontInfo) => {
				return {
					id: fontInfo.family,
					text: fontInfo.family,
				};
			});
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
