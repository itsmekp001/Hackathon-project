import base64
import os
import requests
engine_id = "stable-diffusion-v1-5"
api_host = os.getenv("API_HOST", "https://api.stability.ai")
api_key = "sk-o0tiNMbla4dFdhGZacv4DKETi8NHOwJ6VXb06d1mnDAMn683"
if api_key is None:
    raise Exception("Missing Stability API key.")
response = requests.post(
    f"{api_host}/v1/generation/{engine_id}/image-to-image",
    headers={
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}"
    },
    files={
        "init_image": open("resized_image.png", "rb")
    },
    data={
        "image_strength": 0.35,
        "init_image_mode": "IMAGE_STRENGTH",
        "text_prompts[0][text]": "A colorfull house with wings",
        "cfg_scale": 7,
        "clip_guidance_preset": "FAST_BLUE",
        "samples": 1,
        "steps": 30,
    }
)
if response.status_code != 200:
    raise Exception("Non-200 response: " + str(response.text))
data = response.json()
for i, image in enumerate(data["artifacts"]):
    with open(f"v1_img2img_{i}.png", "wb") as f:
        f.write(base64.b64decode(image["base64"]))