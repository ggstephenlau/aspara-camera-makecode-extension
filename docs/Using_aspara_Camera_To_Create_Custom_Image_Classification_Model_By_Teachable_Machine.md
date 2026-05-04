# Create Your Custom Image Classification Model by aspara Camera and Teachable Machine

This document aims to guide you through using the aspara Camera to create your own custom image classification model by [Techable Machine](https://teachablemachine.withgoogle.com/)

1. Take user photos of the target objects, such as a box and a cup
    * Use the microbit "Take user photo" extension to take photos of the box and the cup. Each objects for around 10 photos.
        * Demo: https://makecode.microbit.org/S91673-02246-61208-06965
    * Or use the "Key 3" on the device to take photos for these objects. Note that this method would have photo name "user_photo_....jpg"

2. Use the "Key 1" on the device to show the device portal URL.<br/>
E.g., it would be `https://192.168.1.75/index.html`

3. Visit this device portal by your computer or iPad, choose the "User Photos"

4. Under "User Photos", select the photos of these 2 objects, and save them to your computer or iPad.

5. Visit teachable machine website, [Techable Machine](https://teachablemachine.withgoogle.com/)

6. Choose "Get started" -> "Image Project" -> "Standard image model"

7. Upload the photos to the seperate classes, such as "box" and "cup"

8. Choose "Train Model"

9. After training, choose "Model trained"

10. Choose "Export Model"

11. Choose "Tensorflow Lite" 

12. Choose "Quantized"

13. Choose "Download my model"

14. Under your computer or iPad download directly, unzip the downloaded "converted_tflite_quantized.zip"

15. There should be 2 files, <b><i>"labels.txt"</i></b> and <b><i>"model.tflite"</i></b>

16. Rename these files to your model name, such as <b><i>"my_2_objects_model"</i></b>

17. Then you should have <b><i>"my_2_objects_model.txt"</i></b> and <b><i>"my_2_objects_model.tflite"</i></b>.<br/>
    <u>Please make sure these 2 files having the same file name.</u>

18. Visit the device portal by your computer or iPad, choose the "User Models"

19. Use the <b><i>"Choose files"</i></b> to select these 2 files, and then press the <b><i>"Upload"</i></b> button.

Then your own model, "my_2_objects_model", would be uploaded to the cloud.
