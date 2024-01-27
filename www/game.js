let lastFrameTime = Date.now();
let currentFrameTime = Date.now();
window.onresize = () => {
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;
};

const loadJS = (src) => {
    const srpt = document.createElement("script");
    srpt.setAttribute("src", src);
    srpt.setAttribute("type", "text/javascript");
    document.head.appendChild(srpt);
}

const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

window.GameObjects = [];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;

    Config.modules.forEach( name => loadJS("/engine/"+name+".js"));

    function primaryLoop() {
        currentFrameTime = Date.now();
        const ctx = document.getElementById("canvas").getContext("2d");
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        deltaTime = (currentFrameTime - lastFrameTime) / 1000;
        window.GameObjects.forEach(drawable => { 
            drawable.update(deltaTime); 
            if(!drawable.isFinished){
                drawable.draw(ctx);  
            }
        });
        window.GameObjects = window.GameObjects.filter(drawable => !drawable.isFinished);
        lastFrameTime = currentFrameTime;
        window.requestAnimationFrame(primaryLoop);
    };

    window.requestAnimationFrame(primaryLoop);
});