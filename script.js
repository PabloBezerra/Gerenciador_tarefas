(function(){
    "use strict"

    // Seleção
    const body = document.querySelector('body')
    const main = document.querySelector('main')
    const campo = document.querySelector('.campo')
    const allTasks = campo.getElementsByClassName('task')
    const input = document.querySelector('#input')
    const tema = document.querySelector('.switch')
    const config = document.querySelector('.config')
    const filt = document.querySelector('.filter')
    let tasks = []


    //Mudando o tema
    tema.addEventListener('click',()=>{
        if(localStorage.getItem('theme') === 'dark'){
            body.classList.add('light')
            main.classList.add('light')
            localStorage.setItem('theme', 'light')
        }else if(localStorage.getItem('theme') === 'light'){
            body.classList.remove('light')
            main.classList.remove('light')
            localStorage.setItem('theme', 'dark')
        }
    })

    if(!localStorage.getItem('theme')){
        localStorage.setItem('theme', 'dark')
    }
    if(localStorage.getItem('theme') === 'light'){
        body.classList.add('light')
        main.classList.add('light')
    }else{
        body.classList.remove('light')
        main.classList.remove('light')
    }


    //Criação e adição da tarefa

    function ContructTask(nome, concluido=false){
        this.nome = nome.charAt(0).toUpperCase() + nome.slice(1)
        this.concluido = concluido
    }

    input.addEventListener('input',()=>{
        if(input.value.length >= 3){
            input.nextElementSibling.style.transform = 'scale(1)'
            return
        }
        input.nextElementSibling.style.transform = 'scale(0)'
    })

    input.parentElement.addEventListener('submit', (event)=>{
        event.preventDefault()
        if(!input.value || input.value.length < 3){
            return
        }
        tasks.push(new ContructTask(input.value))
        updateTasks(tasks)
        input.value = ''
        input.focus()
        input.nextElementSibling.style.transform = 'scale(0)'
    })

    function updateTasks(obj, msg='tarefas ao todo'){
        campo.innerHTML = ''
        obj.forEach(element => {
            campo.appendChild(printTasks(element.nome, element.concluido))
        })
        config.firstElementChild.innerHTML = `${obj.length} ${msg}`
        saveTask(tasks)
    }

    function printTasks(nome, concluido){
        const divCheck = document.createElement('div')
        divCheck.classList.add('check')
        divCheck.setAttribute('tipo', 'checagem')
        divCheck.innerHTML = '<svg tipo="checagem" xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path tipo="checagem" fill="none" stroke="#FFFFFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>'

        const p = document.createElement('p')
        p.classList.add('descrição')
        p.setAttribute('tipo', 'titulo')
        p.innerText = nome 

        const divEdit = document.createElement('div')
        divEdit.classList.add('edit')
        divEdit.setAttribute('tipo', 'edicao')
        divEdit.innerHTML = '<svg tipo="edicao" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path tipo="edicao" fill="#9394a5" d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z"/></svg>'

        const form = document.createElement('form')
        form.classList.add('formEdit')
        form.innerHTML=`<input type="text" name="edit" id="iEdit" minlength="3" maxlength="40" value="${nome}"><input type="submit" value="Ok" tipo="formEdicao"><input tipo="formEdicao" type="reset" value="Cancelar">`

        const divDel = document.createElement('div')
        divDel.classList.add('remove')
        divDel.setAttribute('tipo', 'exclusao')
        divDel.innerHTML = '<svg tipo="exclusao" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path tipo="exclusao" fill="#9394a5" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>'

        const divTask = document.createElement('div')
        divTask.id = `i-${Date.now()}`
        divTask.classList.add('task')
        divTask.draggable = true 
        if(concluido){divTask.classList.add('concluido')}
        divTask.appendChild(divCheck)
        divTask.appendChild(p)
        divTask.appendChild(divEdit)
        divTask.appendChild(form)
        divTask.appendChild(divDel)
        divTask.addEventListener('dragstart',()=> divTask.classList.add('movel'))
        divTask.addEventListener('dragend', ()=> {
            divTask.classList.remove('movel')
            refresh()
        })
        return divTask
    }

    // Modificando a tarefa

    campo.addEventListener('click', (event)=>{
        event.preventDefault()
        domEvent(event.target)
    })

    function domEvent(event){
        const tipagem = event.getAttribute('tipo')
        if(event.className === 'campo' || !tipagem ){
            return
        }
        let element = event
        while (element.classList[0] !== 'task'){
            element = element.parentElement
        }
        const item = [...allTasks].indexOf(element)
        const opcoes = {
            checagem:()=>{
                if(!tasks[item].concluido){
                    tasks[item].concluido = true
                }else{
                    tasks[item].concluido = false
                }
                updateTasks(tasks)
            },
            edicao:()=>{
                const form = element.querySelector('.formEdit');
                [...campo.querySelectorAll('.formEdit')].forEach(element=>{
                    element.removeAttribute('style')
                })
                form.style.display = "flex"
                element.querySelector('#iEdit').focus()
            },
            formEdicao:()=>{
                const input = element.querySelector('#iEdit').value
                if(event.getAttribute('type') === 'submit'){
                    if(input.length < 3 ){
                        return
                    }
                    tasks[item].nome = input.charAt(0).toUpperCase() + input.slice(1)
                    updateTasks(tasks)
                }else if(event.getAttribute('type') === 'reset'){
                    event.parentElement.style.display = 'none'
                }
            },
            exclusao:()=>{
                tasks.splice(item, 1)
                updateTasks(tasks)
            },
        }
        if(opcoes[tipagem]){
            opcoes[tipagem]()
        }
    }

    // Arrastando e soltando

    function initSortableList(event){
        event.preventDefault()
        const movel = campo.querySelector('.movel')
        const irmaos = [...campo.querySelectorAll('.task:not(.movel)')]
        let proxIrmao = irmaos.find(element =>{
            return event.clientY <= element.offsetTop + element.offsetHeight /2
        })
        campo.insertBefore(movel, proxIrmao)
    }
    campo.addEventListener('dragover', initSortableList)
    campo.addEventListener('dragenter', event => event.preventDefault())


    function refresh(){
        tasks = [];
        [...campo.children].forEach(element=>{
            const nome = element.textContent
            const concluido = element.classList.contains('concluido')? true : false
            tasks.push(new ContructTask(nome, concluido))
        })
        updateTasks(tasks)
    }

    // Filtros e limpeza
    filt.addEventListener('click',(event)=>{
        event.preventDefault()
        filtros(event.target.getAttribute('tipo'))
    })

    function filtros(tipo){
        const opcoes = {
            todos:()=>{
                updateTasks(tasks)
            }, aFazer: ()=>{
                const pendente = tasks.filter(element=>{
                    return element.concluido === false
                })
                updateTasks(pendente, 'tarefas pendentes')
            }, concluido:()=>{
                const realizado = tasks.filter(element=>{
                    return element.concluido === true
                })
                updateTasks(realizado, 'tarefas concluídas')
            }
        }
        if(opcoes[tipo]){
            opcoes[tipo]()
        }
    }

    config.lastElementChild.addEventListener('click',()=>{
        const pendentes = tasks.filter(element=>{
            if(element.concluido === false){
                return element
            }
        })
        tasks = pendentes
        updateTasks(tasks)
    })

    // Armazenamento

    function getTask(){
        let arm = localStorage.getItem('tasks')
        if(arm === null || !arm.length ){
            return
        }
        arm = JSON.parse(arm)
        tasks = tasks.concat(arm)
        updateTasks(tasks)
    }
    getTask()

    function saveTask(obj){
        localStorage.setItem('tasks', JSON.stringify(obj))
    }

}())
