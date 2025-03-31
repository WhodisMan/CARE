import torch
import torch.nn as nn
from torchvision import models, transforms
from torch.utils.data import DataLoader, Subset
import shap
import matplotlib.pyplot as plt

# Config
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = "vgg16final.pt"
DATA_DIR = './data'
BG_SIZE = 2  # Reduced background samples for faster computation
IMG_SIZE = 224

# Simplified transforms
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(IMG_SIZE),
    transforms.ToTensor(),
])

# Model loader
def load_model(num_classes):
    model = models.vgg16_bn(pretrained=False)
    
    # Freeze features and modify classifier
    for param in model.features.parameters():
        param.requires_grad = False
    num_features = model.classifier[6].in_features
    model.classifier = nn.Sequential(*list(model.classifier.children())[:-1], 
                                   nn.Linear(num_features, num_classes))
    
    # Load weights and disable inplace ReLU for SHAP compatibility
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    for module in model.modules():
        if isinstance(module, nn.ReLU):
            module.inplace = False
    
    return model.to(DEVICE).eval()

# Data sampler
def get_sample(dataset, n=4):
    indices = torch.randperm(len(dataset))[:n]
    return Subset(dataset, indices)

# Main execution
if __name__ == "__main__":
    # Load minimal dataset
    dataset = torchvision.datasets.ImageFolder(DATA_DIR, transform=transform)
    bg_subset = get_sample(dataset, BG_SIZE)
    bg_loader = DataLoader(bg_subset, batch_size=BG_SIZE)
    background, _ = next(iter(bg_loader))
    
    # Prepare model and explainer
    model = load_model(len(dataset.classes))
    explainer = shap.DeepExplainer(model, background.to(DEVICE))
    
    # Process single test image
    test_image, label = next(iter(DataLoader(get_sample(dataset, 1), batch_size=1)))
    shap_values = explainer.shap_values(test_image.to(DEVICE))
    
    # Visualization
    shap.image_plot(
        [sv.transpose(0, 2, 3, 1) for sv in shap_values],  # Direct shape adjustment
        test_image.numpy().transpose(0, 2, 3, 1),
        true_labels=[dataset.classes[label.item()]],
        labels=dataset.classes,
        show=False
    )
    plt.savefig('shap_output.png', bbox_inches='tight')
    plt.close()