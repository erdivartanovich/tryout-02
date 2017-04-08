import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

//title component
const Title = ({todoCount}) => {
  return (
    <div>
      <h2>TODO LIST</h2>
      <h3>You have {todoCount} Tasks Todo</h3>
    </div>
  )
};

//todo form component
const TodoForm = ({addTodo}) => {
  // Input Tracker
  let input;
  // Return JSX
  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        addTodo(input.value);
        input.value = '';
      }}>
      <input className="form-control" ref={node => {
        input = node;
      }} />
      <br />
    </form>
  );
};

//ToDoList Component
const Todo = ({todo, remove}) => {
  // Each Todo
  return (<a href="#" className="list-group-item" onClick={() => {remove(todo.id)}}>{todo.text}</a>);
}

const TodoList = ({todos, remove}) => {
  // Map through the todos
  const todoNode = todos.map((todo) => {
    return (<Todo todo={todo} key={todo.id} remove={remove}/>)
  });
  return (<div className="list-group" style={{marginTop:'30px'}}>{todoNode}</div>);
}

class App extends Component {

  constructor(props){
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: []
    }
    this.backEndUrl = 'http://localhost:4000/'
  }

  // Add todo handler
  addTodo(val){
    // Assemble data tobe added
    const todo = {task: val}

    // console.log(todo);
    // this.state.data.push(todo);
    // this.setState({data: this.state.data});
    // console.log(this.state.data);

    // add data
    axios.post(this.backEndUrl+'add/', todo,
       {
         headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            }

       })
       .then((res) => {
          this.state.data.push(res.data);
          this.setState({data: this.state.data});
          console.log(this.state.data);
       });
  }

  // Handle remove
  handleRemove(id){
    // Filter all todos except the one to be removed
    const tersisa = this.state.data.filter((todo) => {
      todo.id !== id;
    });

    //upadate state with filtered one
    this.setState({data: tersisa});
    return tersisa;
  }



  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to TODO APP</h2>
        </div>
        <Title todoCount={this.state.data.length}/>
        <TodoForm addTodo={this.addTodo.bind(this)}/>
        <TodoList 
          todos={this.state.data} 
          remove={this.handleRemove.bind(this)}
        />
      </div>
    );
  }
}

export default App;
