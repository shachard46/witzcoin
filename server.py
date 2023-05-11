from fastapi import FastAPI

app = FastAPI()


@app.get('/')
async def nothing():
    return 'fish'

