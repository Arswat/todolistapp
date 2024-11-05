import React, { useState, useEffect } from 'react';
import { Form, Card, Button, ListGroup, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Content = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/tasks'); 
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (task.trim()) {
      try {
        const response = await axios.post('http://localhost:5000/tasks', { text: task, completed: false });
        setTasks([...tasks, response.data]);
        setTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };
  

  const toggleComplete = async (index, taskId) => {
    try {
      const updatedTask = { ...tasks[index], completed: !tasks[index].completed };
      await axios.put(`/tasks/${taskId}`, updatedTask); 
      setTasks(tasks.map((t, i) => (i === index ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`); 
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">To Do List</h2>
      <Card className="shadow-sm p-3 mb-4 bg-white rounded">
        <Card.Body>
          <Form onSubmit={(e) => e.preventDefault()} className="d-flex">
            <Form.Control
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter a new task..."
              className="me-2"
            />
            <Button variant="primary" onClick={addTask}>
              Add Task
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm p-3 bg-light rounded">
        <Card.Header className="text-center font-weight-bold">Your Tasks</Card.Header>
        <ListGroup variant="flush">
          {tasks.length > 0 ? (
            tasks.map((item, index) => (
              <ListGroup.Item
                key={item._id}
                className="d-flex align-items-center justify-content-between"
                style={{
                  textDecoration: item.completed ? 'line-through' : 'none',
                  backgroundColor: item.completed ? '#e9ecef' : 'white',
                }}
              >
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleComplete(index, item._id)}
                    className="me-3"
                  />
                  <span>{item.text}</span>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteTask(item._id)}
                >
                  Delete
                </Button>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="text-center">No tasks added yet</ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </div>
  );
};

export default Content;
