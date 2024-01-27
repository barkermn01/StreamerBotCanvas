class Emote {
    isFinished = false;

    width = 96;
    height = 96;
    top = rndInt(this.width, window.innerHeight)-this.width;
    left = rndInt(this.height, window.innerWidth)-this.height;


    #moveVertical = rndInt(Config.emote.Speed.Min, Config.emote.Speed.Min);
    #moveHorizontal = rndInt(Config.emote.Speed.Min, Config.emote.Speed.Min);
    #image = new Image();
    #animationTimeLeft = Config.emote.AnimationTime;

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