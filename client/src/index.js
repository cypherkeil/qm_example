import React from 'react';
import ReactDOM from 'react-dom';
import validation from './validation'
import './index.css';

/**
 * A text field has one text entry field to accept a value
 */
class TextField extends React.Component {

  /**
   *  onChange event handler for a dropdown
   * 
   * @param event e the onClick event.
   * @return None calls the onRemove callback with this Clauses's index.
   */
  onTextChange(e) {
    let index = this.props.index;

    this.props.onChange(index, { "text": e.target.value });
  }

  /**
   * Lifecycle.
   * 
   */
  render() {
    return (
      <input className="clause_text" type="text" value={this.props.clause["text"]} onChange={this.onTextChange.bind(this)} />
    )
  }
}

/**
 * A range field has two text entry fields to accept a range
 */
class RangeField extends React.Component {

  /**
   *  onChange event handler for a dropdown
   * 
   * @param event e the onClick event.
   * @return None calls the onRemove callback with this Clauses's index.
   */
  onTextChange(field, e) {
    let index = this.props.index;

    let changed_prop = {}
    changed_prop[field] = e.target.value;
    this.props.onChange(index, changed_prop);
  }

  /**
   * Lifecycle.
   * 
   */
  render() {
    return (
      <div className="range_container">
        <input className="clause_min" type="text" value={this.props.clause["min"]} onChange={this.onTextChange.bind(this, "min")} />
        <div className="clause_label">to</div>
        <input className="clause_max" type="text" value={this.props.clause["max"]} onChange={this.onTextChange.bind(this, "max")} />
      </div>
    )
  }
}

/**
 * A Clause holds a single row expressing an SQL condition
 * it includes a remove button
 * 
 */
class Clause extends React.Component {

  /**
   * Lifecycle.
   * 
   * @param Object props the properties passed to this component
   */
  constructor(props) {
    super(props);

    // initialize some fixed values
    this.column_options = [
      ["User Email", "user_email"],
      ["Screen Width", "screen_width"],
      ["Screen Height", "screen_height"],
      ["# of Visits", "visits"],
      ["First Name", "user_first_name"],
      ["Last Name", "user_last_name"],
      ["Page Response Time (ms)", "page_response"],
      ["Domain", "domain"],
      ["Page Path", "path"]
    ];

    this.column_types = {
      "user_email": "string",
      "screen_width": "number",
      "screen_height": "number",
      "visits": "number",
      "user_first_name": "string",
      "user_last_name": "string",
      "page_response": "number",
      "domain": "string",
      "path": "string"
    }

    this.string_operator_options = [
      ['starts with', 'starts_with'],
      ['does not start with', 'not_starts_with'],
      ['equals', 'equals'],
      ['does not equal', 'not_equals'],
      ['contains', 'contains'],
      ['does not contain', 'not_contains'],
      ['in list', 'in_list']
    ]

    this.number_operator_options = [
      ['less than or equal', '<='],
      ['equals', '='],
      ['does not equal', '!='],
      ['greater than or equal', '>='],
      ['in list', 'in_list_num'],
      ['between', 'between']
    ]
  }

  /**
   *  onClick event handler for the remove button
   * 
   * @param event e the onClick event.
   * @return None calls the onRemove callback with this Clauses's index.
   */
  onRemove(e) {
    let index = this.props.index;

    this.props.onRemove(index);
  }

  /**
   *  onChange event handler for a dropdown
   * 
   * @param event e the onClick event.
   * @return None calls the onRemove callback with this Clauses's index.
   */
  onColumnChange(e) {
    let index = this.props.index;
    let target_value = e.target.value;
    let column_type = this.column_types[target_value];

    this.props.onChange(index, {
      "column": target_value,
      "column_type": column_type
    });

    // set our operator state in case our column type changed and there's a new
    // operator dropdown
    if (column_type === "number") {
      this.onOperatorChange({ target: { value: '<=' } });
    } else {
      this.onOperatorChange({ target: { value: 'starts_with' } });
    }
  }

  /**
   *  onChange event handler for a dropdown
   * 
   * @param event e the onClick event.
   * @return None calls the onRemove callback with this Clauses's index.
   */
  onOperatorChange(e) {
    let index = this.props.index;

    this.props.onChange(index, { "operator": e.target.value });
  }

  /**
   * Lifecycle.
   * 
   */
  render() {

    let optionGenerator = (ele, i) => {
      let label = ele[0];
      let value = ele[1];
      return (
        <option key={value} value={value}>{label}</option>
      )
    };

    let column_dropdown_options = this.column_options.map(optionGenerator);
    let string_operator_dropdown_options = this.string_operator_options.map(optionGenerator);
    let number_operator_dropdown_options = this.number_operator_options.map(optionGenerator);
    let column_type = this.column_types[this.props.clause["column"]];
    let operator_dropdown_options = string_operator_dropdown_options;

    if (column_type === "number") {
      operator_dropdown_options = number_operator_dropdown_options;
    }

    let field = <TextField index={this.props.index} clause={this.props.clause} onChange={this.props.onChange} />;

    if (this.props.clause["operator"] === "between") {
      field = <RangeField index={this.props.index} clause={this.props.clause} onChange={this.props.onChange} />;
    }


    return (
      <div>
        <input className="remove_button" type="button" value="-" onClick={this.onRemove.bind(this)} />
        <select className="clause_dd" type="dropdown" value={this.props.clause["column"]} onChange={this.onColumnChange.bind(this)} >
          {column_dropdown_options}
        </select>
        <select className="clause_dd" type="dropdown" value={this.props.clause["operator"]} onChange={this.onOperatorChange.bind(this)} >
          {operator_dropdown_options}
        </select>
        {field}
      </div>
    )
  }
}

/**
 * A box that can hold multiple Clauses.
 * 
 */
class Clauses extends React.Component {

  render() {
    let clauses = this.props.clauses.map((ele, i) => {
      return (
        <Clause key={ele["clause_id"]} index={i} clause={ele} onRemove={this.props.onRemove} onChange={this.props.onChange} />
      )
    });

    return (
      <div>
        <div className="clause_container">
          {clauses}
        </div>
        <input className="action_button" type="button" value="AND" onClick={this.props.onAdd} />
      </div >
    );
  }
}

/**
 * Puts together the entire predicate builder.
 */
class PredicateBuilder extends React.Component {

  /**
   * Lifecycle.
   * 
   * @param Object props the properties passed to this component
   */
  constructor(props) {
    super(props);

    let default_clause = {
      "clause_id": 0,
      "column": 'user_email',
      "operator": 'starts_with',
      "column_type": "string",
      "text": "",
      "min": "",
      "max": ""
    };

    this.state = {
      'default_clause': default_clause,
      'clauses': [Object.assign({}, default_clause)],
      'clause_id': 1, // id for next clause incrementing id for each clause to tell them apart
      'status': "",
      // {index: {field_name: [errors]}}
      'errors': {}
    }
  }

  /**
   * Callback for deleting a clause.
   * 
   * @param int index the index of the clause to remove.
   * @return None calls self.setState().
   */
  removeClause(index) {
    let clauses = this.state.clauses.slice();
    clauses.splice(index, 1);

    this.setState({ 'clauses': clauses });
  }

  /**
   * Callback for adding a clause.
   * 
   * @return None calls self.setState().
   */
  addClause() {
    let clauses = this.state.clauses.slice();

    let clause_id = this.state.clause_id;
    let new_clause = Object.assign({}, this.state.default_clause);

    new_clause["clause_id"] = clause_id;
    clauses.push(new_clause);

    // increment the clause_id for the next Clause
    clause_id += 1;

    this.setState({ 'clauses': clauses, 'clause_id': clause_id });
  }

  /**
   * Callback for updating a clause.
   * 
   * @param int index the index of the clause to modify.
   * @return None calls self.setState().
   */
  updateClause(index, values) {
    let clauses = this.state.clauses.slice();
    let updating_clause = clauses[index];

    updating_clause = Object.assign(updating_clause, values);
    clauses.splice(index, 1, updating_clause);

    this.setState({ 'clauses': clauses }, this.validateClause(updating_clause, index, values));
  }

  /**
  * Sets data validation errors in the state if there are any
  * 
  * @param Object updating_clause The clause that has been updated with new values.
  * @param String index The index of the Clause component.
  * @param Object changed_values An object describing which keys changed to new values.
  * @return None Sets this.state.errors to an error object.
  */
  validateClause(updating_clause, index, changed_values) {
    let column_type = updating_clause["column_type"];
    let operator = updating_clause["operator"];


    let errors = { ...this.state.errors };
    let index_errors = errors[index] || {};

    if (operator === "between") {
      let field_name = "min";

      if (changed_values.hasOwnProperty(field_name)) {
        let min = updating_clause[field_name];
        let field_errors = [];
        field_errors = field_errors.concat(validation.isEmpty(min));
        field_errors = field_errors.concat(validation.isNumber(min));
        index_errors = Object.assign(index_errors, { "min": field_errors });
      }

      field_name = "max";
      if (changed_values.hasOwnProperty(field_name)) {
        let max = updating_clause[field_name];
        let field_errors = [];
        field_errors = field_errors.concat(validation.isEmpty(max));
        field_errors = field_errors.concat(validation.isNumber(max));
        index_errors = Object.assign(index_errors, { "max": field_errors });
      }

    } else {
      if (changed_values.hasOwnProperty("text")) {
        let field_name = "text";
        let text = updating_clause["text"];

        if (["in_list", "in_list_num"].includes(operator)) {
          let field_errors = [];
          field_errors = field_errors.concat(validation.isEmpty(text));
          field_errors = field_errors.concat(validation.isList(text));
          index_errors = Object.assign(index_errors, { "text": field_errors });
        } else {
          // most of everything
          let field_errors = [];
          if (column_type === "string") {
            field_errors = field_errors.concat(validation.isEmpty(text));
            field_errors = field_errors.concat(validation.isString(text));
          } else {
            field_errors = field_errors.concat(validation.isEmpty(text));
            field_errors = field_errors.concat(validation.isNumber(text));
          }
          index_errors = Object.assign(index_errors, { "text": field_errors });
        }
      }
    }
    errors[index] = index_errors;
    this.setState({ "errors": errors });
  }


  /**
   * Defines what happens when you hit the "Search" button
   * 
   */
  performSearch() {

    let self = this;
    let clauses = this.state.clauses.slice();

    // remove the "clause_id" from clauses, as it's only for the interface
    clauses = clauses.map((ele, i) => {
      delete ele["clause_id"];
      return ele;
    });

    let uri = "/sql"

    fetch(uri, {
      'method': 'POST',
      'headers': {
        "Content-Type": "application/json; charset=utf-8",
      },
      'body': JSON.stringify(clauses)
    })
      .then((response) => {
        return response.json();
      })
      .then((sql_obj) => {
        let sql = sql_obj["SQL"];

        self.setState({ "status": sql });
      })
  }

  /**
   * Generates an error message string from the "errors" object in the state.
   */
  getErrorMessage() {
    let error_message = "";
    let error_strings = [];

    Object.keys(this.state.errors).forEach((ele, i) => {
      // convert from array-index to human-index
      let row_string = "row " + (parseInt(ele) + 1);
      let index_errors = this.state.errors[ele];

      Object.keys(index_errors).forEach((field_name, i) => {
        let errors = index_errors[field_name];

        if (errors && errors.length > 0) {
          // maximum on row # ...
          let pretty_field_name = field_name;
          if (field_name === "min") {
            pretty_field_name = "Minimum";
          } else if (field_name === "max") {
            pretty_field_name = "Maximum";
          } else {
            pretty_field_name = "Value"
          }
          let error_string = pretty_field_name + " on " + row_string + ": " + errors.join(", ") + ".";
          error_strings.push(error_string);
        }
      });
    });

    if (error_strings && error_strings.length > 0) {
      error_message = error_strings.join("\n\n");
    }

    return error_message;

  }
  /**
   * Lifecycle.
   * 
   * 
   */
  render() {

    let error_element = '';
    let error_message = this.getErrorMessage();

    if (error_message && error_message.length > 0) {
      error_element = (
        <div>
          <div className="error_title">Errors</div>
          <div className="errors">{error_message}</div>
        </div>
      );
    }

    let status_element = '';

    if (this.state.status) {
      status_element = (
        <div>
          <div className="status_title">SQL</div>
          <div className="status">{this.state.status}</div>
        </div>
      );
    }

    return (
      <div className="predicate_builder">
        <div className="search_title">Search</div>
        {error_element}
        <Clauses clauses={this.state.clauses} onAdd={this.addClause.bind(this)} onRemove={this.removeClause.bind(this)} onChange={this.updateClause.bind(this)} />
        <div className="search_button_container">
          <input className="action_button" type="button" value="Search" disabled={(error_message && error_message.length > 0)} onClick={this.performSearch.bind(this)} />
        </div>
        {status_element}
      </div>
    );
  }
}

// ========================================

ReactDOM.render((
  <PredicateBuilder />
), document.getElementById('root')
);