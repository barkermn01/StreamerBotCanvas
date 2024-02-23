const Config  = {
    // modules are render in order of top to bottom
    Modules:[
        "emote",
        "chat"
    ],
    Bots:[
        "RPGCommunityBot",
        "StreamElements",
        "StreamLabs",
        "Nightbot"
    ],
    emote:{
        // constant number as a fixed or MinMax Object for random in range
        AnimationTime:{
            Min:10,
            Max:20
        },
        Speed:{
            Min:100,
            Max:300
        },
        RandomDirectionsFromStart:true
    },
    chat:{
        BeforeCanvas:true,
        hideBots:true,
        MessageArea:{
            top:"0px",
            right:"0px",
            bottom:"0px",
            width:"300px"
        },
        ChatBoxes:{
            ShowBadges:true,
            BadgeSettings:{
                width:24,
                height:24
            },
            HideSpecificBadges:[],
            ShowEmotes:true,
            FadeOut:0 ,// don't fade out
            NewMessages:"below", // or above

            class:"twitch-msg"
        }
    }
}