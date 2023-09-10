import cv2
import torch
from torchvision import transforms
from ultralytics import YOLO
from ultralytics.data.converter import convert_coco
from roboflow import Roboflow
# 載入模型和權重gfvv
model = YOLO('yolov8n.pt')
# results = model.train(data='coco128.yaml', epochs=100, imgsz=640)

convert_coco(labels_dir='path/to/coco/annotations/')

rf = Roboflow(api_key="WhCA0N0WxZZuOxBbinZl")
project = rf.workspace().project("vita")
model = project.version(1).model

# infer on a local image
# print(model.predict("your_image.jpg", confidence=40, overlap=30).json())

# visualize your prediction
# model.predict("your_image.jpg", confidence=40, overlap=30).save("prediction.jpg")

# infer on an image hosted elsewhere
# print(model.predict("URL_OF_YOUR_IMAGE", hosted=True, confidence=40, overlap=30).json())
# 選擇攝影機
cap = cv2.VideoCapture(0)  # 使用第一個攝影機

while True:
    # 讀取攝影機影格
    ret, frame = cap.read()

    # 影格預處理
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Resize((416, 416)),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[
                             0.229, 0.224, 0.225])
    ])
    input_tensor = transform(frame).unsqueeze(0)

    # 使用模型進行預測
    # with torch.no_grad():
    #     output = model(input_tensor)

    # 解析預測結果
    # ...

    # 在影格上繪製偵測結果
    # ...

    # 顯示影格
    cv2.imshow("YOLOv8 Object Detection", frame)

    # 按下 'q' 鍵結束程式
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 釋放攝影機資源
cap.release()
cv2.destroyAllWindows()
