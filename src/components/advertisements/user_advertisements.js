import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router' 
import * as actions from '../../actions'

import Advertisement from './advertisement'
import Pagination from './pagination'

class UserАdvertisements extends Component {
	componentWillMount() {
		const { user } = this.props
		this.props.getUserAdvertisements(user.id, 1)
	}

	getAds(page) {
		const { user } = this.props
		this.props.getUserAdvertisements(user.id, page)
	}

	rednerSuccessMessage() {
		const { successMessage } = this.props

		if (successMessage) {
			return (
				<div className="alert alert-success" role="alert">
				  <strong>{ successMessage }</strong>
				</div>
			)
		}
	}

	render() {
		const { location } = this.props
		const { user_ads } = this.props

		return (
			<div className='container'>
				{ this.rednerSuccessMessage() }
				{this.props.user_ads_per_page.map((ad) => <Advertisement {...this.props} key={ad.id} ad={ad} />)}
				<div className="col-md-6 offset-md-3">
					<Pagination {...this.props} ads={this.props.user_ads} getAds={this.getAds.bind(this)} location={location} />
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return { 
		user: state.auth.user,
		user_ads: state.auth.user_ads,
		user_ads_per_page: state.auth.user_ads_per_page,
		successMessage: state.ads.successMessage
	}
}

export default connect(mapStateToProps, actions)(UserАdvertisements)