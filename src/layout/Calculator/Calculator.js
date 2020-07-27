import React from "react";
import Screen from "./Screen/Screen";
import Keypad from "./Keypad/Keypad";
import Button from "@material-ui/core/Button";
import firebase, { auth, db } from "../../firebase";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";



//Navigation bar on top of calculator to access home and sign in/signout button
function Nav(props) {
  return (
    <div>
      <Button variant="contained" color="secondary">
        <NavLink to="/">Home</NavLink>
      </Button>
      {props.user && (
        <Button variant="contained" color="secondary" onClick={props.signout}>
          SignOut
        </Button>
      )}

      {!props.user && (
        <Button variant="contained" color="secondary">
          <NavLink to="/login">Login</NavLink>
        </Button>
      )}
    </div>
  );
}
//function for login button
function Login(props) {
  return (
    <div>
      <Button variant="contained" color="primary" onClick={props.signin}>
        Sign in with Google
      </Button>
    </div>
  );
}
//function for home button
function Home() {
  return (
    <div>
      <h3> Sadhika's Calculator App</h3>
    </div>
  );
}

class Calculator extends React.Component {
  //initial state of the calculator app
  state = {
    equation: "",
    result: 0,
    calculator: null,
    user: null,
  };

  // state of the calculator when user is signed in/ signed out
  componentDidMount() {
    console.log("mounted");
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: {
            email: user.email,
            displayName: user.displayName,
          },
          result: this.state.result,
        });
      } else {
        this.setState({ user: null });
      }
    });
  }

  // Login Mechanism using google sign in
  signInUser = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        //console.log(user)
        this.setState({
          user: {
            email: user.email,
            displayName: user.displayName,
          },
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //Logout Mechanism
  signOutUser = () => {
    auth.signOut();
  };
  // functionality of the calculator when buttons pressed
  onButtonPress = (event) => {
    let equation = this.state.equation;
    const pressedButton = event.target.innerHTML;
    auth.onAuthStateChanged((user) => {
      if (pressedButton === "C") return this.clear();
      else if (
        (pressedButton >= "0" && pressedButton <= "9") ||
        pressedButton === "."
      )
        equation += pressedButton;
      else if (["+", "-", "*", "/", "%"].indexOf(pressedButton) !== -1)
        equation += " " + pressedButton + " ";
      //store calculated result of the user in database
      else if (pressedButton === "=" && user) {
        try {
          const evalResult = eval(equation);
          const result = Number.isInteger(evalResult)
            ? evalResult
            : evalResult.toFixed(2);

          this.setState({ result });
          db.collection("result").add({
            result: this.state.result,
            email: user.email,
            name: user.displayName,
          });
        } catch (error) {
          alert("Invalid Mathematical Equation");
        }
      } else if (pressedButton === "=") {
        try {
          const evalResult = eval(equation);
          const result = Number.isInteger(evalResult)
            ? evalResult
            : evalResult.toFixed(2);

          this.setState({ result });
        } catch (error) {
          alert("Invalid Mathematical Equation");
        }
      } else {
        equation = equation.trim();
        equation = equation.substr(0, equation.length - 1);
      }

      this.setState({ equation: equation });
    });
  };
      // clear state of calculator when "C" is clicked
  clear() {
    this.setState({ equation: "", result: 0 });
  }

  render() {
    return (
      <main className="calculator">
        <Router>
          <Nav signout={this.signOutUser} user={this.state.user} />
          <Route path="/" component={Home} />
          <Route
            path="/login"
            component={() => <Login signin={this.signInUser} />}
          />

          {this.state.user && (
            <div>
              <h3>Welcome {this.state.user.displayName}!</h3>
            </div>
          )}
        </Router>
             
        <Screen equation={this.state.equation} result={this.state.result} />
        <Keypad onButtonPress={this.onButtonPress} />
      </main>
    );
  }
}
export default Calculator;
