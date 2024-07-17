
document.addEventListener('DOMContentLoaded', function () {

    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const formTarefa = document.getElementById('form-tarefa');
    const inputTarefa = document.getElementById('tarefa');
    const inputDescricao = document.getElementById('descricao');
    const selectStatus = document.getElementById('status'); 
    const listaTarefas = document.getElementById('lista-tarefas');
    const pesquisa = document.getElementById('pesquisa');
    const modal = document.getElementById('modal');
    const modal1 = document.getElementById('modal1');
    const modalContent = document.getElementById('modal1-content');
    const modalMessage = document.getElementById('modal-message');
    const toggleDarkMode = document.getElementById('toggle-dark-mode');
    const contagemTarefas = document.getElementById('contagem-tarefas');
    const sortNome = document.getElementById('sort-nome');
    const sortStatus = document.getElementById('sort-status');

    //TODO: Função para mostrar uma seção específica
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    //TODO:  Navegação SPA entre seções
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = link.id.replace('link-', '');
            showSection(sectionId);
        });
    });

    //TODO: Adiciona uma nova tarefa ao formulário
    formTarefa.addEventListener('submit', function (e) {
        e.preventDefault();
        const tarefa = inputTarefa.value.trim();
        const descricao = inputDescricao.value.trim();
        const status = selectStatus.value;
        if (tarefa && descricao && status) {
            addTarefa(tarefa, descricao, status);
            inputTarefa.value = '';
            inputDescricao.value = '';
            selectStatus.value = ''; 

            showModal('Tarefa adicionada com sucesso!');
            showSection('visualizar');
        }
    });

    //TODO: Mostra um modal de confirmação com uma mensagem
    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 2000);
    }

    // TODO:  Adiciona uma nova tarefa ao LocalStorage
    function addTarefa(nome, descricao, status) {
        const tarefas = getTarefas();
        const novaTarefa = { nome, descricao, status , dataCriacao: new Date().toISOString() };
        tarefas.push(novaTarefa);
        saveTarefas(tarefas);
        renderTarefas();
    }

    // TODO: Recupera tarefas do LocalStorage
    function getTarefas() {
        return JSON.parse(localStorage.getItem('tarefas')) || [];
    }

    // TODO: Salva tarefas no LocalStorage
    function saveTarefas(tarefas) {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    // TODO: Renderiza a lista de tarefas na página
    function renderTarefas() {
        const tarefas = getTarefas();
        listaTarefas.innerHTML = '';
        tarefas.forEach((tarefa, index) => {
            const card = document.createElement('div');
            
            card.className = 'card';
            
            if (tarefa.status === 'Concluída') {
                card.classList.add('concluida');
            } else {
                card.classList.add('pendiente');
            }
            card.innerHTML = `
                <h3>${tarefa.nome}</h3>
                <h5>${new Date(tarefa.dataCriacao).toLocaleString()}</h5>
                <div>
                    <button class="view" data-index="${index}">Ver</button>
                    <button class="edit" data-index="${index}">Editar</button>
                    <button class="delete" data-index="${index}">Excluir</button>
                </div>
            `;
            listaTarefas.appendChild(card);
        });
        updateContagemTarefas();
    }

    // TODO: Atualiza a contagem de tarefas pendentes e concluídas
    function updateContagemTarefas() {
        const tarefas = getTarefas();
        const pendentes = tarefas.filter(tarefa => tarefa.status === 'Pendente').length;
        const concluidas = tarefas.filter(tarefa => tarefa.status === 'Concluída').length;
        contagemTarefas.textContent = `Pendentes: ${pendentes} | Concluídas: ${concluidas}`;
    }

    // TODO:  Manipulação de eventos nos botões de cada tarefa (Ver, Editar, Excluir)
    listaTarefas.addEventListener('click', function (e) {

        if (e.target.tagName === 'BUTTON') {
            const index = e.target.getAttribute('data-index');
            const tarefas = getTarefas();
            if (e.target.classList.contains('view')) {
                viewTarefa(tarefas[index]);
            } else if (e.target.classList.contains('edit')) {
                editTarefa(index);
            } else if (e.target.classList.contains('delete')) {
                deleteTarefa(index);
            }
        }
    });


    
    // TODO : Exibe os detalhes de uma tarefa em um alert
    function viewTarefa(tarefa) {
       // Actualizar contenido del modal con los detalles de la tarea
    modalContent.innerHTML = `
    <h2>${tarefa.nome}</h2>
    <p><strong>Descrição:</strong> ${tarefa.descricao}</p>
    <p><strong>Status:</strong> ${tarefa.status}</p>
    <p><strong>Data de Criação:</strong> ${new Date(tarefa.dataCriacao).toLocaleString()}</p>
    <button id="close-modal">Fechar</button>
`;

        // Mostrar el modal
        modal1.style.display = 'block';

        // Manejar evento click del botón de cerrar
        const closeModalButton = document.getElementById('close-modal');
        closeModalButton.addEventListener('click', function() {
            modal1.style.display = 'none';
        });
    }

    


    // TODO: Edita uma tarefa
    function editTarefa(index) {
        const tarefas = getTarefas();
        const tarefa = tarefas[index];


    // TODO> Actualizar contenido del modal con los detalles de la tarea
    modalContent.innerHTML = `
        <h2>Editar Tarefa</h2>
        <form id="edit-form">
            <label for="edit-nome">Nome:</label>
            <input type="text" id="edit-nome" value="${tarefa.nome}" required>
            <label for="edit-descricao">Descrição:</label>
            <textarea id="edit-descricao" required>${tarefa.descricao}</textarea>
            <label for="edit-status">Status:</label>
            <select id="edit-status">
                <option value="Pendente" ${tarefa.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                <option value="Concluída" ${tarefa.status === 'Concluída' ? 'selected' : ''}>Concluída</option>
            </select>
            <button type="submit">Salvar</button>
        </form>
        <button id="close-modal">Fechar</button>
    `;

    // TODO> Mostrar el modal de edición
    modal1.style.display = 'block';

    // TODO> Manejar el envío del formulario de edición
    const editForm = document.getElementById('edit-form');
    editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const novoNome = document.getElementById('edit-nome').value.trim();
        const novaDescricao = document.getElementById('edit-descricao').value.trim();
        const novoStatus = document.getElementById('edit-status').value;

        if (novoNome && novaDescricao) {
            tarefa.nome = novoNome;
            tarefa.descricao = novaDescricao;
            tarefa.status = novoStatus;
            saveTarefas(tarefas);
            renderTarefas();
            modal1.style.display = 'none';
            showModal('Tarefa editada com sucesso!');
        }
    });

    // Manejar el botón de cerrar el modal de edición
    const closeModalButton = document.getElementById('close-modal');
    closeModalButton.addEventListener('click', function() {
        modal1.style.display = 'none';
    });
    }

    // Exclui uma tarefa
    function deleteTarefa(index) {
        const tarefas = getTarefas();
        tarefas.splice(index, 1);
        saveTarefas(tarefas);
        renderTarefas();
        showModal('Tarefa excluída com sucesso!');
    }

    // TODO: Filtra as tarefas com base na pesquisa
    pesquisa.addEventListener('input', function () {
        const termo = pesquisa.value.toLowerCase();
        const tarefas = getTarefas();
        listaTarefas.innerHTML = '';
        tarefas.filter(tarefa => tarefa.nome.toLowerCase().includes(termo)).forEach((tarefa, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${tarefa.nome}</h3>
                <div>
                    <button class="view" data-index="${index}">Ver</button>
                    <button class="edit" data-index="${index}">Editar</button>
                    <button class="delete" data-index="${index}">Excluir</button>
                </div>
            `;
            listaTarefas.appendChild(card);
        });
    });

    // TODO:  Ordena tarefas por nome
    sortNome.addEventListener('click', function () {
        const tarefas = getTarefas();
        tarefas.sort((a, b) => a.nome.localeCompare(b.nome));
        saveTarefas(tarefas);
        renderTarefas();
    });

    // TODO: Ordena tarefas por status
    sortStatus.addEventListener('click', function () {
        const tarefas = getTarefas();
        tarefas.sort((a, b) => a.status.localeCompare(b.status));
        saveTarefas(tarefas);
        renderTarefas();
    });

    //TODO:  Alterna o modo escuro
    toggleDarkMode.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
    });

    // Inicializa a aplicação mostrando a seção "Adicionar"
    showSection('adicionar');
    renderTarefas();
});
