class ShowError{
    exception;
    #element;

    constructor(err, autoRender = false){
        this.exception = err;
        const elm = document.createElement("div");

        const title = document.createElement("h3");
        title.innerText = "Error";
        title.setAttribute("id", "title");

        const info = document.createElement("p");
        info.innerText = "Oh, it appears something is going wrong this could be configuration or a Module you could try to fix it or disable it the technical information is blow.";
        info.setAttribute("id", "info");

        const details = document.createElement("div");
        details.innerText = `Reported Error is: ${err.message}`
        details.setAttribute("id", "details");

        const pre = document.createElement("pre");
        pre.innerHTML = err.stack.replace("Error:", "");
        pre.setAttribute("id", "error");

        details.appendChild(pre);
        elm.appendChild(title).appendChild(info).appendChild(details);
        elm.setAttribute("id", "errorBox");

        this.#element = elm;
        if(autoRender){
            this.Render();
        }
    }

    Render(){
        document.body.appendChild(this.#element);
    }
}