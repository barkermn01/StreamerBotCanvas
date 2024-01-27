const client = new StreamerbotClient({
    host: '127.0.0.1',
    port: 8080,
    endpoint: '/',
    subscribe: {
      "General": ["Custom"]
    },
    onData: (resp) => {
        try{
            if(resp.data.Module == "emote"){
                window.GameObjects.push(new Emote(resp.data.Data.imageUrl));
            }
        }catch(e){}
    }
});