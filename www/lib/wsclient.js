const client = new StreamerbotClient({
    host: '127.0.0.1',
    port: 8080,
    endpoint: '/',
    subscribe: {
      "General": ["Custom"]
    },
    onData: (resp) => {
        try{
            let module = window.Modules.find( item => item.name.toLowerCase() == resp.data.Module.toLowerCase())
            if(typeof module !== "undefined" && typeof module.message === "function"){
                try{
                    module.message(resp.data.Data);
                }catch(err){ new ShowError(e, true); }
            }
        }catch(e){ }
    }
});