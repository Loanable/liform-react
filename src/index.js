import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import noop from 'lodash/noop'

import DefaultTheme from './themes/bootstrap3'
import renderFields from './renderFields'
import renderField from './renderField'
import processSubmitErrors from './processSubmitErrors'
import buildSyncValidation from './buildSyncValidation'
import { setError } from './buildSyncValidation'
import compileSchema from './compileSchema'

const BaseForm = props => {
    const { schema, handleSubmit, theme, error, submitting, context } = props

    return (
        <form onSubmit={handleSubmit}>
            {renderField(schema, null, theme || DefaultTheme, '', context)}
            <div>
                {error && <strong>{error}</strong>}
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>Submit</button>
        </form>
    )
}

const Liform = (props) => {
    const {
        schema,
        formKey,
        syncValidation,
        ajv,
        initialValues,
        context,
        baseForm,
        asyncValidate,
    } = props
    const { title } = schema

    const newProps = {
      ...props,
      schema: {
        ...props.schema,
        showLabel: true,
      }
    }

    const newContext = {
      ...context,
      formName,
    }

    const compiledSchema = compileSchema(schema)
    const formName = formKey || title || 'form'
    const validate = syncValidation || buildSyncValidation(compiledSchema, ajv)

    const FinalForm = reduxForm({
        form: formName,
        validate,
        initialValues,
        asyncValidate,
        context: newContext,
    })(baseForm || BaseForm)

    return (
        <FinalForm renderFields={renderField.bind(this)} {...newProps} schema={compiledSchema} />
    )
}

Liform.propTypes = {
    schema: PropTypes.object,
    onSubmit: PropTypes.func,
    initialValues: PropTypes.object,
    syncValidation: PropTypes.func,
    asyncValidate: PropTypes.func,
    formKey: PropTypes.string,
    baseForm: PropTypes.func,
    context: PropTypes.object,
    ajv: PropTypes.object,
}

Liform.defaultProps = {
    asyncValidate: noop,
}

export default Liform

export { renderFields, renderField, processSubmitErrors, DefaultTheme, setError }
