from PIL import Image

image_path = 'test1.png'
original_image = Image.open(image_path)
resized_image = original_image.resize((448, 832))

output_path = 'resized_image.png'
resized_image.save(output_path)

print("Resized image saved successfully.")