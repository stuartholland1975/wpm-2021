import React from "react";
import LetterM from "../home/letter-m.png";
import LetterP from "../home/letter-p.png";
import LetterW from "../home/letter-w.png";


export default function NavLogo() {
    return (
        <>
            <img src={LetterW} alt="W" height="30px" />
            <img src={LetterP} alt="P" height="30px" />
            <img src={LetterM} alt="M" height="30px" />
        </>
    );
}