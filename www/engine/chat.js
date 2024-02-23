class Chat_MessageManager{
    Messages = [];

    constructor(){
        console.log(Config.chat);
        
        const box = document.createElement("div");
        Object.assign(box.style, Config.chat.MessageArea);
        box.style.position = "absolute";
        box.style.background = "#FF0000";
        
        document.getElementById("canvas").insertAdjacentElement(Config.chat.BeforeCanvas?"beforebegin":"afterend", box);
    }

    onBodyReady(){
    }

    onMessage(data){        
        const find = Config.Bots?.find( val => val.toLowerCase() == data.DisplayName.toLowerCase());
        if(typeof find === "undefined"){
            const msg = new Chat_Message(data);
            this.Messages.push(msg);
        }
    }

}

class Chat_Message{
    message;
    emotes;
    badges;
    display;
    color;

    #element;

    constructor(msgDataObj){
        this.message = msgDataObj.Message;
        this.emotes = msgDataObj.Emotes;
        this.display = msgDataObj.DisplayName;
        this.color = msgDataObj.NameColor;
        this.badges = msgDataObj.Badges;
    }

    CreateElement(){
        const elm = document.createElement("div");
        const user = document.createElement("div");
        
        for(let i in this.badges) {
            const badge = this.badges[i];
            const img = new Image(badge.imageUrl);
            img.style.width = Config.chat.ChatBoxes.BadgeSettings.width;
            img.style.height = Config.chat.ChatBoxes.BadgeSettings.height;
            img.style.display = "inline-block";
            user.appendChild(img);
        }

        const displayName = document.createElement("span");
        displayName.style.color = this.color;
        displayName.innerText = this.display;

        const msg = document.createElement("div");
        let render = this.message;

        for(let i in this.emotes){
            const emote = this.emotes[i];
            const reg = new RegExp(emote.name, "gm");
            this.message = this.message.replace(reg, emote.ImageUrl);
        }

        this.#element = elm;
        return elm;
    }
}

const chat_MessageHandler = new Chat_MessageManager();

window.Modules.push({
    name: "chat",
    draw: () => { 

    },
    update: (dt) => {
        
    },
    message: (data) => {
        chat_MessageHandler.onMessage(data);
    }
})