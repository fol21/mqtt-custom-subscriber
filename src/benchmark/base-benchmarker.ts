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
        this.client.get(`last-read:${info.id}`, (err, res) => {
            const last = res ? parseInt(res) : null;
            if(last == null || (last < info.threshold && info.passagers >= info.threshold))
            {
                this.client.incr(`limit:${info.id}`, (err, res) => {
                    this.client.set(`last-read:${info.id}`, info.passagers.toString())       
                });
            } else {
                this.client.set(`last-read:${info.id}`, info.passagers.toString()) 
            }
        });
        return this;
    }
}

