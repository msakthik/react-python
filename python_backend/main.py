from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class User(BaseModel):
    name: str
    age: int


@app.get("/")
def home():
    return {"message": "Python API running"}


@app.post("/user")
def create_user(user: User):
    return {"message": f"Hello {user.name}", "age_after_5_years": user.age + 5}
