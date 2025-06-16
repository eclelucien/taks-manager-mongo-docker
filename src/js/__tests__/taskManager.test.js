describe('Task Manager Functions', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="tasksList"></div>
      <div id="taskCount"></div>
      <form id="taskForm">
        <input type="hidden" id="taskId" value="">
        <input type="text" id="title" value="Test Task">
        <textarea id="description">Test Description</textarea>
        <select id="status">
          <option value="pending">Pendente</option>
          <option value="in_progress">Em andamento</option>
          <option value="completed">Concluída</option>
        </select>
        <select id="priority">
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
        <input type="date" id="dueDate" value="2024-12-31">
        <textarea id="notes">Test Notes</textarea>
      </form>
      <div id="alertMessage" class="alert d-none">
        <span id="alertText"></span>
      </div>
    `;
  });

  describe('getStatusLabel', () => {
    test('should return correct label for pending status', () => {
      expect(getStatusLabel('pending')).toBe('Pendente');
    });

    test('should return correct label for in_progress status', () => {
      expect(getStatusLabel('in_progress')).toBe('Em Andamento');
    });

    test('should return correct label for completed status', () => {
      expect(getStatusLabel('completed')).toBe('Concluída');
    });

    test('should return original value for unknown status', () => {
      expect(getStatusLabel('unknown')).toBe('unknown');
    });
  });

  describe('getStatusBadgeClass', () => {
    test('should return correct class for pending status', () => {
      expect(getStatusBadgeClass('pending')).toBe('bg-warning');
    });

    test('should return correct class for in_progress status', () => {
      expect(getStatusBadgeClass('in_progress')).toBe('bg-info');
    });

    test('should return correct class for completed status', () => {
      expect(getStatusBadgeClass('completed')).toBe('bg-success');
    });

    test('should return default class for unknown status', () => {
      expect(getStatusBadgeClass('unknown')).toBe('bg-secondary');
    });
  });

  describe('getPriorityLabel', () => {
    test('should return correct label for low priority', () => {
      expect(getPriorityLabel('low')).toBe('Baixa');
    });

    test('should return correct label for medium priority', () => {
      expect(getPriorityLabel('medium')).toBe('Média');
    });

    test('should return correct label for high priority', () => {
      expect(getPriorityLabel('high')).toBe('Alta');
    });

    test('should return original value for unknown priority', () => {
      expect(getPriorityLabel('unknown')).toBe('unknown');
    });
  });

  describe('getPriorityBadgeClass', () => {
    test('should return correct class for low priority', () => {
      expect(getPriorityBadgeClass('low')).toBe('bg-success');
    });

    test('should return correct class for medium priority', () => {
      expect(getPriorityBadgeClass('medium')).toBe('bg-warning');
    });

    test('should return correct class for high priority', () => {
      expect(getPriorityBadgeClass('high')).toBe('bg-danger');
    });

    test('should return default class for unknown priority', () => {
      expect(getPriorityBadgeClass('unknown')).toBe('bg-secondary');
    });
  });

  describe('updateTaskCount', () => {
    test('should update count for single task', () => {
      updateTaskCount(1);
      expect(document.getElementById('taskCount').textContent).toBe('1 tarefa');
    });

    test('should update count for multiple tasks', () => {
      updateTaskCount(5);
      expect(document.getElementById('taskCount').textContent).toBe('5 tarefas');
    });

    test('should update count for zero tasks', () => {
      updateTaskCount(0);
      expect(document.getElementById('taskCount').textContent).toBe('0 tarefas');
    });
  });

  describe('showAlert', () => {
    test('should show success alert', () => {
      showAlert('Success message', 'success');
      const alertElement = document.getElementById('alertMessage');
      expect(alertElement.classList.contains('alert-success')).toBe(true);
      expect(alertElement.classList.contains('d-none')).toBe(false);
      expect(document.getElementById('alertText').textContent).toBe('Success message');
    });

    test('should show error alert', () => {
      showAlert('Error message', 'danger');
      const alertElement = document.getElementById('alertMessage');
      expect(alertElement.classList.contains('alert-danger')).toBe(true);
      expect(alertElement.classList.contains('d-none')).toBe(false);
      expect(document.getElementById('alertText').textContent).toBe('Error message');
    });
  });

  describe('resetForm', () => {
    test('should reset all form fields', () => {
      resetForm();
      expect(document.getElementById('taskId').value).toBe('');
      expect(document.getElementById('title').value).toBe('');
      expect(document.getElementById('description').value).toBe('');
      expect(document.getElementById('status').value).toBe('pending');
      expect(document.getElementById('priority').value).toBe('medium');
      expect(document.getElementById('dueDate').value).toBe('');
      expect(document.getElementById('notes').value).toBe('');
    });
  });
}); 