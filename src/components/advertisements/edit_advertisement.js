import React, { Component } from 'react';
import { Field, Fields, reduxForm } from 'redux-form'
import { connect } from 'react-redux';

import * as actions from '../../actions'

class EditAdvertisements extends Component {
  componentWillMount(){
    this.props.getCities()
    this.props.getCategories()
    this.props.loadData(this.props.params.id)
  }

  submitForm = values => {
    const { id } = JSON.parse(localStorage.getItem('user'))
    const { editAdvertisement } = this.props;
    values.user = id

    editAdvertisement(values, this.props.params.id)
  }

  renderError = () => {
    const { errorMessages } = this.props

    if ( errorMessages && errorMessages.length ) {
      return (
        <div className='alert alert-danger'>
          <ul>
            {this.props.errorMessages.map((msg) => <li key={msg} className='small'>{msg}</li>)}
          </ul>
        </div>
      )
    }
  }
  
  renderTextField = ({ input, label, type, meta: { touched, error, warning } }) => (
    <div>
      <label>{label}</label>
      <div>
        <input {...input} className="form-control" placeholder={label} type={type}/>
        {touched && ((error && <small><em>{error}</em></small>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  )

  renderTextAreaField = ({ input, meta: { touched, error, warning }, className, label, rows }) => {
    return(
      <div>
        <labe>{label}</labe>
        <div>
          <textarea {...input} className={className} placeholder={label} rows={rows} />
          {touched && ((error && <small><em>{error}</em></small>) || (warning && <span>{warning}</span>))}
        </div>
      </div>
    )
  }

  rednerSelectField = ({ input, meta: { touched, error, warning }, children, className, label }) => {
    return(
      <div>
        <label>{label}</label>
        <div>
          <select {...input} className={className} >
            {children}
          </select>
          {touched && ((error && <small><em>{error}</em></small>) || (warning && <span>{warning}</span>))}
        </div>
      </div>
    )
  }

  renderItems = (items) => (
    items.map(item => <option value={item.id} key={item.id}>{item.name}</option>)
  )

  render() {
    const { handleSubmit, pristine, reset, submitting, valid, initData } = this.props

    return (
      <div className="container m-t-3">
        <div className="col-md-8 offset-md-2">
          <h1 className="signup-header">Промени оглас</h1>
          <form onSubmit={handleSubmit(this.submitForm.bind(this))} encType="multipart/form-data" >
            <div className="form-group">
              <Field name="title" type="text" component={this.renderTextField} label="Наслов" />
            </div>

            <div className="form-group">
              <div>
                <Field name="description" component={this.renderTextAreaField} className="form-control" label="Опис" rows="3" />
              </div>
            </div>
            
            <div className="form-group">
              <Field name="price" type="text" component={this.renderTextField} label="Цена (мкд)" />
              <small className="form-text text-muted">Доколку не наведете цена таа ќе биде "По договор".</small>
            </div>

            <div className="form-group">
              <Field name="category" component={this.rednerSelectField} className="form-control" label="Категорија">
                <option>-Избери-</option>
                { this.renderItems(this.props.categories) }
              </Field>
            </div>

            <div className="form-group">
              <Field name="state" component={this.rednerSelectField} className="form-control" label="Состојба">
                <option>-Избери-</option>
                { this.renderItems([{id: "Нов", name: "Нов"}, {id: "Поволен", name: "Поволен"}]) }
              </Field>
            </div>

            <div className="form-group">
              <Field name="purpose" component={this.rednerSelectField} className="form-control" label="Вид">
                <option>-Избери-</option>
                { this.renderItems([{id: "Се продава", name: "Се продава"}, {id: "Се купува", name: "Се купува"}]) }
              </Field>
            </div>

            <div className="form-group">
              <Field name="location" component={this.rednerSelectField} className="form-control" label="Локација">
                <option>-Избери-</option>
                { this.renderItems(this.props.cities) }
              </Field>
            </div>

            { this.renderError() }

            <div className="col-md-2 offset-md-5">
              <button type="submit" disabled={!valid} className="btn btn-info m-t-2 m-b-2">Зачувај оглас</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const validate = values => {
  const errors = {}
  const required_fields = ['title', 'description', 'state', 'purpose', 'category', 'location']

  required_fields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Задолжително поле!'
    }    
  })

  if(values.title && values.title.length > 75) {
    errors.title = 'Насловот може да содржи максимум 75 карактери!'
  }

  if(values.description && values.description.length > 500) {
    errors.description = 'Описот може да содржи максимум 500 карактери!'
  }

  if (values.state && values.state == "-Избери-") {
    errors.state = 'Задолжително поле!'
  }

  if (values.purpose && values.purpose == "-Избери-") {
    errors.purpose = 'Задолжително поле!'
  }

  if (values.price && !/^[1-9]{1}[0-9, \.]*$/.test(values.price)) {
    errors.price = 'Невалиден цена'
  }

  if (values.price && values.price.length > 9) {
    errors.price = 'Цената може да има максимум 9 цифри!'
  }

  return errors
}

const mapStateToProps = state => {
  let initData = state.ads.load_data

//   var getFileBlob = function (url, cb) {
//         var xhr = new XMLHttpRequest();
//         xhr.open("GET", url);
//         xhr.responseType = "blob";
//         xhr.addEventListener('load', function() {
//             cb(xhr.response);
//         });
//         xhr.send();
//   };

//   var blobToFile = function (blob, name) {
//           blob.lastModifiedDate = new Date();
//           blob.name = name;
//           return blob;
//   };

//   var getFileObject = function(filePathOrUrl, cb) {
//          getFileBlob(filePathOrUrl, function (blob) {
//             cb(blobToFile(blob, 'test.jpg'));
//          });
//   };

//   getFileObject("http://localhost:3000/" + "/uploads/advertisement/image/41/file.jpeg"
// , function (fileObject) {
//        console.log(new File([fileObject], "filename.jpeg"));
//        initData.image = new File([fileObject], "filename.jpeg")
//   }); 

  return {
    errorMessages: state.ads.errorMessages,
    successMesage: state.ads.successMesage,
    cities: state.items.cities,
    categories: state.items.categories,
    initialValues: {
      ...initData
    }
  }
}

EditAdvertisements = reduxForm({
  form: "EditAdvertisements",
  enableReinitialize: true,
  validate
})(EditAdvertisements)

EditAdvertisements = connect(
  mapStateToProps,
  actions
)(EditAdvertisements)

export default EditAdvertisements