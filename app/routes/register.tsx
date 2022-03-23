import { useState } from "react";

export default function Registration(): JSX.Element {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const[password,setPassword]=useState('')

    return (
        <div className="registration-form">
        <form>
            <h3 style={{textAlign:'center'}}>Registraion</h3>
            <div className="form-group">
                
            <div className="form-group">
<label htmlFor="name">Display Name</label>
<input type="text" className="form-control" id="name" placeholder="Enter display name" onChange={(event) => {
                setName(event.target.value);
              }}/>
                </div>
                </div>
                <div className="form-group">

<label htmlFor="email">Email address</label>
<input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email"  onChange={(event) => {
                setEmail(event.target.value);
                }} />
            </div>
<div className="form-group">
<label htmlFor="password">Password</label>
<input type="password" className="form-control" id="password" placeholder="Password" onChange={(event) => {
                setPassword(event.target.value);
              }}/>
            </div>
            <div className="buttonContainer">
                <button type="submit" className="btn btn-primary" style={{ width: "30%", marginTop: '5%' }}>Submit</button>
                </div>
</form>
        </div>
    );
  }
  