import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Modal from 'react-modal';

class App extends Component {
  constructor() {
    super();
    this.state = {
      students: [],
      modalIsOpen: false,
      edit: { id: "", name: "", age: "", grade: "" }
    };
  }
  getAll = () => {
    axios.get('http://localhost:3000/students')
      .then((res) => {
        this.setState({
          students: res.data,
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }
  add = () => {
    if (this.refs.name.value && this.refs.age.value && this.refs.grade.value) {
      let student = { name: this.refs.name.value, age: this.refs.age.value, grade: this.refs.grade.value };
      axios.post('http://localhost:3000/students', student)
        .then((res) => {
          this.getAll();
        })
        .catch((error) => {
          console.log(error);
        });
      this.refs.name.value = '';
      this.refs.age.value = '';
      this.refs.grade.value = '';
    }
  }
  edit = () => {
    let url = 'http://localhost:3000/students/' + this.state.edit.id;
    let student = { name: this.refs.nameEdit.value, age: this.refs.ageEdit.value, grade: this.refs.gradeEdit.value };
    axios.put(url, student)
      .then((res) => {
        this.getAll();
        this.setState({
          modalIsOpen: false,
          edit: { id: "", name: "", age: "", grade: "" }
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  delete = (id) => {
    let url = 'http://localhost:3000/students/' + id;
    axios.delete(url)
      .then((res) => {
        // console.log(res);
        this.getAll();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  openModal = (id) => {
    let url = 'http://localhost:3000/students/' + id;
    axios.get(url)
      .then((res) => {
        this.setState({
          edit: {
            id: res.data.id,
            name: res.data.name,
            age: res.data.age,
            grade: res.data.grade,
          }
        });
        this.setState({ modalIsOpen: true });
      })
      .catch((error) => {
        console.log(error);
      })
  }
  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      edit: { id: "", name: "", age: "", grade: "" }
    });
  }
  componentDidMount() {
    this.getAll();
  };
  render() {
    const data = this.state.students.map((item, index) => {
      return <tr key={index}>
        <td>{index + 1}.</td>
        <td>{item.name}</td>
        <td>{item.age}</td>
        <td>{item.grade}</td>
        <td>
          <button type="button" className="btn btn-secondary" onClick={() => { this.openModal(item.id); }}>Edit</button>&nbsp;
          <button type="button" className="btn btn-danger" onClick={() => { this.delete(item.id); }}>Delete</button>
        </td>
      </tr>;
    })
    return (
      <div>
        <h1 className="cen">Students Lists</h1>

        {/* form add students */}
        <div className="card m-3">
          <div className="card-body">
            <div className="form-group row">
              <label htmlFor="name" className="col-sm-2 col-form-label">Nama</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" ref="name" id="name" placeholder="Nama siswa" required />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="age" className="col-sm-2 col-form-label">Usia</label>
              <div className="col-sm-10">
                <input type="number" className="form-control" ref="age" id="age" placeholder="Usia siswa" required />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="grade" className="col-sm-2 col-form-label">Nilai</label>
              <div className="col-sm-10">
                <select className="form-control" ref="grade" id="grade">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-10">
                <button type="submit" className="btn btn-primary" onClick={this.add}>Tambah Siswa</button>
              </div>
            </div>
          </div>
        </div>

        {/* table students */}
        <div className="m-3">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama</th>
                <th>Usia</th>
                <th>Nilai</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data}
            </tbody>
          </table>
        </div>

        {/* modal edit students */}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Edit Students"
          shouldCloseOnOverlayClick={true}
          ariaHideApp={false}
        >

          <button type="button" className="close" onClick={this.closeModal}>
            <span aria-hidden="true">&times;</span>
          </button>
          <h2>Edit Siswa</h2>
          <div className="form-group row">
            <label htmlFor="nameEdit" className="col-sm-2 col-form-label">Nama</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" ref="nameEdit" id="nameEdit" placeholder="Nama siswa" defaultValue={this.state.edit.name} required />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="ageEdit" className="col-sm-2 col-form-label">Usia</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" ref="ageEdit" id="ageEdit" placeholder="Usia siswa" defaultValue={this.state.edit.age} required />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="gradeEdit" className="col-sm-2 col-form-label">Nilai</label>
            <div className="col-sm-10">
              <select className="form-control" ref="gradeEdit" id="gradeEdit" defaultValue={this.state.edit.grade}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-10">
              <button type="submit" className="btn btn-secondary" onClick={this.edit}>Edit Siswa</button>
            </div>
          </div>

        </Modal>

      </div>
    );
  }
}
export default App;
