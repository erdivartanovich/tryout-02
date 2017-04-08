import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

//title component
const Title = ({todoCount}) => {
  return (
    <div className="page-header">
      <h1>TODO LIST</h1>
      <a href="#">You Have <span className="badge">{todoCount}</span> Tasks Todo</a> 
    </div>
  )
};

//todo form component
const TodoForm = ({addTodo}) => {
  // Input Tracker
  let input;
  // Return JSX
  return (
    <div>
      <div className="form-group" >
        <input className="form-control text-center" placeholder="Add new task" ref={node => {
          input = node;
        }} />
        <br />
      </div>
      <button type="submit" className="btn btn-default" onClick={(e) => {
          e.preventDefault();
          addTodo(input.value);
          input.value = '';
      }}>Add</button>
    </div>
  );
};

//ToDoList Component
const Todo = ({todo, remove}) => {
  // Each Todo
  return (
    <a href="#" className="list-group-item" onClick={() => {remove(todo.id)}}>{todo.task}</a>
  );
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

  componentDidMount(){
    // Get all data from backend
    axios.get(this.backEndUrl)
      .then((res) => {
        // Set state with result
        this.setState({data:res.data});
        console.log(this.state.data);
      });
  }

  // Add todo handler
  addTodo(val){
    // Assemble data tobe added
    const todo = {task: val}

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
  };

  // Handle remove
  handleRemove(id){
    // Filter all todos except the one to be removed
    const remainder = this.state.data.filter((todo) => {
      if(todo.id !== id) return todo;
    });
    // Update state with filter
    axios.delete(this.backEndUrl+id)
      .then((res) => {
        this.setState({data: remainder});      
      })
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to TODO APP</h2>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <Title todoCount={this.state.data.length}/>
              <TodoForm addTodo={this.addTodo.bind(this)}/>
              <TodoList 
                todos={this.state.data} 
                remove={this.handleRemove.bind(this)}
              />
            </div>
            <div className="col-md-4"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
