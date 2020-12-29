import redis, { RedisClient } from "redis";

export class BenchMarker
{
    private client: RedisClient
    constructor()
    {
        this.client = redis.createClient();
        this.client.on("error", function(error) {
            console.error(error);
        });
    }

    /**
     * @typedef {Object} BusInfo
     * @param {string} id
     * @param {number} passagers
     * @param {number} threshold
     *
     * @param BusInfo info
     * @memberof BenchMarker
     */
    public thresholdReached(info: {id: string, passagers: number, threshold: number}) 
    {
        if(info.passagers > info.threshold)
        {
            if(this.client.exists(`limit:${info.id}`))
                this.client.incr(`limit:${info.id}`);
            else
                this.client.set(`limit:${info.id}`, "1");
            
            this.client.get(`limit:${info.id}`, redis.print);
        }
        return this;
    }
}

