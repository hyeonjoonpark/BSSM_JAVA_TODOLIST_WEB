import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// 스타일 컴포넌트 정의
const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
`;

const TodoList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: start;
  gap: 10px;
`;

const TodoItem = styled.li`
  background-color: #f2f2f2;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


const Input = styled.input`
  padding: 10px;
  margin: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  height: 60px;
  width: 120px;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  height: 60px;
  width: 120px;

  &:hover {
    background-color: #ff2e00;
  }
`;


function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [startDate, setStartDate] = useState('');

  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDetail, setEditingDetail] = useState('');
  const [editingStartDate, setEditingStartDate] = useState('');


  // 투두리스트를 불러오는 함수
  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:8080/api/todo/read');
    setTodos(response.data);
  };

  // 새로운 투두를 추가하는 함수
  const addTodo = async () => {
    await axios.post('http://localhost:8080/api/todo/write', {
      title,
      detail,
      startDate,
    });
    fetchTodos(); // 투두리스트를 다시 불러옵니다.
  };

  // 투두 항목 삭제 함수
  const deleteTodo = id => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
    setEditingDetail(todo.detail);
    setEditingStartDate(todo.startDate);
  };

  const saveEdit = () => {
    setTodos(todos.map(todo =>
      todo.id === editingTodoId
        ? { ...todo, title: editingTitle, detail: editingDetail, startDate: editingStartDate }
        : todo
    ));
    setEditingTodoId(null);
    setEditingTitle('');
    setEditingDetail('');
    setEditingStartDate('');
  };


  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Container>
      <Title>투두리스트</Title>
      <TodoList>
        {todos.map(todo => (
          <TodoItem key={todo.id}>
            {editingTodoId === todo.id ? (
              <>
                <div>
                  <Input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    placeholder="제목"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    value={editingDetail}
                    onChange={(e) => setEditingDetail(e.target.value)}
                    placeholder="내용"
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    value={editingStartDate}
                    onChange={(e) => setEditingStartDate(e.target.value)}
                  />
                </div>
                <Button onClick={saveEdit}>저장</Button>
              </>
            ) : (
              <div>
                <div>{todo.id}. {todo.title}</div>
                <div>{todo.detail}</div>
                <div>{todo.startDate}</div>
                <br></br>
                <div>
                  <Button onClick={() => startEditing(todo)}>수정</Button>
                  <DeleteButton onClick={() => deleteTodo(todo.id)}>삭제</DeleteButton>
                </div>
              </div>
            )}
          </TodoItem>
        ))}
      </TodoList>

      <div>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
        />
        <Input
          type="text"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="내용"
        />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Button onClick={addTodo}>추가</Button>
      </div>
    </Container>
  );

}

export default App;
