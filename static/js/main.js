function loadPage() {
    var firstCard = document.querySelector('.custom-card');
      if (firstCard) {
        var firstTitle = firstCard.querySelector('.concept-name h1').innerText;
        generate_keys(firstTitle);
        get_videos(firstTitle);
        get_applications(firstTitle);
        get_questions(firstTitle);

      }
  }

  function generate_keys(title) {
    const keyDiv = document.getElementById('key-div');
    keyDiv.innerHTML = ''; // Clear previously loaded data
    fetch('/send_data', {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(responseData => {
        const keyDiv = document.getElementById('key-div');
        const keyTermsDiv = document.createElement('div');
        keyTermsDiv.classList.add('key-terms');
  
        const sectionTitleDiv = document.createElement('div');
        sectionTitleDiv.classList.add('text-left', 'text-white', 'section-title');
        sectionTitleDiv.textContent = 'Key Terms';
  
        const scrollingWrapperDiv = document.createElement('div');
        scrollingWrapperDiv.classList.add('scrolling-wrapper', 'pt-2', 'pb-4');
        for (let i = 0; i < responseData.length; i++) {
            const item = responseData[i];
            const title = item.title;
            const description = item.description;
          const keyItemCardDiv = document.createElement('div');
          keyItemCardDiv.classList.add('card', 'key-item-cards', 'text-nowrap', 'px-3', 'py-2', 'mx-2');
          keyItemCardDiv.setAttribute('data-bs-toggle', 'tooltip');
          keyItemCardDiv.setAttribute('data-bs-placement', 'bottom');
          keyItemCardDiv.setAttribute('title', description);
          keyItemCardDiv.setAttribute('data-bs-trigger', 'click');
          keyItemCardDiv.textContent = title;
          scrollingWrapperDiv.appendChild(keyItemCardDiv);
        }
  
        keyTermsDiv.appendChild(sectionTitleDiv);
        keyTermsDiv.appendChild(scrollingWrapperDiv);
  
        keyDiv.appendChild(keyTermsDiv);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  function changeDescription(description, title) {
    const descriptionElement = document.getElementById('custom-description');
    descriptionElement.textContent = description;
    generate_keys(title);
    get_videos(title);
    get_applications(title);
    get_questions(title);
  }

  function get_videos(title) {
    const scrollingWrapperDiv = document.querySelector('.scrolling-wrapper');
    scrollingWrapperDiv.innerHTML = ''; // Clear previously rendered data
  
    fetch('/get_videos', {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(responseData => {
        // Remove the single quotes from the string
        responseData = responseData.replace(/'/g, '"');
        // Parse the modified string as an array
        let arr = JSON.parse(responseData);
        console.log("The videos ", arr);
  
        for (let i = 0; i < arr.length; i++) {
          const queryString = arr[i];
          const parameterName = 'v';
  
          const startIndex = queryString.indexOf(parameterName + '=') + parameterName.length + 1;
          const endIndex = queryString.indexOf('&', startIndex);
  
          const value = (endIndex !== -1) ? queryString.substring(startIndex, endIndex) : queryString.substring(startIndex);
  
          console.log("The youtube value :", value);
  
          const videoCardDiv = document.createElement('div');
          videoCardDiv.classList.add('card', 'tutorials-cards', 'text-white', 'text-nowrap', 'p-5', 'mx-2');
  
          const iframeElement = document.createElement('iframe');
          iframeElement.setAttribute('width', '200');
          iframeElement.setAttribute('height', '200');
          iframeElement.setAttribute('src', "https://www.youtube.com/embed/" + value);
          iframeElement.setAttribute('frameborder', '0');
          iframeElement.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
          iframeElement.setAttribute('allowfullscreen', '');
  
          videoCardDiv.appendChild(iframeElement);
          scrollingWrapperDiv.appendChild(videoCardDiv);
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }
  
  function get_applications(title) {
    const scrollingWrapperDiv = document.querySelector('.flip-card');
    scrollingWrapperDiv.innerHTML = ''; // Clear previously loaded data
  
    fetch('/get_applications', {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(responseData => {
        for (let i = 0; i < responseData.length; i++) {
          const item = responseData[i];
          const title = item.title;
          const description = item.description;
  
          const flipCardInnerDiv = document.createElement('div');
          flipCardInnerDiv.classList.add('flip-card-inner', 'col-6');
  
          const applicationCardFrontDiv = document.createElement('div');
          applicationCardFrontDiv.classList.add('card', 'application-projects-cards', 'application-project-front', 'align-self-center', 'text-white', 'text-wrap', 'py-5', 'text-center');
  
          const cardTitleDiv = document.createElement('div');
          cardTitleDiv.classList.add('card-title', 'd-flex', 'align-items-center', 'justify-content-center', 'h-100');
          cardTitleDiv.textContent = title;
  
          applicationCardFrontDiv.appendChild(cardTitleDiv);
  
          const applicationCardBackDiv = document.createElement('div');
          applicationCardBackDiv.classList.add('card', 'card-body', 'application-project-back', 'bg-white', 'px-0');
  
          const descriptionDiv = document.createElement('div');
          descriptionDiv.classList.add('description', 'text-wrap');
          descriptionDiv.textContent = description;
  
          applicationCardBackDiv.appendChild(descriptionDiv);
  
          const flipCardDiv = document.createElement('div');
          flipCardDiv.classList.add('flip-card');
  
          flipCardDiv.appendChild(applicationCardFrontDiv);
          flipCardDiv.appendChild(applicationCardBackDiv);
  
          flipCardInnerDiv.appendChild(flipCardDiv);
          scrollingWrapperDiv.appendChild(flipCardInnerDiv);
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }
  
  function get_questions(title) {
    const questionsCardsDiv = document.querySelector('.questions-cards');
    questionsCardsDiv.innerHTML = ''; // Clear previously loaded data
  
    fetch('/get_questions', {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(responseData => {
        const arrayOutput = responseData.split('\n');
        const filteredArray = arrayOutput.filter(item => item !== "");
        console.log("The question ", filteredArray);
  
        for (let i = 0; i < filteredArray.length; i++) {
          const item = filteredArray[i];
  
          const questionCardDiv = document.createElement('div');
          questionCardDiv.classList.add('card', 'practical-problem-cards', 'text-white', 'text-wrap', 'px-2', 'py-5', 'text-center');
          questionCardDiv.textContent = item;
  
          questionsCardsDiv.appendChild(questionCardDiv);
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }
  

  function to_uploadfile(){
        fetch('/upload_file')
      .then(response => {
        if (response.ok) {
          // Redirect to the upload_file page if the request is successful
          window.location.href = response.url;
        } else {
          console.error('Error:', response.status);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function to_input_query(){
    fetch('/input_text')
  .then(response => {
    if (response.ok) {
      // Redirect to the upload_file page if the request is successful
      window.location.href = response.url;
    } else {
      console.error('Error:', response.status);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
  
  
  