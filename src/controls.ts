export class Controls {
    wrapper = document.querySelector("#controls")!;

    constructor() {
        this.setActive(false);
    }

    setActive(val: boolean) {
        if (val) {
            this.wrapper.classList.remove("hidden");
        } else {
            this.wrapper.classList.add("hidden");
        }
    }
}
