from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.chapter import router as chapter_router
from routers.chat import router as chat_router

app = FastAPI()

app.include_router(
    router=chapter_router,
    tags=["chapter"],
)

app.include_router(
    router=chat_router,
    tags=["chat"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #update the frontend server when deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)