// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByAge from '../VaccinationByAge'

import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    lastDaysVaccinationList: [],
    vaccinationByAgeList: [],
    vaccinationByGenderList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getVaccinationDetails()
  }

  getVaccinationDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(covidVaccinationDataApiUrl)
    if (response.ok === true) {
      const data = await response.json()

      const lastDaysVaccinationData = data.last_7_days_vaccination.map(
        eachItem => ({
          vaccineDate: eachItem.vaccine_date,
          dose1: eachItem.dose_1,
          dose2: eachItem.dose_2,
        }),
      )
      const vaccinationByAgeData = data.vaccination_by_age.map(eachItem => ({
        age: eachItem.age,
        count: eachItem.count,
      }))
      const vaccinationByGenderData = data.vaccination_by_gender.map(
        eachItem => ({
          count: eachItem.count,
          gender: eachItem.gender,
        }),
      )

      this.setState({
        lastDaysVaccinationList: lastDaysVaccinationData,
        vaccinationByAgeList: vaccinationByAgeData,
        vaccinationByGenderList: vaccinationByGenderData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {
      lastDaysVaccinationList,
      vaccinationByAgeList,
      vaccinationByGenderList,
    } = this.state

    return (
      <div className="container">
        <VaccinationCoverage
          VaccinationCoverageDetails={lastDaysVaccinationList}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationByGenderList}
        />
        <VaccinationByAge vaccinationByAgeDetails={vaccinationByAgeList} />
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-heading">Something went wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSwitchStatusView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="website-heading">Co-WIN</h1>
        </nav>
        <div className="cowinDashboardContainer">
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderSwitchStatusView()}
        </div>
      </>
    )
  }
}
export default CowinDashboard
