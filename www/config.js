const Config  = {
    // modules are render in order of top to bottom
    Modules:[
        "emote",
        "chat"
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
        MessageArea:{
            top:0,
            left:0,
            right:0,
            bottom:0,
            // if 0 will be full width unless fixed information provided to the message area
            width:0, 
            height:0
        }
    }
}