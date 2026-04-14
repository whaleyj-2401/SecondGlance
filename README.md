A unified, configurable, and extensible solution for customizing your web experience.
SecondGlance is a browser extension that enables content blocking and detection of AI-generated text within a webpage.

Extension is cross-platform. Tested on Firefox and Chrome.

Senior project of James Whaley, Kelowna Ngoyi, and Andrew Detering.

To build from the source, follow these steps:

1. Clone the repository
2. Assemble the Naive Bayes model (In Linux, navigate to "/extension/ml_serialized" and run "cat naiveBayesNatural.json.part* > naiveBayesNatural.json". In windows, a similar approach could probably be used with the windows terminal)
3. The extension can now be loaded unpacked in Firefox or Chrome

In Firefox, 
1. Navigate to "about:debugging" and click on "this firefox"
2. Click "Load temporary addon"
3. Double click "manifest.json" inside the extension directory

In Chrome,
1. Navigate to "chrome://extensions"
2. Switch on Developer Mode
3. Click "Load unpacked"
4. Navigate to the extension directory

To modify the content scripts, 

1. Install webpack dependencies (Navigate to the "content_scripts_webpack" directory and execute "npm install")
2. Make modifications in the "content_scripts_webpack/content_scripts_raw" directory
3. Compile using webpack (in a terminal/command prompt, execute "npx webpack")
4. Copy the file "content_scripts_webpack/dist/contentScriptBundle.js" into the "extension/scripts" directory

To train a new Naive Bayes,

1. Install dependencies for the machine_learning/node_ml project
2. Download the datasets from the links below
3. Place the .csv files of the datasets in the machine_learning directory
4. Run the Jupyter Notebook "consolidate_data.ipynb"
5. Place the "generated_text.csv" file in the "machine_learning/node_ml" directory
6. Run "main_natural.js" in Node (navigate to node_ml and run "node main_natural.js")

NOTE: Scikit.js has bad import statements on a fresh install. I'm not sure how to resolve it simply, I just went through the dist directory and changed the imports manually. Some of them don't have the ".js" extension.

Machine learning model is trained on the following data:
1. https://www.kaggle.com/datasets/thedrcat/daigt-v2-train-dataset
2. https://www.kaggle.com/datasets/denvermagtibay/ai-generated-essays-dataset
