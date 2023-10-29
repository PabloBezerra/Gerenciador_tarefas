"use strict"

// Seleção
const body = document.querySelector('body')
const main = document.querySelector('main')
const campo = document.querySelector('.campo')
const input = document.querySelector('#input')
let contador = 0

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
        atualizar()
    }
})
function addTarefa(){
    let tarefa = document.createElement('div')
    tarefa.className ='tarefa'
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
    console.log('Adicionado')
}

// Marcando e removendo as tarefas
function atualizar(){
    const listaTarefa = campo.querySelectorAll('.tarefa')
    listaTarefa.forEach(elemento =>{
        elemento.querySelector('.check').onclick = ()=>{
            if(elemento.classList.contains('concluido')){
                elemento.classList.remove('concluido')
                addCont(false)
            }else{
                elemento.classList.toggle('concluido')
                addCont()
            }
        }
        elemento.querySelector('.remove').onclick = ()=>{elemento.remove()}
    })
}

function addCont(add=true){
    if(add){
        contador++
    }else{
        contador--
    }
    document.querySelector('.info').innerHTML = `${contador} tarefas concluídas`
}

// Aplicando filtros e limpando
function clean(){
    const limpeza = campo.querySelectorAll('.concluido')
    limpeza.forEach(elemento => { elemento.remove() })
}

function filtro(num){
    const todasTarefas = campo.querySelectorAll('.tarefa')
    switch(num){
        case 1:
            todasTarefas.forEach(elemento =>{
                elemento.style.display = 'flex'
                console.log(elemento.classList)
            })
            break
        case 2:
            todasTarefas.forEach(elemento =>{
                if(elemento.classList.contains('concluido')){
                    elemento.style.display = 'none'
                    console.log(elemento.classList)
                }else{
                    elemento.style.display = 'flex'
                }
            })
            break
        case 3:
            todasTarefas.forEach(elemento =>{
                if(elemento.classList.contains('concluido')){
                    elemento.style.display = 'flex'
                    console.log(elemento.classList)
                }else{
                    elemento.style.display = 'none'
                }
            })
            break
    }
}

// Arrastando e soltando

campo.querySelectorAll('.tarefa').forEach(elemento =>{
    elemento.addEventListener('dragstart', ()=>{
        elemento.classList.add('dragging')
    })
    elemento.addEventListener('dragend', ()=>{
        elemento.classList.remove('dragging')
    })
})



