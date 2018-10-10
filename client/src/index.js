import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

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
      ['does not contain', 'not_contains']
    ]

    this.number_operator_options = [
      ['less than or equal', '<='],
      ['equals', '='],
      ['does not equal', '!='],
      ['greater than or equal', '>=']
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

    this.props.onChange(index, "column", target_value);

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

    this.props.onChange(index, "operator", e.target.value);
  }

  /**
   *  onChange event handler for a dropdown
   * 
   * @param event e the onClick event.
   * @return None calls the onRemove callback with this Clauses's index.
   */
  onTextChange(e) {
    let index = this.props.index;

    this.props.onChange(index, "text", e.target.value);
  }


  /**
   * Lifecycle.
   * 
   */
  render() {

    let optionGenerator = (clause_key, ele, i) => {
      let self = this;
      let label = ele[0];
      let value = ele[1];
      return (
        <option key={value} value={value} selected={(value === self.props.clause[clause_key])}>{label}</option>
      )
    };

    let column_dropdown_options = this.column_options.map(optionGenerator.bind(this, "column"));
    let string_operator_dropdown_options = this.string_operator_options.map(optionGenerator.bind(this, "operator"));
    let number_operator_dropdown_options = this.number_operator_options.map(optionGenerator.bind(this, "operator"));

    let column_type = this.column_types[this.props.clause["column"]];

    let operator_dropdown_options = string_operator_dropdown_options;

    if (column_type === "number") {
      operator_dropdown_options = number_operator_dropdown_options;
    }

    return (
      <div>
        <input className="remove_button" type="button" value="-" onClick={this.onRemove.bind(this)} />
        <select className="clause_dd" type="dropdown" onChange={this.onColumnChange.bind(this)} >
          {column_dropdown_options}
        </select>
        <select className="clause_dd" type="dropdown" onChange={this.onOperatorChange.bind(this)} >
          {operator_dropdown_options}
        </select>
        <input className="clause_text" type="text" value={this.props.clause["text"]} onChange={this.onTextChange.bind(this)} />
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
      //console.log("clauses render clause id " + ele["clause_id"])
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
    this.state = {
      'clauses': [{ 'clause_id': 0, 'column': 'user_email', "operator": 'starts_with' }],
      'clause_id': 1, // id for next clause incrementing id for each clause to tell them apart
      'status': ""
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
    //console.log("removeclause " + index)
    //console.log("removeClause " + clauses)
    clauses.splice(index, 1);

    //console.log("removeClause spliced" + clauses)
    this.setState({ 'clauses': clauses });
  }

  /**
   * Callback for adding a clause.
   * 
   * @return None calls self.setState().
   */
  addClause() {
    let clauses = this.state.clauses.slice();
    //console.log("addClause " + clauses)

    let clause_id = this.state.clause_id;
    clauses.push({ 'clause_id': clause_id, 'column': 'user_email', "operator": 'starts_with' });
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
  updateClause(index, clause_key, value) {
    let clauses = this.state.clauses.slice();
    let updating_clause = clauses[index];
    //console.log("update column " + updating_clause)
    updating_clause[clause_key] = value;

    //console.log("update column after" + updating_clause)
    clauses.splice(index, 1, updating_clause);
    //console.log("update clauses after" + clauses)

    this.setState({ 'clauses': clauses });
  }

  /**
   * Defines what happens when you hit the "Search" button
   * 
   */
  performSearch() {
    //console.log("perform search " + JSON.stringify(this.state.clauses))

    let self = this;
    let clauses = this.state.clauses.slice();

    // remove the "clause_id" from clauses, as it's only for the interface
    clauses = clauses.map((ele, i) => {
      delete ele["clause_id"];
      return ele;
    });

    //console.log("after cleaning " + JSON.stringify(clauses))

    let uri = "/sql"

    fetch(uri, {
      'method': 'POST',
      'headers': {
        "Content-Type": "application/json; charset=utf-8",
      },
      'body': JSON.stringify(clauses)
    })
      .then((response) => {
        //console.log('returned')
        return response.json();
      })
      .then((sql_obj) => {
        //console.log(sql_obj);
        let sql = sql_obj["SQL"];

        self.setState({ "status": sql });
      })
  }

  /**
   * Lifecycle.
   * 
   * 
   */
  render() {
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
        <Clauses clauses={this.state.clauses} onAdd={this.addClause.bind(this)} onRemove={this.removeClause.bind(this)} onChange={this.updateClause.bind(this)} />
        <div className="search_button_container">
          <input className="action_button" type="button" value="Search" onClick={this.performSearch.bind(this)} />
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