var express = require('express');
var router = express.Router();


/**
 * Routes to convert clauses to sql.
 */

router.post('/sql/', getSQL)

/**
 * Converts a series of JSON clauses into a SQL statement.
 * 
 * @param Object body [
 *  {"column":"domain", "operator":"="},
 *  {"column":"user_email", "operator":"=", "text":"2"},
 *  {"column":"screen_width", "operator":">=", "text":"355"}
 * ]
 * @return json sql {"SQL": "<sql statement>"}
 */
function getSQL(req, res) {

    let sql = "SELECT * from session";
    let sql_clauses = [];

    req.body.forEach((ele, i) => {
        let column = ele["column"];
        let operator = ele["operator"];
        let value = ele["text"] || "";

        let sql_operator, sql_value;

        // start with string values
        if (operator === "starts_with") {
            sql_operator = "LIKE";
            sql_value = value + "%";
            sql_value = "'" + sql_value + "'";
        } else if (operator === "not_starts_with") {
            sql_operator = "NOT LIKE";
            sql_value = value + "%";
            sql_value = "'" + sql_value + "'";
        } else if (operator === "equals") {
            sql_operator = "=";
            sql_value = value;
            sql_value = "'" + sql_value + "'";
        } else if (operator === "not_equals") {
            sql_operator = "!=";
            sql_value = value;
            sql_value = "'" + sql_value + "'";
        } else if (operator === "contains") {
            sql_operator = "LIKE";
            sql_value = "%" + value + "%";
            sql_value = "'" + sql_value + "'";
        } else if (operator === "not_contains") {
            sql_operator = "NOT LIKE";
            sql_value = "%" + value + "%";
            sql_value = "'" + sql_value + "'";
        } else if (operator === "=") {
            // begin numeric values
            sql_operator = "=";
            sql_value = value;
        } else if (operator === "!=") {
            sql_operator = "!=";
            sql_value = value;
        } else if (operator === "<=") {
            sql_operator = "<=";
            sql_value = value;
        } else if (operator === ">=") {
            sql_operator = ">=";
            sql_value = value;
        } else if (operator === "in_list") {
            sql_operator = "IN";
            sql_value = value.split(",").map((ele, i) => {
                return "'" + ele.trim() + "'";
            })
            sql_value = "(" + sql_value.join(", ") + ")";
        } else if (operator === "in_list_num") {
            sql_operator = "IN";
            sql_value = value.split(",").map((ele, i) => {
                return ele.trim();
            })
            sql_value = "(" + sql_value.join(", ") + ")";
        }

        // between is a special case that has more than one operator/value added
        if (operator === "between") {
            sql_operator = ">=";
            sql_value = value;

            let min = ele["min"];
            let max = ele["max"];
            let clause_sql = column + " > " + min + " AND " + column + " < " + max;
            sql_clauses.push(clause_sql);
        } else {
            // everything else
            let clause_sql = column + " " + sql_operator + " " + sql_value;
            sql_clauses.push(clause_sql);
        }
    })

    if (sql_clauses && sql_clauses.length > 0) {
        sql = sql + " WHERE " + sql_clauses.join(" AND ") + ";";
    } else {
        sql = sql + ";";
    }

    console.log(sql);
    return res.json({ "SQL": sql });
}

module.exports = router;