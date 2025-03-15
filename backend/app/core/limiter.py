from fastapi import FastAPI
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import aioredis
from app.core.config import settings

async def setup_limiter(app: FastAPI) -> None:
    redis = await aioredis.from_url(settings.REDIS_URL)
    await FastAPILimiter.init(redis)

    @app.on_event("shutdown")
    async def shutdown_event():
        await redis.close()

# Rate limit decorator for routes
rate_limit = RateLimiter(times=10, seconds=60)  # 10 requests per minute 