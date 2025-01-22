export default class LoopChart {
	constructor(options) {
		this.dom = options.dom;
		this.chartOption = options.chartOption;
		this.chartItem = echarts.init(this.dom);
		this.chartItem.setOption(this.chartOption, true);
		this.time = options.time ?? 1000;
		this.render = options.render;
		this.total = options.total;
		this.data = options.data;
		this.index = this.data.length;
		this.init();
	}
	init() {
		let self = this;
		this.dom.addEventListener("mouseover", function (param) {
			self.endLoop();
		});
		this.dom.addEventListener("mouseout", function (param) {
			self.startLoop();
		});
		self.startLoop();
	}
	startLoop() {
		this.loopId = setInterval(() => {
			if (this.total) {
				if (this.index >= this.total) {
					this.index = 0;
				}
				[this.chartOption, this.data] = this.render(this.data, this.index);
				if (this.chartItem) this.chartItem.setOption(this.chartOption, true);
				this.index++;
			} else {
				[this.chartOption, this.data] = this.render(this.data);
				if (this.chartItem) this.chartItem.setOption(this.chartOption, true);
			}
		}, this.time);
	}
	endLoop() {
		if (this.loopId) {
			clearInterval(this.loopId);
			this.loopId = null;
		}
	}
}