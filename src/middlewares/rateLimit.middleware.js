import redis from "../config/redis.js";

const DAILY_LIMIT = 5;
const ONE_DAY = 60 * 60 * 24;

export async function rateLimiter(req, res, next) {
    try {
        const userId = req.user?._id;

        const key = `rate-limit:${userId}`;
        // console.log("KEY: ", key)

        const count = await redis.incr(key);
        // console.log("COUNT: ", count)

        if (count === 1) {
            await redis.expire(key, ONE_DAY);
        }

        if (count > DAILY_LIMIT) {
            const retryAfter = await redis.ttl(key);

            return res.status(429).json({
                status: "error",
                message: "Daily request limit reached.",
                retryAfter,
            });
        }

        next();
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Rate limiter failed",
        });
    }
}