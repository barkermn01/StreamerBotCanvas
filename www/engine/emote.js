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
    #image = new Image();
    #animationTimeLeft;

    constructor(path) {
        this.#image.src = path;
        this.#image.addEventListener("load", () => { this.isReady = true; })

        // if fixed speed is provided for movement
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
        }catch(err){ ShowError(err, true); console.error(err); }
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
        if(this.isReady){
            ctx.drawImage(this.#image, this.left, this.top, this.width, this.height);
        }else{
            if(new Date() > this.Expires){
                this.isFinished = true;
            }
        }
    }
}

let Emotes = [];
const Module = {
    name: "Emote",
    draw: (ctx) => {
        Emotes.forEach(emote => { 
            emote.update(deltaTime); 
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
}

window.Modules.push(Module)