class SketchPad {
  constructor(container, size = 400) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style.backgroundColor = "white";
    this.canvas.style.boxShadow = "0px 0px 10px 2px black";
    // append this canvas to the container using this container
    container.appendChild(this.canvas);

    const lineBreak = document.createElement("br");
    container.appendChild(lineBreak);

    const undobutton = document.createElement("button");
    undobutton.textContent = "undo";
    container.appendChild(undobutton);

    this.undobutton = undobutton;

    const clearbutton = document.createElement("button");
    clearbutton.textContent = "clear";
    container.appendChild(clearbutton);

    this.clearbutton = clearbutton;

    this.ctx = this.canvas.getContext("2d");
    this.#addEventlisteners();

    this.paths = [];
    this.isDrawing = false;
  }
  #addEventlisteners() {
    this.canvas.onmousedown = (evt) => {
      const mouse = this.#getMouse(evt);
      this.paths.push([mouse]);
      this.isDrawing = true;
    };
    this.canvas.onmousemove = (evt) => {
      if (this.isDrawing) {
        const mouse = this.#getMouse(evt);

        // get the last pass
        const lastPath = this.paths[this.paths.length - 1];
        lastPath.push(mouse);
        this.#redraw();
      }
    };
    this.canvas.onmouseup = (evt) => {
      this.isDrawing = false;
    };
    this.canvas.addEventListener("touchstart", (evt) => {
      const loc = evt.touches[0];
      this.canvas.onmousedown(loc);
    });
    this.canvas.addEventListener("touchmove", (evt) => {
      const loc = evt.touches[0];
      this.canvas.onmousemove(loc);
    });
    this.canvas.addEventListener("touchend", (evt) => {
      const loc = evt.changedTouches[0];
      this.canvas.onmouseup(loc);
    });
    this.undobutton.addEventListener("click", () => {
      this.paths.pop();
      this.#redraw();
    });
    this.clearbutton.addEventListener("click", () => {
      this.paths = [];
      this.#redraw();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    });
    // disbale scroll to refressh
    this.canvas.addEventListener(
      "touchmove",
      (evt) => {
        evt.preventDefault();
      },
      { passive: false }
    );
  }
  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw.paths(this.ctx, this.paths);
  }
  #getMouse = (evt) => {
    const rect = this.canvas.getBoundingClientRect();
    const mouse = [
      Math.round(evt.clientX - rect.left),
      Math.round(evt.clientY - rect.top),
    ];
    return mouse;
  };
}
