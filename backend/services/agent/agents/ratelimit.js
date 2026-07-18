import redis from "../../../shared/redis/redis.js"

const Limits = {
    chat:10,
    coading:5,
    pdf:5,
    imageAnalyzer:3,
    ppt:5,
    search:5    
} 

 const checkAgentLimit = async (userId , agent) => {
    const max = Limits[agent] || Limits["chat"]

    const key = `rate_limit:${userId}:${agent}`

    const count = await redis.incr(key)

    if(count == 1){
        await redis.expire(key,60)
    }
    const ttl = await redis.ttl(key)

    if(count > max){
        const minutes = Math.floor(ttl/60)
        const seconds = (ttl % 60)

        const time = minutes>0 ? `${minutes}m : ${seconds}s` : `${seconds}`
        error.status= 429
        error.data = {
            sucess: false,
            agent,
            limit : max,
            remainingTime : ttl,
            retryAfter : time,
            message: `Rate limit exceeded for ${agent} agent. Please try again after ${time}`,
        }

        throw error 
    }

    return {
        limit:max,
        remaining: max-count
    }
} 
export default checkAgentLimit;