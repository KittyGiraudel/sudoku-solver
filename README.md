# Sudoku Solver

This repository contains the code of my (very unoptimised) Sudoku solver.

## Usage

```js
// Initial values can be specified as a string `row:col=value;…` or as a map
// where the key is `row,col` and the value is expressed as a string or number.
// E.g.: new Map([ ['0:2', 5], … ])
const initialValues = '0:2=5;0:3=3;…;8:4=8'
const options = { colors: true }
const game = new Game(initialValues, options)

game.solve().render().validate()
```

Outputs:

```
┏━━━┯━━━┯━━━┳━━━┯━━━┯━━━┳━━━┯━━━┯━━━┓
┃ 1 │ 8 │ 5 ┃ 3 │ 6 │ 7 ┃ 4 │ 2 │ 9 ┃
┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
┃ 9 │ 6 │ 2 ┃ 5 │ 1 │ 4 ┃ 3 │ 7 │ 8 ┃
┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
┃ 3 │ 7 │ 4 ┃ 8 │ 2 │ 9 ┃ 5 │ 6 │ 1 ┃
┣━━━┿━━━┿━━━╋━━━┿━━━┿━━━╋━━━┿━━━┿━━━┫
┃ 8 │ 2 │ 7 ┃ 9 │ 4 │ 5 ┃ 6 │ 1 │ 3 ┃
┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
┃ 6 │ 4 │ 9 ┃ 1 │ 3 │ 8 ┃ 2 │ 5 │ 7 ┃
┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
┃ 5 │ 3 │ 1 ┃ 2 │ 7 │ 6 ┃ 9 │ 8 │ 4 ┃
┣━━━┿━━━┿━━━╋━━━┿━━━┿━━━╋━━━┿━━━┿━━━┫
┃ 4 │ 9 │ 6 ┃ 7 │ 5 │ 1 ┃ 8 │ 3 │ 2 ┃
┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
┃ 2 │ 1 │ 8 ┃ 6 │ 9 │ 3 ┃ 7 │ 4 │ 5 ┃
┠───┼───┼───╂───┼───┼───╂───┼───┼───┨
┃ 7 │ 5 │ 3 ┃ 4 │ 8 │ 2 ┃ 1 │ 9 │ 6 ┃
┗━━━┷━━━┷━━━┻━━━┷━━━┷━━━┻━━━┷━━━┷━━━┛
```
