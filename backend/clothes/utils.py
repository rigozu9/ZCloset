import cv2
import numpy as np
from sklearn.cluster import KMeans
from collections import Counter
import webcolors
from rembg import remove
from PIL import Image
import io
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "clothing_detection_model")
model = AutoModelForImageClassification.from_pretrained(MODEL_PATH)
processor = AutoImageProcessor.from_pretrained(MODEL_PATH)

# Laajennettu CSS3-värilista
CSS3_NAMES = {
    'black': '#000000',
    'white': '#ffffff',
    'red': '#ff0000',
    'blue': '#0000ff',
    'green': '#008000',
    'yellow': '#ffff00',
    'orange': '#ffa500',
    'pink': '#ffc0cb',
    'purple': '#800080',
    'brown': '#a52a2a',
    'gray': '#808080',
    'lightblue': '#add8e6',
    'darkblue': '#00008b',
    'darkred': '#8b0000',
    'beige': '#f5f5dc',
    'cyan': '#00ffff',
    'magenta': '#ff00ff',
    'lime': '#00ff00',
    'navy': '#000080',
    'teal': '#008080',
    'maroon': '#800000',
    'olive': '#808000',
    'silver': '#c0c0c0',
    'gold': '#ffd700',
    'salmon': '#fa8072',
    'indigo': '#4b0082',
    'violet': '#ee82ee',
    'coral': '#ff7f50',
    'khaki': '#f0e68c',
    'lavender': '#e6e6fa',
    'chocolate': '#d2691e',
    'army green': '#4b5320',
    'sage': '#9caf88',
}

def closest_css_color(rgb):
    def rgb_distance(c1, c2):
        return sum((int(a) - int(b)) ** 2 for a, b in zip(c1, c2))

    min_dist = float('inf')
    closest_name = None

    for name, hex_value in CSS3_NAMES.items():
        try:
            rgb_value = webcolors.hex_to_rgb(hex_value)
        except ValueError:
            continue
        dist = rgb_distance(rgb, rgb_value)
        if dist < min_dist:
            min_dist = dist
            closest_name = name

    return closest_name

def get_dominant_color(image_path, k=3, save_cropped=True, show=False):
    with open(image_path, 'rb') as f:
        input_image = f.read()
    output = remove(input_image)

    image = Image.open(io.BytesIO(output)).convert('RGB')
    np_image = np.array(image)

    if save_cropped:
        save_and_show_cropped_image(np_image, save_path="cropped_output.png", show=show)

    pixels = np_image.reshape((-1, 3))
    pixels = pixels[~np.all(pixels == [0, 0, 0], axis=1)]

    pixels_lab = cv2.cvtColor(pixels.reshape(-1, 1, 3).astype(np.uint8), cv2.COLOR_RGB2LAB).reshape(-1, 3)

    kmeans = KMeans(n_clusters=k, n_init='auto')
    kmeans.fit(pixels_lab)
    counts = Counter(kmeans.labels_)

    sorted_clusters = counts.most_common()

    top_colors_rgb = []
    for idx, _ in sorted_clusters:
        lab = kmeans.cluster_centers_[idx].astype(np.uint8).reshape(1, 1, 3)
        rgb = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)[0][0]
        top_colors_rgb.append(tuple(rgb))

    return closest_css_color(top_colors_rgb[0])

def detect_clothing_category(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()
    return model.config.id2label[predicted_class_idx]

def save_and_show_cropped_image(np_image, save_path="cropped_output.png", show=True):
    pil_image = Image.fromarray(np_image)
    pil_image.save(save_path)
