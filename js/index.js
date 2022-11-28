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
		//Get fonts list from localStorage
		try {
			setSelect2Data();
		} catch (e) {
			console.error(e);
			setSelect2Data('.select-font', localStorage.getItem('fontsList'));
		}
	}

	/**
	 * Sorts the fonts array by categories.
	 * @param {array} fonts
	 * @returns {array}
	 */
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

/**
 * Sets data on a select element for the Select2 plugin
 * @param {string} selectElement
 * @param {object} data
 */
function setSelect2Data(
	selectElement = '.select-font',
	data = JSON.parse(localStorage.getItem('fontsList'))
) {
	$(selectElement).select2({
		data,
		// minimumInputLength: 3,
	});
}

/**
 * Sets back old pairs present in the localStorage.
 */
function setPreviousPairs() {}

/**
 * Adds a new pair of fonts on the page based on the previous one.
 */
function addPair() {
	// Color for the new pair
	const newPairColor = pairColors[pairId % pairColors.length];
	const newPair = `<article class="pair" id="pair-${pairId}" style=" background-color: ${newPairColor}">

        <!-- List of fonts  -->
        <div class="pair-presentation-section type-fonts">
          <div>
            <label class="font-1" for="pair-${pairId}-select-font-1">First Font</label>
            <select class="select-font select-font-1" id="pair-${pairId}-select-font-1" onchange="updatePair(event, ${pairId})">
              <option value="" disabled selected>Select a font</option>
            </select>
          </div>
          <div>
            <label class="font-2" for="pair-${pairId}-select-font-2">Second Font</label>
            <select class="select-font select-font-2" id="pair-${pairId}-select-font-2" onchange="updatePair(event, ${pairId})">
              <option value="" disabled selected>Select a font</option>
            </select>
          </div>

        </div>

        <!-- Fonts' weights examples -->
        <div class=" pair-presentation-section type-weights">
          <div class="font-bold font-1">
            <p>Bold</p>
            <div>
              <p class="font-name">Raleway</p>
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789<br>!@#$%^&*()</p>
            </div>
          </div>
          <div class="font-regular font-1">
            <p>Regular</p>
            <div>
              <p class="font-name">Raleway</p>
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789<br>!@#$%^&*()</p>
            </div>
          </div>
          <div class="font-bold font-2">
            <p>Bold</p>
            <div>
              <p class="font-name">Open Sans</p>
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789<br>!@#$%^&*()</p>
            </div>
          </div>
          <div class="font-regular font-2">
            <p>Regular</p>
            <div>
              <p class="font-name">Open Sans</p>
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789<br>!@#$%^&*()</p>
            </div>
          </div>
        </div>

        <!-- Pairing Example  -->
        <div class="pair-presentation-section type-example">
          <div class="pair-example-title font-1">
            <p class="pair-example-typeset">Title</p>
            <p contenteditable="true">Article Title</p>
          </div>
          <div class="pair-example-lead font-1">
            <p class="pair-example-typeset">Lead</p>
            <p contenteditable="true">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua ut enim ad.
            </p>
          </div>
          <div class="pair-example-paragraph font-2">
            <p class="pair-example-typeset">Paragraph</p>
            <p contenteditable="true">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            </p>
          </div>
          <div class="pair-example-btn font-2">
            <p class="pair-example-typeset">Button</p>
            <button type="button" class="btn">Call to action</button>
          </div>

        </div>

      </article>`;

	$('#pair-list').append(newPair);
	setSelect2Data(`#pair-${pairId} .select-font`);
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
			actualPair.find(fontToUpdate).css('font-family', t.value);
			actualPair.find(`${fontToUpdate} .font-name`).each(function () {
				$(this).text(t.value);
			});
		},
	});
}

/**
 *
 * @param {string} pairId
 * @param {string} font1
 * @param {string} font2
 */
function addPairToPairStore(pairId, font1, font2) {}
