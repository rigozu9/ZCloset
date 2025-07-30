import cv2
import numpy as np
from sklearn.cluster import KMeans
from collections import Counter
import webcolors
from rembg import remove
from PIL import Image
import io
import matplotlib.pyplot as plt
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
    'chocolate': '#d2691e'
}

def closest_css_color(rgb):
    def rgb_distance(c1, c2):
        return sum((a - b) ** 2 for a, b in zip(c1, c2))

    min_dist = float('inf')
    closest_name = None

    for name, hex_value in CSS3_NAMES.items():
        rgb_value = webcolors.hex_to_rgb(hex_value)
        dist = rgb_distance(rgb, rgb_value)
        if dist < min_dist:
            min_dist = dist
            closest_name = name

    return closest_name

def get_dominant_color(image_path, k=3, save_cropped=True, show=False):
    # Poista tausta
    with open(image_path, 'rb') as f:
        input_image = f.read()
    output = remove(input_image)

    # Lue PIL-kuva ja muunna numpy-taulukoksi
    image = Image.open(io.BytesIO(output)).convert('RGB')
    np_image = np.array(image)

    # 💾 Tallenna aina croppattu kuva
    if save_cropped:
        save_and_show_cropped_image(np_image, save_path="cropped_output.png", show=show)

    # Väriklusterointi
    pixels = np_image.reshape((-1, 3))
    pixels = pixels[~np.all(pixels == [0, 0, 0], axis=1)]  # Poista mustat pikselit

    kmeans = KMeans(n_clusters=k, n_init='auto')
    kmeans.fit(pixels)

    counts = Counter(kmeans.labels_)
    dominant = kmeans.cluster_centers_[counts.most_common(1)[0][0]]
    return tuple(map(int, dominant))

def detect_clothing_category(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()
    return model.config.id2label[predicted_class_idx]

def save_and_show_cropped_image(np_image, save_path="cropped_output.png", show=True):
    """
    Tallentaa numpy-muotoisen kuvan tiedostoksi ja näyttää sen tarvittaessa.
    
    Args:
        np_image (np.ndarray): Kuva numpy-muodossa
        save_path (str): Polku tallennettavalle tiedostolle
        show (bool): Näytetäänkö kuva matplotlibilla
    """
    # Muunna numpy -> PIL ja tallenna
    pil_image = Image.fromarray(np_image)
    pil_image.save(save_path)
