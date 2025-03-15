from fastapi import FastAPI
from app.core.config import settings
from app.middleware.security import setup_middleware
from app.core.limiter import setup_limiter
from app.routes import auth, users, relationships, blog, chat
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

@app.on_event("startup")
async def startup_event():
    await setup_limiter(app)
    Instrumentator().instrument(app).expose(app)

setup_middleware(app)

# Include routers with versioning
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(relationships.router, prefix=f"{settings.API_V1_STR}/relationships", tags=["Relationships"])
app.include_router(blog.router, prefix=f"{settings.API_V1_STR}/blog", tags=["Blog"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["Chat"])

@app.get("/")
async def root():
    return {
        "app_name": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": f"{settings.API_V1_STR}/docs"
    } 