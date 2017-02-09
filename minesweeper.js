$(function initialize() {
	newGame(6,5,6)
});
function newGame(h, w, m) {
	a = [];
	for (let i = 0; i < h; i++) {
		a[i] = [];
		for (let j = 0; j < w; j++) {
			a[i][j] = {nearby: 0, x: j, y: i, checked: false};
		};
	};

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

	var rows = d3.select("#game")
		.selectAll(".row")
		.data(a);
	var cells = rows.selectAll(".cell")
		.data(function(d, i) {return d})
		.html(null)
		.classed("checked", false)
		.on("click", reveal)
		.enter()
		.append("div")
		.classed("cell", true)
		.on("click", reveal)
		.exit().remove();

	rows.enter()
		.append("div")
		.classed("row", true)
		.selectAll(".cell")
		.data(function(d, i) {return d})
		.enter()
		.append("div")
		.classed("cell", true)
		.on("click", reveal);

	rows.exit().remove();
};
function reveal(data, index) {
	let content = [];
	if (data.mine) {
		content[0] = "M"
	} else {
		if (data.nearby == 0) {
			content[0] =  ""
		} else {
			content[0] = data.nearby;
		}
	};

	let current = d3.select(this)
		.classed("checked", true)
		.datum(function(d,i) {d.checked = true; return d;})
		.on("click", null);

	current.selectAll("p")
		.data(content)
		.enter()
		.append("p")
		.text(function(d,i) {return d.toString()});

		if (data.mine) {
			alert("You Lose");

		} else if (data.nearby == 0) {
			let surrounding = d3.selectAll(".cell")
				.filter(function(d,i) {return d.checked == false;})
				.filter(function(d,i) {return d.x <= data.x + 1;})
				.filter(function(d,i) {return d.x >= data.x - 1;})
				.filter(function(d,i) {return d.y <= data.y + 1;})
				.filter(function(d,i) {return d.y >= data.y - 1;})
				.filter(function(d,i) {return d.x != data.x || d.y != data.y});
			if (surrounding) {
				surrounding.each(reveal);
			};

		};

		
		
		
};