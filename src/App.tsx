import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import './App.css';

interface Task {
  title: string;
  time: number;
}

const MAX_TITLE_LENGTH = 128;
const MAX_TIME = 24;

const TaskRow: React.FC<{ task: Task, onDelete: (task: Task) => void }> = ({ task, onDelete }) => (
  <tr>
    <td className="todo-task-title">
      <div className="scrollable-content">{task.title}</div>
    </td>
    <td>{task.time}</td>
    <td><button className="app todo-list delete" onClick={() => onDelete(task)}>Delete</button></td>
  </tr>
);

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [error, setError] = useState('');
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);

  const handleAdd = useCallback(() => {
    if (!title || !time) {
      setError('Both fields are required.');
      setErrorModalIsOpen(true);
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      setError(`Task Title should not exceed ${MAX_TITLE_LENGTH} characters.`);
      setErrorModalIsOpen(true);
      return;
    }

    const timeNumber = Number(time);
    if (isNaN(timeNumber) || timeNumber < 0 || timeNumber > MAX_TIME) {
      setError(`Time Required must be a number between 0 and ${MAX_TIME}.`);
      setErrorModalIsOpen(true);
      return;
    }

    setTasks([...tasks, { title, time: timeNumber }]);
    setTitle('');
    setTime('');
    setError('');
  }, [title, time, tasks]);

  const handleDelete = useCallback((task: Task) => {
    setIsOpen(true);
    setTaskToDelete(task);
  }, []);

  const confirmDelete = useCallback(() => {
    if (taskToDelete) {
      setTasks(tasks.filter(task => task !== taskToDelete));
    }
    setIsOpen(false);
  }, [tasks, taskToDelete]);

  const formatNumber = (num: number) => {
    const wholeNumber = Math.floor(num);
    const decimalPart = num % 1;
  
    const paddedWholeNumber = String(wholeNumber).padStart(3, '0');
  
    if (decimalPart === 0) {
      return paddedWholeNumber;
    } else {
      return `${paddedWholeNumber}.${Math.round(decimalPart * 100)}`;
    }
  };

  const totalHours = tasks.reduce((total, task) => total + task.time, 0);
  const totalDays = totalHours / 8;

  return (
    <div className="app">
      <div className="app-container">
          <h1>Task Management App</h1>
          <div className="counter-boxes">
            <div className="counter-box">
              <span className="counter-title">Total Tasks</span>
              <span className="counter-number">{String(tasks.length).padStart(3, '0')}</span>
            </div>
            <div className="counter-box">
              <span className="counter-title">Total Days</span>
              <span className="counter-number">{formatNumber(totalDays)}</span>
            </div>
            <div className="counter-box">
              <span className="counter-title">Total Hours</span>
              <span className="counter-number">{String(totalHours).padStart(3, '0')}</span>
            </div>
          </div>
          <div className="input-fields">
            <div className="input-field">
              <label>
                <span className="input-label">Task Title</span>
                <input className="app-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="..." />
              </label>
            </div>
            <div className="input-field">
              <label>
                <span className="input-label">Time Required (hours)</span>
                <input className="app-input" value={time} onChange={e => setTime(e.target.value)} placeholder="..." />
              </label>
            </div>
            <div className="input-field">
              <button className="app-button" onClick={handleAdd}>Add</button>
            </div>
          </div>
          {error && 
            <Modal isOpen={errorModalIsOpen} className="error-modal">
              <span className="error-text">{error}</span>
              <div className="modal-buttons">
                <button className="dismiss-error-button" onClick={() => setErrorModalIsOpen(false)}>Dismiss</button>
              </div>
            </Modal>
          }
          <text className="todo-list-header">Todo List</text>
          <div className="todo-list-container">
            <table className="app todo-list">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Time Required (hours)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {tasks.map((task, index) => (
                <TaskRow key={index} task={task} onDelete={handleDelete} />
              ))}
              </tbody>
            </table>
          </div>
          <Modal isOpen={modalIsOpen} className="delete-modal">
            <span className="confirm-delete-text">Confirm Delete</span>
            <div className="modal-buttons">
              <button className="confirm-delete-button" onClick={confirmDelete}>OK</button>
              <button className="cancel-button" onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </Modal>
        </div>
    </div>
  );
};

export default App;