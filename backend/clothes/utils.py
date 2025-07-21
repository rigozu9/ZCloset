import cv2
import numpy as np
from sklearn.cluster import KMeans
from collections import Counter
import webcolors

def get_dominant_color(image_path, k=3):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Kuvaa ei voitu lukea")

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pixels = image.reshape((-1, 3))

    kmeans = KMeans(n_clusters=k, n_init='auto')
    kmeans.fit(pixels)

    counts = Counter(kmeans.labels_)
    dominant = kmeans.cluster_centers_[counts.most_common(1)[0][0]]
    return tuple(map(int, dominant))  # esim. (124, 30, 87)

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