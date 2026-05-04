# Create Your Custom Image Classification Model by aspara Camera and Google Colab

This document aims to guide you through using the aspara Camera to create your own custom image classification model by [Google Colab](https://colab.research.google.com/)

1. Take user photos of the target objects, such as a box and a cup
    * Use the microbit "Take user photo" extension to take photos of the box and the cup. Each objects for around 10 photos.
        * Demo: https://makecode.microbit.org/S91673-02246-61208-06965
    * Or use the "Key 3" on the device to take photos for these objects. Note that this method would have photo name "user_photo_....jpg"

2. Use the "Key 1" on the device to show the device portal URL.<br/>
E.g., it would be `https://192.168.1.75/index.html`

3. Visit this device portal by your computer or iPad, choose the "User Photos"

4. Under "User Photos", select the photos of these 2 objects, with the Resize (224x224) checkbox checked, and save them to your computer or iPad.

5. Download the [make model example](https://raw.githubusercontent.com/growgreenhk/aspara-microbit-makecode-camera-extension/main/docs/Make_model_by_Google_colab_example.zip)

6. Unzip the example.

7. In "Make_model_by_Google_colab_example/My_Project/dataset/", there are 3 classes with photos.
```
    Make_model_by_Google_colab_example
        └── make_model.py
        └── My_Project
            └── dataset
                ├── Coffee
                ├── Metal Cup
                └── Yellow Cup
```
8. Remove the unwanted classes and photos, and add yours under dataset, such as,
```
    Make_model_by_Google_colab_example
        └── make_model.py
        └── My_Project
            └── dataset
                ├── box
                └── cup
```
9. Zip the My_Project directory to My_Project.zip
```
    Make_model_by_Google_colab_example
        └── make_model.py
        └── My_Project
        │   └── dataset
        │       ├── box
        │       └── cup
        └── My_Project.zip
```

10. Go to colab [https://colab.research.google.com/](https://colab.research.google.com/)

11. New a notebook.

12. Copy and paste the content of make_model.py to the colab "Commands" window.

13. Run it

14. If colab ask for upload, select the My_Project.zip

14. After the script finished, from colab file browser, download the <b><i>labels.txt</i></b> and <b><i>model.tflite</i></b> under My_Project.

16. Rename these files to your model name, such as <b><i>"my_2_objects_model"</i></b>

17. Then you should have <b><i>"my_2_objects_model.txt"</i></b> and <b><i>"my_2_objects_model.tflite"</i></b>.<br/>
    <u>Please make sure these 2 files having the same file name.</u>

18. Visit the device portal by your computer or iPad, choose the "User Models"

19. Use the <b><i>"Choose files"</i></b> to select these 2 files, and then press the <b><i>"Upload"</i></b> button.

Then your own model, "my_2_objects_model", would be uploaded to the cloud.
