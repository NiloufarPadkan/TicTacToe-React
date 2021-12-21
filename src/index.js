import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#BEAEE2",
        },
        secondary: {
            main: "#CDF0EA",
        },
        text: {
            main: "#F7DBF0",
        },
    },
});

function Square(props) {
    return (
        <ThemeProvider theme={theme}>
            <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={props.onClick}
                sx={{ color: "#F7DBF0", fontSize: "40px" }}
            >
                {props.value}
            </Button>
        </ThemeProvider>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] === squares[b] && squares[b] === squares[c]) {
            return squares[a];
        }
    }
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] == null || squares[b] == null || squares[c] == null) {
            return null;
        }
    } // Draw
    return "None";
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
        );
    }

    render() {
        return (
            <Grid container height="300px" width="300px" spacing={1}>
                <Grid item height="100px" width="100px" xs={4}>
                    {this.renderSquare(0)}
                </Grid>
                <Grid item height="100px" width="100px" xs={4}>
                    {this.renderSquare(1)}
                </Grid>
                <Grid item height="100px" width="100px" xs={4}>
                    {this.renderSquare(2)}
                </Grid>
                <Grid item height="100px" width="100px" xs={4}>
                    {this.renderSquare(3)}
                </Grid>
                <Grid item height="100px" width="100px" xs={4}>
                    {this.renderSquare(4)}
                </Grid>
                <Grid item height="100px" width="100px" xs={4}>
                    {this.renderSquare(5)}
                </Grid>
                <Grid item height="100px" width="100px" xs={4}>
                    {this.renderSquare(6)}
                </Grid>
                <Grid item height="100px" width="100px" xs={4}>
                    {this.renderSquare(7)}
                </Grid>
                <Grid item height="100px" width="100px" xs={4}>
                    {this.renderSquare(8)}
                </Grid>
            </Grid>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{ squares: Array(9).fill(null) }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const description = move ? "Go to move #" + move : "Go to game start";
            return (
                <li key={move}>
                    <ThemeProvider theme={theme}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                this.jumpTo(move);
                            }}
                            sx={{ mb: 1 }}
                        >
                            {description}
                        </Button>
                    </ThemeProvider>
                </li>
            );
        });

        let status;
        if (winner === "X" || winner === "O") {
            status = "Winner: " + winner;
        } else if (winner === "None") {
            status = "Draw";
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <Grid
                container
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "center", sm: "flex-start" }}
                justifyContent="center"
            >
                <Grid item sm="6" xs="12">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </Grid>

                <Grid item sm="auto" xs="12" marginTop={{ xs: "2", sm: "0" }}>
                    <div>{status}</div>

                    <ol>{moves}</ol>
                </Grid>
            </Grid>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
