export const publishSubscribe = {
    events : {
    },
    // subscribe function
    subscribe : function(event, fn){
        // console.log( ` Stranger subscribed to event ${event}`)
        this.events[event] = this.events[event] || []
        this.events[event].push(fn)
    },
    // unsubscribe function
    unsubscribe : function(event, fn){
        // console.log( ` Stranger unsubscribed to event ${event}`)
        if(this.events[event]){
            this.events[event] = this.events[event].filter(func => func.toString() !== fn.toString())
        }
    },
    // publish function
    publish : function(event, data){
        // console.log( ` Stranger broadcasted data to event ${event}`)
        if(this.events[event]){
            this.events[event].forEach(fn => {
                fn(data)
            });
        }
    }
}

