import cv2
import numpy as np
from sklearn.cluster import KMeans
from collections import Counter
import webcolors
from rembg import remove
from PIL import Image
import io


def get_dominant_color(image_path, k=3):
    # Poista tausta
    with open(image_path, 'rb') as f:
        input_image = f.read()
    output = remove(input_image)

    # Lue PIL-kuva ja muunna numpy-taulukoksi
    image = Image.open(io.BytesIO(output)).convert('RGB')
    np_image = np.array(image)
    pixels = np_image.reshape((-1, 3))

    # Poista täysin läpinäkyvät (mustat) pikselit
    pixels = pixels[~np.all(pixels == [0, 0, 0], axis=1)]

    kmeans = KMeans(n_clusters=k, n_init='auto')
    kmeans.fit(pixels)

    counts = Counter(kmeans.labels_)
    dominant = kmeans.cluster_centers_[counts.most_common(1)[0][0]]
    return tuple(map(int, dominant))

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