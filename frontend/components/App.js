import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: "",
    todoNameInput: '',
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
  toggleCompleted = id => evt => {
    axios.patch(`${URL}/${id}`)
    .then(res => {
    })
    .catch(this.setAxiosResponeError);
  }
  componentDidMount(){
    this.fetchAllTodos();
  }

  render() {
    return (
      <div>
        <div id="error">Error: {this.state.error}</div>
        <div id="todos">
          <h2>Todos:</h2>
        {
          this.state.todos.map(todo => {
            return <div onClick={this.toggleCompleted(todo.id)} key={todo.id}>{todo.name}{todo.completed ? '✅' : '😭'}</div>
          })
        }
        </div>
        <form id="todoForm" onSubmit={this.onTodoFormSubmit}>
          <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange} type="text" placeholder='Type todo'></input>
          <input type="submit"></input>
          <button>CLear Completed</button>
        </form>
      </div>
    )
  }
}
