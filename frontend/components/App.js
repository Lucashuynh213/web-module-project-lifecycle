import React from 'react'
import axios from 'axios'

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
        <div id="todos">
          <h2>Todos:</h2>
        {
          this.state.todos.reduce((acc, todo) => {
            if (this.state.displayCompleteds || !todo.completed) return acc.concat(<div onClick={this.toggleCompleted(todo.id)} key={todo.id}>{todo.name}{todo.completed ? '✅' : '😭'}</div>)
            return acc
          }, [])
        }
        </div>
        <form id="todoForm" onSubmit={this.onTodoFormSubmit}>
          <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange} type="text" placeholder='Type todo'></input>
          <input type="submit"></input>  
        </form>
        <button onClick={this.toggleDisplayCompleted}>{this.state.displayCompleteds ? 'Hide' : 'Show'} Completed</button>
      </div>
    )
  }
}
