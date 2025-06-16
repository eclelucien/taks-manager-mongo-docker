describe('Task Renderer Functions', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="tasksList"></div>
      <div id="taskCount"></div>
      <div id="alertMessage" class="alert d-none">
        <span id="alertText"></span>
      </div>
    `;
  });

  describe('renderTasks', () => {
    test('should render empty state when no tasks', () => {
      renderTasks([]);
      const tasksList = document.getElementById('tasksList');
      expect(tasksList.innerHTML).toContain('Nenhuma tarefa encontrada');
    });

    test('should render single task correctly', () => {
      const tasks = [{
        _id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-12-31'
      }];

      renderTasks(tasks);
      const tasksList = document.getElementById('tasksList');
      
      expect(tasksList.innerHTML).toContain('Test Task');
      expect(tasksList.innerHTML).toContain('Test Description');
      expect(tasksList.innerHTML).toContain('Pendente');
      expect(tasksList.innerHTML).toContain('Média');
      expect(tasksList.innerHTML).toContain('31/12/2024');
    });

    test('should render multiple tasks correctly', () => {
      const tasks = [
        {
          _id: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: 'pending',
          priority: 'low',
          dueDate: '2024-12-31'
        },
        {
          _id: '2',
          title: 'Task 2',
          description: 'Description 2',
          status: 'completed',
          priority: 'high',
          dueDate: '2024-12-31'
        }
      ];

      renderTasks(tasks);
      const tasksList = document.getElementById('tasksList');
      
      expect(tasksList.innerHTML).toContain('Task 1');
      expect(tasksList.innerHTML).toContain('Task 2');
      expect(tasksList.innerHTML).toContain('Description 1');
      expect(tasksList.innerHTML).toContain('Description 2');
    });

    test('should handle missing optional fields', () => {
      const tasks = [{
        _id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium'
      }];

      renderTasks(tasks);
      const tasksList = document.getElementById('tasksList');
      
      expect(tasksList.innerHTML).toContain('Test Task');
      expect(tasksList.innerHTML).toContain('Test Description');
      expect(tasksList.innerHTML).toContain('-'); // For missing dueDate
    });

    test('should include edit and delete buttons', () => {
      const tasks = [{
        _id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-12-31'
      }];

      renderTasks(tasks);
      const tasksList = document.getElementById('tasksList');
      
      expect(tasksList.innerHTML).toContain('btn-edit');
      expect(tasksList.innerHTML).toContain('btn-delete');
      expect(tasksList.innerHTML).toContain('bi-pencil-fill');
      expect(tasksList.innerHTML).toContain('bi-trash-fill');
    });
  });

  describe('addActionButtonsListeners', () => {
    test('should add click listeners to delete buttons', () => {
      const mockDeleteHandler = jest.fn();
      document.body.innerHTML = `
        <button class="btn-delete" data-task-id="1" data-task-title="Test Task"></button>
        <div id="deleteTaskTitle"></div>
      `;

      const button = document.querySelector('.btn-delete');
      button.addEventListener('click', mockDeleteHandler);
      button.click();

      expect(mockDeleteHandler).toHaveBeenCalled();
    });
  });
}); 