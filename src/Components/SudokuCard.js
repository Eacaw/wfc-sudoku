import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";

function SudokuCard() {
  return (
    <Card
      style={{
        width: "50%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "blue",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
        margin: "10px",
        padding: "10px",
      }}
    >
      <CardHeader title="Sudoku" />
      <CardContent>{/* <Sudoku /> */}</CardContent>
    </Card>
  );
}

export default SudokuCard;
