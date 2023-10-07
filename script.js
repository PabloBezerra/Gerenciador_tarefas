const body = document.querySelector('body')
const main = document.querySelector('main')
const campo = document.querySelector('.campo')

//Mudando o tema
function theme(){
    body.classList.toggle('light') 
    main.classList.toggle('light')
}

//Adição e criação da tarefa
function addButton(){
    if(input.value.length >= 3){
        add.style.transform = 'scale(1)'
    }else{
        add.style.transform = 'scale(0)'
    }
}
input.addEventListener('keydown', (event)=>{
    if(input.value.length >= 3 && event.key === 'Enter'){
        event.preventDefault()
        addTarefa()
    }
})
function addTarefa(){
    let tarefa = document.createElement('div')
    tarefa.className ='tarefa'
    tarefa.id = 'tarefa'
    tarefa.draggable = true
    tarefa.innerHTML = `
    <div class="check">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFFFFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
    </div>
    <p class="descrição">${input.value}</p>
    <div class="remove">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
    </div>
    `
    campo.appendChild(tarefa)
    input.value = ''
    input.focus()
    addButton()
}

let tarefas = campo.querySelectorAll('.tarefa')
tarefas.forEach((element)=>{
    let check = element.querySelector('.check')
    let remove = element.querySelector('.remove')
    check.addEventListener('click',()=>{
        console.log('check')
        element.classList.toggle('concluido')
    })
    remove.addEventListener('click',()=>{
        campo.removeChild(element)
        console.log('remove')
    })

})
