let lastFrameTime = Date.now();
let currentFrameTime = Date.now();
window.onresize = () => {
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;
};

const loadJS = (src, cb) => {
    const srpt = document.createElement("script");
    srpt.setAttribute("src", src);
    srpt.setAttribute("type", "text/javascript");
    if(cb){
        srpt.addEventListener("load", cb);
    }
    document.head.appendChild(srpt);
}

loadJS("./lib/minmax.js");
loadJS("./lib/showerror.js", () => loadJS("./lib/wsclient.js"));

const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

window.Modules = [];

document.addEventListener("DOMContentLoaded", () => {

    Config.Modules.forEach( name => loadJS("/engine/"+name+".js"));
    
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;

    function primaryLoop() {
        currentFrameTime = Date.now();
        const ctx = document.getElementById("canvas").getContext("2d");
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        deltaTime = (currentFrameTime - lastFrameTime) / 1000;
        window.Modules.forEach(module => { 
            module.update(deltaTime); 
            module.draw(ctx);  
        });
        lastFrameTime = currentFrameTime;
        window.requestAnimationFrame(primaryLoop);
    };

    window.requestAnimationFrame(primaryLoop);
});