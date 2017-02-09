$(function initialize() {
	newGame(5,5,4)
});
function newGame(h, w, m) {
	a = [];
	for (let i = 0; i < h; i++) {
		a[i] = [];
		for (let j = 0; j < w; j++) {
			a[i][j] = {nearby: 0, checked: false};
		};
	};
	console.log(a);
	let p = 0;
	while (p < m) {
		let x = Math.floor(Math.random() * w);
		let y = Math.floor(Math.random() * h);
		if (!a[y][x].mine) {
			a[y][x].mine = true;
			p++;
			for (let k = y - 1; k <= y + 1; k++) {
				if (a[k]) {
					for (let l = x - 1; l <= x + 1; l++) {
						if (a[k][l]) {
							if (k != y || l != x) {
								a[k][l].nearby ++;
							};
						};
					};
				};
			};
		};
	};

	console.log(a);

};