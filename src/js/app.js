import '../css/styles.css';

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const tasksList = document.getElementById('tasksList');
  const taskCount = document.getElementById('taskCount');
  const taskForm = document.getElementById('taskForm');
  const saveButton = document.getElementById('saveTask');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const confirmDeleteButton = document.getElementById('confirmDelete');
  const alertMessage = document.getElementById('alertMessage');
  const alertText = document.getElementById('alertText');
  
  // Modais Bootstrap
  const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  
  // Estado da aplicação
  let currentTasks = [];
  let taskToDeleteId = null;
  let editMode = false; // Novo estado para controlar o modo de edição
  
  // ----- Funções CRUD e Auxiliares -----
  
  // Carregar tarefas
  async function loadTasks(searchTerm = '') {
    try {
      let url = '/api/tasks';
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar tarefas');
      }
      
      currentTasks = data.data;
      renderTasks(currentTasks);
      updateTaskCount(currentTasks.length);
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Criar ou atualizar tarefa
  async function saveTask() {
    try {
      // Show loading state
      saveButton.disabled = true;
      saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
      
      const taskId = document.getElementById('taskId').value;
      const isEditing = !!taskId;
      
      // Get form values
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();
      const status = document.getElementById('status').value;
      const priority = document.getElementById('priority').value;
      const dueDate = document.getElementById('dueDate').value;
      const notes = document.getElementById('notes').value.trim();
      
      // Validate required fields
      if (!title || !description) {
        showAlert('Título e descrição são obrigatórios', 'danger');
        return;
      }
      
      const taskData = {
        title,
        description,
        status,
        priority,
        dueDate: dueDate || null,
        notes: notes || null
      };
      
      console.log('Task data to save:', taskData);
      
      let url = '/api/tasks';
      let method = 'POST';
      
      if (isEditing) {
        url += `/${taskId}`;
        method = 'PUT';
      }
      
      console.log('Sending request to:', url, 'with method:', method);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      
      const data = await response.json();
      console.log('Response from server:', data);
      
      if (!response.ok) {
        throw new Error(data.message || `Erro ao ${isEditing ? 'atualizar' : 'criar'} tarefa`);
      }
      
      // Fechar modal e limpar formulário
      taskModal.hide();
      taskForm.reset();
      document.getElementById('taskId').value = ''; // Reset hidden ID field
      
      // Recarregar tarefas e mostrar mensagem de sucesso
      await loadTasks();
      showAlert(`Tarefa ${isEditing ? 'atualizada' : 'criada'} com sucesso!`, 'success');
      
      // Reset edit mode
      editMode = false;
    } catch (error) {
      console.error('Error saving task:', error);
      showAlert(error.message || 'Erro ao salvar tarefa. Por favor, tente novamente.', 'danger');
    } finally {
      // Reset button state
      saveButton.disabled = false;
      saveButton.innerHTML = 'Salvar';
    }
  }
  
  // Excluir tarefa
  async function deleteTask(id) {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao excluir tarefa');
      }
      
      // Fechar modal, recarregar tarefas e mostrar mensagem de sucesso
      deleteModal.hide();
      await loadTasks();
      showAlert('Tarefa excluída com sucesso!', 'success');
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Carregar uma tarefa específica e abrir o modal de edição
  async function loadAndEditTask(id) {
    try {
      editMode = true; // Ativar modo de edição ANTES de abrir o modal
      const response = await fetch(`/api/tasks/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar tarefa');
      }
      
      // Verificar estrutura da resposta e extrair a tarefa
      console.log('Resposta da API:', data);
      
      // A API retorna a tarefa dentro de data.data
      const task = data.data;
      
      // Verificar se os dados da tarefa foram recebidos corretamente
      if (!task) {
        throw new Error('Dados da tarefa não encontrados na resposta');
      }
      
      // Limpar formulário ANTES de preencher (para evitar resíduos)
      document.getElementById('taskId').value = '';
      
      // Exibir o modal (modal é aberto antes de preencher)
      taskModal.show();
      
      // Pequena pausa para garantir que o modal esteja totalmente aberto
      setTimeout(() => {
        // Preencher formulário com os dados
        document.getElementById('taskId').value = task._id;
        document.getElementById('title').value = task.title || '';
        document.getElementById('description').value = task.description || '';
        document.getElementById('status').value = task.status || 'pending';
        document.getElementById('priority').value = task.priority || 'medium';
        document.getElementById('dueDate').value = task.dueDate ? task.dueDate.substring(0, 10) : '';
        document.getElementById('notes').value = task.notes || '';
        
        // Definir título do modal para modo de edição
        document.getElementById('taskModalLabel').textContent = 'Editar Tarefa';
        
        console.log('Formulário preenchido com:', {
          id: document.getElementById('taskId').value,
          title: document.getElementById('title').value,
          description: document.getElementById('description').value,
          status: document.getElementById('status').value,
          priority: document.getElementById('priority').value
        });
      }, 100);
      
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      showAlert(error.message, 'danger');
      editMode = false; // Resetar modo de edição em caso de erro
    }
  }
  
  // Renderizar a lista de tarefas
  function renderTasks(tasks) {
    if (tasks.length === 0) {
      tasksList.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4">Nenhuma tarefa encontrada</td>
        </tr>
      `;
      return;
    }
    
    tasksList.innerHTML = tasks.map(task => `
      <tr class="fade-in">
        <td>${task.title || '-'}</td>
        <td>${task.description || '-'}</td>
        <td>
          <span class="badge ${getStatusBadgeClass(task.status)}">
            ${getStatusLabel(task.status)}
          </span>
        </td>
        <td>
          <span class="badge ${getPriorityBadgeClass(task.priority)}">
            ${getPriorityLabel(task.priority)}
          </span>
        </td>
        <td>${task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : '-'}</td>
        <td class="task-actions">
          <button class="btn btn-action btn-edit" onclick="editTask('${task._id}')" aria-label="Editar">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-action btn-delete" data-task-id="${task._id}" data-task-title="${task.title}" aria-label="Excluir">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      </tr>
    `).join('');
    
    addActionButtonsListeners();
  }
  
  // Adicionar event listeners aos botões de ação em cada linha
  function addActionButtonsListeners() {
    // Botões de exclusão
    document.querySelectorAll('.btn-delete').forEach(button => {
      button.addEventListener('click', () => {
        taskToDeleteId = button.getAttribute('data-task-id');
        const taskTitle = button.getAttribute('data-task-title');
        document.getElementById('deleteTaskTitle').textContent = taskTitle;
        deleteModal.show();
      });
    });
  }
  
  // Atualizar contador de tarefas
  function updateTaskCount(count) {
    taskCount.textContent = `${count} tarefa${count === 1 ? '' : 's'}`;
  }
  
  // Exibir alerta
  function showAlert(message, type = 'success') {
    alertText.textContent = message;
    alertMessage.className = `alert alert-${type} alert-dismissible fade show`;
    alertMessage.classList.remove('d-none');
    
    // Scroll to alert
    alertMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Ocultar alerta automaticamente após 5 segundos
    setTimeout(() => {
      alertMessage.classList.add('d-none');
      alertMessage.classList.remove('show');
    }, 5000);
  }
  
  // Limpar formulário e configurar para nova tarefa
  function resetForm() {
    // Limpar todos os campos de entrada
    document.getElementById('taskId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('status').value = 'pending';
    document.getElementById('priority').value = 'medium';
    document.getElementById('dueDate').value = '';
    document.getElementById('notes').value = '';
    
    // Configurar título do modal para nova tarefa
    document.getElementById('taskModalLabel').textContent = 'Nova Tarefa';
  }
  
  // Função global para edição (para ser acessível pelo onclick)
  window.editTask = function(id) {
    console.log('Editando tarefa com ID:', id);
    loadAndEditTask(id);
  };
  
  // Funções auxiliares para formatação
  function getStatusLabel(status) {
    const labels = {
      'pending': 'Pendente',
      'in_progress': 'Em Andamento',
      'completed': 'Concluída'
    };
    return labels[status] || status;
  }

  function getStatusBadgeClass(status) {
    const classes = {
      'pending': 'bg-warning',
      'in_progress': 'bg-info',
      'completed': 'bg-success'
    };
    return classes[status] || 'bg-secondary';
  }

  function getPriorityLabel(priority) {
    const labels = {
      'low': 'Baixa',
      'medium': 'Média',
      'high': 'Alta'
    };
    return labels[priority] || priority;
  }

  function getPriorityBadgeClass(priority) {
    const classes = {
      'low': 'bg-success',
      'medium': 'bg-warning',
      'high': 'bg-danger'
    };
    return classes[priority] || 'bg-secondary';
  }
  
  // ----- Event Listeners -----
  
  // Evento de salvar tarefa
  saveButton.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('Save button clicked');
    await saveTask();
  });
  
  // Evento de pesquisa
  searchButton.addEventListener('click', () => {
    loadTasks(searchInput.value);
  });
  
  // Pesquisar ao pressionar Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loadTasks(searchInput.value);
    }
  });
  
  // Evento para confirmar exclusão
  confirmDeleteButton.addEventListener('click', () => {
    if (taskToDeleteId) {
      deleteTask(taskToDeleteId);
    }
  });
  
  // Evento para quando o modal é fechado
  document.getElementById('taskModal').addEventListener('hidden.bs.modal', function () {
    // Resetar modo de edição
    editMode = false;
  });
  
  // Eventos para modal de tarefa
  document.getElementById('taskModal').addEventListener('show.bs.modal', function (event) {
    // Não resetar o formulário se estivermos em modo de edição
    if (!editMode) {
      resetForm();
    }
  });
  
  // Inicialização
  loadTasks();
}); 