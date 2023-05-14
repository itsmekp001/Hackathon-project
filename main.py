from flask import Flask, request, render_template,jsonify
from io import BytesIO
from pdfquery import PDFQuery
import spacy
import os
from langchain.llms import OpenAI
from langchain import PromptTemplate
import openai

openai.api_key = "#####################################"

os.environ["OPENAI_API_KEY"] = "######################################3"
current_topic = None
app = Flask(__name__)
topic = None
@app.route('/', methods=['GET', 'POST'])

def index():
    if request.method == 'POST':
        data_type = request.form.get('data_type')

        if data_type == "text":
            topic = request.form['text']
            mapp_data = get_concepts(topic)
            return render_template('/home.html', data= mapp_data)

        if data_type == "file":
            file = request.files['file']
            file_type = file.content_type
            if file_type == 'application/pdf':
                fetch_pdf_data(file)
            elif file_type == 'application/msword':
                print("text")
            else:
                print("Unsupported file type")

    return render_template('index.html')

def fetch_pdf_data(file):
    # Read the contents of the file into a BytesIO object
    file_contents = BytesIO(file.read())

    # Use PDFQuery to extract text using CSS-like selectors
    pdf = PDFQuery(file_contents)
    pdf.load()
    text_elements = pdf.pq('LTTextLineHorizontal')
    text = [t.text for t in text_elements]
    process_topic(text)

def process_topic(data):
    # Load a pre-trained English language model
    nlp = spacy.load("en_core_web_sm")

    # Define the paragraph to analyze
    paragraph = str(data)

    # Process the paragraph with spaCy
    doc = nlp(paragraph)

    # Get the main topic by finding the most frequent noun phrase
    noun_phrases = [chunk.text for chunk in doc.noun_chunks]
    main_topic = max(set(noun_phrases), key=noun_phrases.count)
    get_concepts(main_topic)

def get_concepts(text): 
    llm = OpenAI(temperature=0.9,verbose=True,model_name="text-davinci-002")
    text = f"Give me five concepts in {text} with description link concepts : description"
    response = llm(text)
    print(f"first {response}")
    return map_data(llm(text))

def map_data(content):

    lines = content.split("\n")

    # Remove empty lines
    lines = [line.strip() for line in lines if line.strip() != ""]

    # Initialize an empty dictionary to store title and description pairs
    title_description_map = {}

    data =[]
    # Iterate through the lines and extract the title and description
    for line in lines:
        parts = line.split(":")
        if len(parts) == 2:
            title = parts[0].strip()
            description = parts[1].strip()
            title_description_map[title] = description
            mapping = {'title': title, 'description': description}
            data.append(mapping)
    # print(f"Converted Data {data}")
    return data
    
@app.route('/send_data', methods=['POST'])
def slected_concept():
    data = request.get_json()  # Retrieve the data sent as JSON
    h1_content = data['title']  # Get the value of h1Content
    # Process the data or perform any required actions
    key = get_key(h1_content)
    # print(f"The keys {key}")
    return key

def get_key(concept):
    llm = OpenAI(temperature=0.9,verbose=True,model_name="text-davinci-002")
    text = f"Give me five conceptual key terms of {concept} with discription for {topic} topic"

    response = llm(text)
    print(f"Key response {response}")
    return map_data(response)

@app.route('/get_videos', methods=['POST'])
def get_youtube_videos():
    data = request.get_json()  # Retrieve the data sent as JSON
    concept = data['title']  # Get the value of h1Content
    from langchain.tools import YouTubeSearchTool
    tool = YouTubeSearchTool()
    data = tool.run(f"Tutorial about {concept},5")
    # print(f"youtube {data}")
    return jsonify(data)

@app.route('/get_applications', methods=['POST'])
def get_applications():
    data = request.get_json()  # Retrieve the data sent as JSON
    concept = data['title']  # Get the value of h1Content
    llm = OpenAI(temperature=0.9,verbose=True,model_name="text-davinci-002")
    text = f"Give me five projects in {concept} title with discription"
    response = llm(text)
    print(f"Applications response :  {response}")
    return map_data(response)
   
@app.route('/get_problems', methods=['POST'])

@app.route('/get_questions', methods=['POST'])
def generate_mcq():
    data = request.get_json()  # Retrieve the data sent as JSON
    concept = data['title']  # Get the value of h1Content
    llm = OpenAI(temperature=0.9,verbose=True,model_name="text-davinci-002")
    text = f"Give me five questions about {concept}"
    response = llm(text)
    print(f"Questions response :  {response}")
    return jsonify(response)

def get_data(key_word):
    from langchain.document_loaders import PyPDFDirectoryLoader
    import os
    from langchain.embeddings.openai import OpenAIEmbeddings
    from langchain.chains.question_answering import load_qa_chain
    from langchain.vectorstores import Chroma 

    loader = PyPDFDirectoryLoader("source/")
    source_docs = loader.load_and_split()

    embeddings = OpenAIEmbeddings()
    db = Chroma.from_documents(source_docs, embeddings)
    query = "human digestion"
    docs = db.similarity_search(query)


if __name__ == '__main__':
    app.run(debug=True)
