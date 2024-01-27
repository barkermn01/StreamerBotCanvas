const animationTime = 10;

let lastFrameTime = Date.now();
let currentFrameTime = Date.now();
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
window.onresize = () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
};


const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

class Emote {
    isFinished = false;
    isStarted = false;

    top = rndInt(0, windowHeight);
    left = rndInt(0, windowWidth);
    width = 128;
    height = 128;

    #moveVertical = rndInt(50, 300)-windowHeight;
    #moveHorizontal = rndInt(50, 300)-windowWidth;
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
        }else{
            this.top += this.#moveVertical * dt;
            this.left += this.#moveHorizontal * dt;
            if (this.top + this.height >= windowHeight || this.top <= 0) {
                this.#moveVertical = 0 - this.#moveVertical;
            }
            if (this.left + this.width >= windowWidth || this.left <= 0) {
                this.#moveHorizontal = 0 - this.#moveHorizontal;
            }
            this.#animationTimeLeft -= dt;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.#image, this.left, this.top, this.width, this.height);
    }
}

window.emotes = [new Emote("https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_d872a800ebf6498184d275fd0933cc78/default/dark/3.0")];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("canvas").width = windowWidth;
    document.getElementById("canvas").height = windowHeight;

    function primaryLoop() {
        currentFrameTime = Date.now();
        const ctx = document.getElementById("canvas").getContext("2d");
        ctx.clearRect(0, 0, windowWidth, windowHeight);

        deltaTime = (currentFrameTime - lastFrameTime) / 1000;
        emotes.forEach((emote, idx) => { 
            emote.update(deltaTime); 
            if(!emote.isFinished){
                emote.draw(ctx);  
            }else{
                delete emotes[idx];
            }
        });
        emotes = emotes.filter(emote => !emote.isFinished);
        lastFrameTime = currentFrameTime;
        window.requestAnimationFrame(primaryLoop);
    };

    window.requestAnimationFrame(primaryLoop);
});

const client = new StreamerbotClient({
    host: '127.0.0.1',
    port: 9090,
    endpoint: '/',
    subscribe: {
      "General": "Custom"
    },
    onData: (data) => console.log(data)
});