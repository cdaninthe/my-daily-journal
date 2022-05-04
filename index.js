document.addEventListener('DOMContentLoaded', () => {
    const today = document.querySelector("#today")
    const showNewEntry = document.querySelector("#new-entry-btn")
    const searchPastEntry = document.querySelector("#past-entry-btn")
    const form = document.querySelector("#new-entry")
    const newGratitude = document.getElementById('gratitude')
    const newJournal = document.getElementById('journal')
    const searchForm = document.querySelector("#past-entry")
    const date = document.getElementById('date')
    const content = document.querySelector('#past-entry-content')
    const contentDate = document.querySelector('#past-content-date')
    const contentGratitude = document.querySelector('#past-content-gratitude')
    const contentJournal = document.querySelector('#past-content-journal')
    const close = document.getElementById('close-btn')
    const quote = document.getElementById('quote')
    const author = document.getElementById('author')
    
    const heart = document.querySelector("#like-quote")
    const unlike = 'Like ♡'
    const like = '♥'
    
    fetchQuotes()

    function displayQuote(quoteObj){
        quote.innerText = quoteObj.text
        author.innerText = `-  ${quoteObj.author.toUpperCase()}`
        console.log(quoteObj)
    }

    //click on heart
    heart.addEventListener('click', handleLike);

    // today's date in MM/DD/YYYY format
    function todayDate(){
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today;
    }
    
    today.innerText = todayDate()


    //Show or Hide new journal entry form
    showNewEntry.addEventListener('click', () => {
        if (form.style.display = "none"){
            form.style.display = "block"
            showNewEntry.innerText = "Hide new journal entry form"
        }
        else if (form.style.display = "block"){
            form.style.display = "none"
            showNewEntry.innerText = "Write a new entry in my Journal"
        }
    })

    //Show or Hide past entry search form
    searchPastEntry.addEventListener('click', () => {
        console.log('close window')

        if (searchForm.style.display = "none"){
            searchForm.style.display = "block"
            searchPastEntry.innerText = "Hide past journal entry search form"
        }
        else {
            searchForm.style.display = "none"
            searchPastEntry.innerText = "Look for a past entry in my Journal"
        }
    })


    //Add new journal entry
    form.addEventListener('submit', (event) => {
       event.preventDefault()
       console.log('submit entry')
       let entry = {
            date: todayDate(),
            gratitude: newGratitude.value,
            journal: newJournal.value
        }
        console.log(entry)
        addEntry(entry)

        newGratitude.value =''
        newJournal.value =''
        showNewEntry.innerText = "Write a new entry in my Journal"
        form.style.display = "none"
    })


    //Look for a past journal entry
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault()
        console.log('search date')
        console.log(date.value) 
        content.style.display = "block"

        searchEntries(date.value)
        date.value =''
        searchPastEntry.innerText = "Look for a past entry in my Journal"
        searchForm.style.display = "none"        

    })

   
   //close past entry
    close.addEventListener('click', () => {
        contentDate.innerText = ''
        contentGratitude.innerText = ''
        contentJournal.innerText = ''
        content.style.display = "none"
    })

            

    //handle click on like
    function handleLike(){
        if (heart.innerText === unlike){
            heart.setAttribute('class', 'liked')
            heart.innerText = like
        } 
        else if (heart.innerText === like){
            heart.setAttribute('class', 'unliked')
            heart.innerText = unlike
        }
    }


    //fetch quote
    function fetchQuotes(){
        fetch("https://type.fit/api/quotes")
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            displayQuote(data[Math.floor(Math.random() * data.length)])
        })
    }

    //add new journal entry
    function addEntry(entry){
        //console.log(entry)
        fetch('http://localhost:3000/entries', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                Accept: 'application.json'
            },
            body: JSON.stringify({
                date: entry.date,
                gratitude: entry.gratitude,
                journal: entry.journal
            })
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
        })
    }

    //look for a past entry in database and display
    function searchEntries(date){
        fetch("http://localhost:3000/entries")
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            console.log(date)
            if (data.find(entry => entry.date === date)){
                const page = data.find(entry => entry.date === date)
                console.log(page)
                contentDate.innerText = page.date
                contentGratitude.innerText = page.gratitude
                contentJournal.innerText = page.journal
            }
            else {
                contentDate.innerText = `Sorry, you did not journal on that date 😢`
            }
        })
    }


    

})
