import * as React from 'react'
import FormContainer from './FormContainer'
import Modal from '../components/Modal'

export default class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      payloadData: {
        title: {
          type: 'input',
          value: 'Mr'
        },
        name: {
          type: 'input',
          value: 'Chris Moore'
        },
        dob: {
          type: 'input',
          value: '13/11/1985',
        },
        location: {
          type: 'input',
          value: 'here'
        },
        dateTime: {
          type: 'input',
          value: '16:01 24/03/2019'
        }
      },
      displayModal: false,
      modalMessage: '',
      modalStatus: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.incrementPage = this.incrementPage.bind(this)
    this.decrementPage = this.decrementPage.bind(this)
    this.hideModal = this.hideModal.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log('submitting...')
    fetch(`/api/submit-survey`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(this.state.payloadData)
    }) 
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson.message)
      this.setState({
        displayModal: true,
        modalMessage: 'Thank you for your feedback',
        modalStatus: 'success'
      })
    })
    .catch(error => {
      this.setState({
        displayModal: true,
        modalMessage: 'Could not post feedback, try again later',
        modalStatus: 'failure'
      })
    })
  }

  decrementPage() {
    const { page } = this.state
    this.setState({ page: page - 1 })
  }

  incrementPage() {
    const { page } = this.state
    this.setState({ page: page + 1 })
  }

  showForm() {
    const { page, payloadData } = this.state
    const pageOneData = [
      payloadData.title,
      payloadData.name,
      payloadData.dob
    ]
    const pageTwoData = [
      payloadData.title,
      payloadData.name,
      payloadData.dob
    ]

    switch(page) {
      case(1):
        return (
          <FormContainer 
            page={page}
            showNext
            incrementPage={this.incrementPage}
            data={pageOneData}
          />
        )
      case(2):
        return (
          <FormContainer 
            page={page}
            showPrevious
            decrementPage={this.decrementPage}
            showSubmit
            handleSubmit={this.handleSubmit}
            data={pageTwoData}
          />
        )
      default: 
        return
    }
  }

  hideModal() {
    this.setState({
      displayModal: false,
      page: 1
    })
  }

  render() {
    const { displayModal, modalMessage, modalStatus } = this.state
    return (
      <div className="app-wrapper">
        <div className="form-wrapper">
          <h1>Customer Feedback</h1>
          {this.showForm()}
        </div>
        <Modal
          hideModal={this.hideModal}
          displayModal={displayModal}
          modalMessage={modalMessage}
          modalStatus={modalStatus}
        />
      </div>
    )
  }
}