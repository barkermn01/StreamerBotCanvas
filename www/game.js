const animationTime = 10;

let lastFrameTime = Date.now();
let currentFrameTime = Date.now();
window.onresize = () => {
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;
};


const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

class Emote {
    isFinished = false;

    width = 96;
    height = 96;
    top = rndInt(this.width, window.innerHeight)-this.width;
    left = rndInt(this.height, window.innerWidth)-this.height;


    #moveVertical = rndInt(100, 500);
    #moveHorizontal = rndInt(100, 500);
    #image = new Image();
    #animationTimeLeft = animationTime;

    constructor(path) {
        this.#image.src = path;
    }

    update(dt) {
        if(this.#animationTimeLeft <= 2){
            if(this.width >= 0 || this.height >= 0){
                this.width -= 50*dt;
                this.height -= 50*dt;
                this.top += 25*dt;
                this.left += 25*dt;
            }else{
                this.isFinished = true;
            }
        }
        this.top += this.#moveVertical * dt;
        this.left += this.#moveHorizontal * dt;
        if (this.top + this.height >= window.innerHeight || this.top <= 0) {
            this.#moveVertical = 0 - this.#moveVertical;
        }
        if (this.left + this.width >= window.innerWidth || this.left <= 0) {
            this.#moveHorizontal = 0 - this.#moveHorizontal;
        }
        this.#animationTimeLeft -= dt;
    }

    draw(ctx) {
        ctx.drawImage(this.#image, this.left, this.top, this.width, this.height);
    }
}

window.emotes = [];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;

    function primaryLoop() {
        currentFrameTime = Date.now();
        const ctx = document.getElementById("canvas").getContext("2d");
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        deltaTime = (currentFrameTime - lastFrameTime) / 1000;
        emotes.forEach((emote, idx) => { 
            emote.update(deltaTime); 
            if(!emote.isFinished){
                emote.draw(ctx);  
            }
        });
        emotes = emotes.filter(emote => !emote.isFinished);
        lastFrameTime = currentFrameTime;
        window.requestAnimationFrame(primaryLoop);
    };

    window.requestAnimationFrame(primaryLoop);
});