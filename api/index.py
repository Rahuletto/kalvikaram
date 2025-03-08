from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from .ai import generate_answer

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cache_file = "response_cache.json"
try:
    with open(cache_file, "r") as f:
        cache = json.load(f)
except FileNotFoundError:
    cache = {}

# Request model with threadId included
class QueryRequest(BaseModel):
    query: str
    language: str = "english" 
    threadId: str = "default_thread" 

@app.post("/api/py/ask")
def get_answer(request: QueryRequest):
    query = request.query
    language = request.language
    thread_id = request.threadId
    
    cache_key = f"{query}_{language}_{thread_id}"
    
    if cache_key in cache:
        return {"query": query, "answer": cache[cache_key]}

    answer = generate_answer(query, language, thread_id)
    
    cache[cache_key] = answer
    
    with open(cache_file, "w") as f:
        json.dump(cache, f)

    return {"query": query, "answer": answer}
