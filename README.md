**SQL Builder Example**

This is a brief example demonstrating an example SQL builder made out of Express and React.

---

## Installation

1. Clone this repository.
2. ```cd <qm_example>```
3. Build the static files for the React front-end in the `client/` directory.
```
cd client/
npm run build
``` 
4. Run the express server (which will also serve the React front-end) in the root `qm_example/` directory.
```
cd ../
npm run start
```
5. Visit the page at `http://localhost:3003/`.

---

## RESTful API

Here is a description of the API defined by the demo. There is no authentication.

### POST /sql

* body: a list of objects describing a clause
```javascript
[
    {"column":"domain", "operator":"="},
    {"column":"user_email", "operator":"=", "text":"2"},
    {"column":"screen_width", "operator":">=", "text":"355"}
]
```
* returns: JSON
```javascript
{
    SQL: "<a string with the corresponding SQL statement.>"
}
```

## Development

Express files are placed inside `/server` in the respository root. React files exist in the `/client` directory inside the repository root. React source files are in `/client/src`.

## To Do

* Data validation
* Tests
* More robust SQL conversion
* Sanitation