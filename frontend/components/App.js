import React from 'react'
import axios from 'axios'
import Form from './Form'
import TodoList from './TodoList'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: "",
    todoNameInput: '',
    displayCompleteds: true,
  }

  onTodoNameInputChange = evt => {
    const {value} = evt.target
    this.setState({...this.state, todoNameInput: value})
  }

  resetForm = () => this.setState({...this.state, todoNameInput:''})

  setAxiosResponeError = err => this.setState({...this.state, error: err.response.data.message})

  postNewTodo = () => {
    axios.post(URL,{name: this.state.todoNameInput})
    .then( res => {
      this.setState({...this.state, todos: this.state.todos.concat(res.data.data)})
      this.resetForm()
    })
    .catch(this.setAxiosResponeError)
  }

  onTodoFormSubmit = evt => {
    evt.preventDefault()
    this.postNewTodo();
  }

  fetchAllTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({...this.state, todos: res.data.data})
      })
      .catch(this.setAxiosResponeError)
  }
  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
    .then(res => {
      this.setState({...this.state, todos: this.state.todos.map(todo => {
        if (todo.id !== id) return todo
        return res.data.data
      })})
    })
    .catch(this.setAxiosResponeError);
  }
  toggleDisplayCompleted = () => {
    this.setState({...this.state, displayCompleteds: !this.state.displayCompleteds})
  }
  componentDidMount(){
    this.fetchAllTodos();
  }

  render() {
    return (
      <div>
        <div id="error">Error: {this.state.error}</div>
        
        <TodoList
        todos={this.state.todos}
        displayCompleteds={this.state.displayCompleteds}
        toggleCompleted={     this.toggleCompleted
        }
        />

        <Form
        onTodoFormSubmit={this.onTodoFormSubmit}
        onTodoNameInputChange={this.onTodoNameInputChange}
        toggleDisplayCompleted={this.toggleDisplayCompleted}
        todoNameInput={this.state.todoNameInput}
        displayCompleteds={this.state.displayCompleteds}
        />
      </div>
    )
  }
}
