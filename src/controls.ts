export class Controls {
    wrapper = document.querySelector("#controls")!;
    startButton: HTMLButtonElement = document.querySelector("#start")!;
    onstart = () => {};

    constructor() {
        this.setActive(false);
        this.startButton.addEventListener("click", () => this.onstart());
    }

    setActive(val: boolean) {
        if (val) {
            this.wrapper.classList.remove("hidden");
        } else {
            this.wrapper.classList.add("hidden");
        }
    }
}
