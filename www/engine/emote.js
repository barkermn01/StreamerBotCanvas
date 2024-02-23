class Emote {
    isFinished = false;
    isReady = false;
    Expires = new Date()+30000

    width = 96;
    height = 96;
    top = rndInt(this.width, window.innerHeight)-this.width;
    left = rndInt(this.height, window.innerWidth)-this.height;


    #moveVertical;
    #moveHorizontal;
    #animationTimeLeft;

    #gif;
    #frameBuffer = [];
    #IsAnimated = false;
    #currentFrame = 0;
    #framesReady = 0;
    #frameUpdateTime = 1000/25;
    #currentFrameTime = 0;

    constructor(path) {
        this.#gif = document.createElement("img");
        this.#gif.setAttribute("id", "gifRender");
        this.#gif.src = path;
        this.#gif.style.position = "absolute";
        this.#gif.style.right = "-72px";
        this.#gif.style.width="72px"
        document.body.appendChild(this.#gif);
        
        const sgif = new SuperGif({ gif: this.#gif, auto_play: false} );
        sgif.load(() => {
            const len = sgif.get_length();
            if(len > 0){
                this.#IsAnimated = true;
                for (let i = 0; i < sgif.get_length(); i++)
                {
                    sgif.move_to(i);
                    const frame = new Image();
                    frame.src = sgif.get_canvas().toDataURL('image/png')
                    frame.addEventListener("load", () => { 
                        this.#framesReady++;
                        if(this.#framesReady == this.#frameBuffer.length-1){
                            this.isReady = true;
                        }else{
                            this.isReady = false;
                        }
                    });
                    this.#frameBuffer.push(frame);
                }
            }
        });

        this.#frameBuffer[0] = new Image();
        this.#frameBuffer[0].src = path;
        this.#frameBuffer[0].addEventListener("load", () => { this.isReady = true; });

        try{
            const speedType = typeof(Config.emote.Speed);
            if( speedType == "object" && typeof Config.emote.Speed.Min == 'number' && typeof Config.emote.Speed.Max == 'number'){
                this.#moveVertical = MinMax.FromObject(Config.emote.Speed).GetValueInRange();
                this.#moveHorizontal = MinMax.FromObject(Config.emote.Speed).GetValueInRange();
            }else if(speedType == "number"){
                this.#moveVertical = MinMax.FromStatic(Config.emote.Speed).GetValueInRange();
                this.#moveHorizontal = MinMax.FromStatic(Config.emote.Speed).GetValueInRange();
            }

            const animationTimeType = typeof(Config.emote.AnimationTime);
            if( animationTimeType == "object" && typeof Config.emote.AnimationTime.Min == 'number' && typeof Config.emote.AnimationTime.Max == 'number'){
                this.#animationTimeLeft = MinMax.FromObject(Config.emote.AnimationTime).GetValueInRange();
            }else if(animationTimeType == "number"){
                this.#animationTimeLeft = MinMax.FromStatic(Config.emote.AnimationTime).GetValueInRange();
            }

            if(Config.emote.RandomDirectionsFromStart){
                const flipVert = rndInt(0, 100), flipHori = rndInt(0,100);
                if(flipVert <= 50){
                    this.#moveVertical = 0-this.#moveVertical
                }
                if(flipHori <= 50){
                    this.#moveHorizontal = 0-this.#moveHorizontal
                }
            }
        }catch(err){ console.error(err); ShowError(err, true); }
    }

    update(dt) {
        this.#currentFrameTime += dt * 1000;

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

        if(this.#IsAnimated){
            if(this.#currentFrameTime >= this.#frameUpdateTime){
                this.#currentFrameTime -= this.#frameUpdateTime;
                this.#currentFrame++;
            }
            if(this.#currentFrame > this.#frameBuffer.length-1){
                this.#currentFrame = 0;
            }
        }
    }

    draw(ctx) {
        if(this.isReady){
            ctx.drawImage(this.#frameBuffer[this.#currentFrame], this.left, this.top, this.width, this.height);
        }else{
            if(new Date() > this.Expires){
                this.isFinished = true;
            }
        }
    }
}

let Emotes = [];

window.Modules.push({
    name: "Emote",
    draw: (ctx) => {
        Emotes.forEach(emote => { 
            if(!emote.isFinished){
                emote.draw(ctx);  
            }
        });
    },
    update: (dt) => {
        Emotes.forEach(emote => { 
            emote.update(dt); 
        });
        Emotes = Emotes.filter(emote => !emote.isFinished);
    },
    message: (data) => {
        Emotes.push(new Emote(data.imageUrl));
    }
});