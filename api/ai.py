from sentence_transformers import SentenceTransformer
import faiss
import pickle
import numpy as np
from dotenv import load_dotenv
import os
import google.generativeai as genai

file_path = os.path.join(os.path.dirname(__file__), "all_chunks.pkl")
index_file = os.path.join(os.path.dirname(__file__), "faiss_index.bin")
with open(file_path, "rb") as f:
    all_chunks = pickle.load(f)

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2", device="mps")
index = faiss.read_index(index_file)

load_dotenv()
genai.configure(api_key=os.getenv("GENAI_API_KEY"))
generative_model = genai.GenerativeModel("gemini-2.0-flash")

context_window = {}

def search_faiss(query, top_k=10, distance_threshold=0.4):
    query_embedding = model.encode([query], convert_to_numpy=True)
    distances, indices = index.search(query_embedding, top_k)
    results = [
        all_chunks[idx] 
        for idx, dist in zip(indices[0], distances[0]) 
        if idx < len(all_chunks) and dist < distance_threshold
    ]
    return results if results else ["No relevant information found."]

def generate_answer(query, language, thread_id):
    if thread_id not in context_window:
        context_window[thread_id] = []
    
    retrieved_chunks = search_faiss(query)
    context = "\n".join(retrieved_chunks)
    prompt = f"""
You are an AI assistant that uses textbook content to answer student queries with {language} books.
Given the query and context below, generate a relevant answer based on the context, if the answer is not in the context, you can generate the answer based on the context but don't mention that it's not in context and don't say sorry.
Make it simple and easy to understand and learn, if it's an English name like a theory name then maintain English but if there is a {language} meaning for it then explain in {language}.
Don't literally translate to {language}, say it in {language} meaning instead of literal English to {language}. You can give summarization about it and talk about stuff that's around the topic that was asked.
I'm studying in {language} medium so please make it easy to understand and learn and also if it has a complex English word then mention the English part in side with parenthesis). Use proper {language} words and translation.

If I ask something that's way off topic then just say that has nothing to do with the topic.
Also maintain a human like conversation instead of strict language way. dont sound cringe but keep it friendly and chill.

Previous Messages: {context_window[thread_id]}

Context:
{context}

Question: {query}
Answer:"""
    response = generative_model.generate_content(prompt)
    context_window[thread_id].append(f"Student: {query}\nTeacher: {response.text.strip()}")
    return response.text.strip()