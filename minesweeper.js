var msHeight;
var msWidth;
var msMines;

$(function initialize() {
	newGame(6,5,6)
});
function newGame(h, w, m) {
	msHeight = h;
	msWidth = w;
	msMines = m;
	var a = [];
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
		.classed("checked mine maybeMine", false)
		.on("click", reveal);

	cells.enter()
		.append("div")
		.classed("cell", true)
		.on("click", reveal);

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
	cells.exit().remove();
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

	current.selectAll("div")
		.data(content)
		.enter()
		.append("div")
		.text(function(d,i) {return d.toString()});

	if (data.mine) {
		winLossHandler(false, this);

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
	winChecker();
};

function winLossHandler(win, cell) {
	 let cells = d3.select("#game")
		.selectAll(".row")
		.selectAll(".cell")
		.on("click", null);
	if (win) {
		alert("You Win!")
	} else {
		cells.filter(function(d,i) {return d.mine;}).classed("mine", true);
		alert("You Lose");
	};
};

function winChecker() {
	var count = d3.select("#game")
		.selectAll(".cell")
		.filter(function(d,i) {return !d.checked;})
		.size();
	if (count == msMines) { winLossHandler(true); };
};
function flagMine(cell) {
// Use oncontextmenu event and return false
};