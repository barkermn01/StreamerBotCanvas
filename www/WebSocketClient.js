const client = new StreamerbotClient({
    host: '127.0.0.1',
    port: 8080,
    endpoint: '/',
    subscribe: {
      "General": ["Custom"]
    },
    onData: (data) => {
        try{
            window.emotes.push(new Emote(data.data.imageUrl));
        }catch(e){}
    }
});