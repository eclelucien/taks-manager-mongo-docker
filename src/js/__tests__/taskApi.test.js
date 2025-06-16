describe('Task API Functions', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadTasks', () => {
    test('should load tasks successfully', async () => {
      const mockTasks = [
        {
          _id: '1',
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending',
          priority: 'medium',
          dueDate: '2024-12-31'
        }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockTasks })
      });

      await loadTasks();
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks');
      expect(document.getElementById('tasksList').innerHTML).toContain('Test Task');
    });

    test('should handle search term', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      await loadTasks('test');
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks?search=test');
    });

    test('should handle error response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error loading tasks' })
      });

      await loadTasks();
      expect(document.getElementById('alertText').textContent).toBe('Error loading tasks');
    });
  });

  describe('saveTask', () => {
    test('should create new task successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Task created successfully' })
      });

      await saveTask();
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending',
          priority: 'medium',
          dueDate: '2024-12-31',
          notes: 'Test Notes'
        })
      });
    });

    test('should update existing task successfully', async () => {
      document.getElementById('taskId').value = '1';
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Task updated successfully' })
      });

      await saveTask();
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending',
          priority: 'medium',
          dueDate: '2024-12-31',
          notes: 'Test Notes'
        })
      });
    });

    test('should validate required fields', async () => {
      document.getElementById('title').value = '';
      document.getElementById('description').value = '';

      await saveTask();
      expect(global.fetch).not.toHaveBeenCalled();
      expect(document.getElementById('alertText').textContent).toBe('Título e descrição são obrigatórios');
    });

    test('should handle error response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error saving task' })
      });

      await saveTask();
      expect(document.getElementById('alertText').textContent).toBe('Error saving task');
    });
  });

  describe('deleteTask', () => {
    test('should delete task successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Task deleted successfully' })
      });

      await deleteTask('1');
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks/1', {
        method: 'DELETE'
      });
    });

    test('should handle error response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error deleting task' })
      });

      await deleteTask('1');
      expect(document.getElementById('alertText').textContent).toBe('Error deleting task');
    });
  });

  describe('loadAndEditTask', () => {
    test('should load task for editing successfully', async () => {
      const mockTask = {
        _id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-12-31',
        notes: 'Test Notes'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockTask })
      });

      await loadAndEditTask('1');
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks/1');
      expect(document.getElementById('taskId').value).toBe('1');
      expect(document.getElementById('title').value).toBe('Test Task');
      expect(document.getElementById('description').value).toBe('Test Description');
    });

    test('should handle error response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error loading task' })
      });

      await loadAndEditTask('1');
      expect(document.getElementById('alertText').textContent).toBe('Error loading task');
    });
  });
}); 