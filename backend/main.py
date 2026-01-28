from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import uvicorn
import os

app = FastAPI()

# Data Model
class ChatRequest(BaseModel):
    message: str

# Dummy Expert Logic
SYSTEM_PROMPT = """
당신은 세계 최고의 빈티지 시계 수리 전문가입니다. 
1960~80년대 기계식 시계(롤렉스, 오메가 등)에 대해 깊은 지식을 가지고 있습니다.
사용자의 질문에 짧고 전문적으로 답변하세요.
"""

@app.post("/chat")
async def chat(request: ChatRequest):
    # Here we will hook up the real LLM later.
    # For now, return a dummy expert response.
    user_msg = request.message
    
    fake_response = f"네, '{user_msg}'에 대한 전문가의 의견입니다. 1960년대 모델의 경우 부품 수급이 가장 중요합니다. 오버홀 주기는 보통 3~5년을 권장합니다."
    
    return {"reply": fake_response}

# Serve Static Files (Frontend)
# We serve the current directory for simplicity in this MVP structure
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
