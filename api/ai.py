from sentence_transformers import SentenceTransformer
import faiss
import pickle
import numpy as np
from dotenv import load_dotenv
import os
import google.generativeai as genai

with open("all_chunks.pkl", "rb") as f:
    all_chunks = pickle.load(f)

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
index = faiss.read_index("faiss_index.bin")

load_dotenv()
genai.configure(api_key=os.getenv("GENAI_API_KEY"))
generative_model = genai.GenerativeModel("gemini-2.0-flash")

def search_faiss(query, top_k=5, distance_threshold=0.5):
    query_embedding = model.encode([query], convert_to_numpy=True)
    distances, indices = index.search(query_embedding, top_k)
    results = [
        all_chunks[idx] 
        for idx, dist in zip(indices[0], distances[0]) 
        if idx < len(all_chunks) and dist < distance_threshold
    ]
    return results if results else ["No relevant information found."]

def generate_answer(query):
    retrieved_chunks = search_faiss(query)
    context = "\n".join(retrieved_chunks)
    prompt = f"""
You are an tamil AI assistant that uses textbook content to answer student queries with tamil books.
Given the query and context below, generate a relevant answer based on the context, if the answer is not in the context, you can generate the answer based on the context but dont mention that its not in context and dont say sorry.
Make it simple and easy to understand and learn, if its a english name like a theory name then maintain english but if there is a tamil meaning for it then explain in tamil.
Dont literally translate to tamil, say it in tamil meaning instead of literal english to tamil. You can give summarization about it and talk about stuff thats around the topic that was asked.
Im studying in tamil medium so please make it easy to understand and learn and also if it has a complex english word then mention the english part in side with paranthesis. Use proper tamil words and translation

If i ask something thats wayyy off topic then just say that has nothing to do with the topic.

Context:
{context}

Question: {query}
Answer:"""
    response = generative_model.generate_content(prompt)
    return response.text.strip()