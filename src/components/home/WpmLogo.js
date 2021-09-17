import React from "react";
import LetterM from "./letter-m.png";
import LetterP from "./letter-p.png";
import LetterW from "./letter-w.png";


export default function WpmLogo() {
    return (
        <div style={{ margin: "auto" }}>
            <img src={LetterW} alt="W" height="400px" />
            <img src={LetterP} alt="P" height="400px" />
            <img src={LetterM} alt="M" height="400px" />
            <hr />
        </div>

    );
}