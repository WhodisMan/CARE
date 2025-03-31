import torch
import torch.nn as nn
from torchvision import models, transforms, datasets
from torch.utils.data import DataLoader
import shap
import matplotlib.pyplot as plt
from PIL import Image
from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/shap-image")
def get_shap_image():
    
    # Check for CUDA
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using {device}")

    # Data transformations (same as training)
    data_transforms = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
    ])

    # Load dataset for background (only need one batch)
    dataset = datasets.ImageFolder('./data', transform=data_transforms)
    dataloader = DataLoader(dataset, batch_size=10, shuffle=True)
    class_names = dataset.classes

    # Load model (simplified)
    model = models.vgg16_bn(pretrained=False)
    model.classifier[-1] = nn.Linear(model.classifier[-1].in_features, len(class_names))
    model.load_state_dict(torch.load("models/vgg16final.pt", map_location=device))
    model = model.to(device).eval()

    # Fix in-place ReLU for SHAP
    for module in model.modules():
        if isinstance(module, nn.ReLU):
            module.inplace = False

    # Get background and input
    background, _ = next(iter(dataloader))
    background = background.to(device)

    input_image = Image.open('temp_image.jpg').convert('RGB')
    temp_input = data_transforms(input_image).unsqueeze(0).to(device)

    # SHAP explanation
    explainer = shap.DeepExplainer(model, background)
    shap_values = explainer.shap_values(temp_input)

    # Process SHAP values
    shap_values = shap_values.transpose(4, 1, 2, 3, 0)
    shap_values_processed = []
    for s in shap_values:
        reshaped = s.transpose(3, 1, 2, 0)  # Correct the transposition: (channels, height, width, samples)
        shap_values_processed.append(reshaped)

    test_images_vis = temp_input.cpu().numpy().transpose(0, 2, 3, 1)

    # Plot and save
    shap.image_plot(shap_values_processed, test_images_vis, class_names, show=False)
    plt.savefig('shap.png')
    return FileResponse("shap.png")
