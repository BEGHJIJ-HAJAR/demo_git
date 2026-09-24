import React from "react";
import { AbsoluteFill } from "remotion";
import { C, sans } from "./theme";
import { Bank, T2Building } from "./art/Buildings";
import { Envelope, Letter, Receipt } from "./art/Envelope";
import { Amina, Lukas, Avatar } from "./art/People";
import {
  BakeryCounter,
  CasablancaSkyline,
  MunichSkyline,
  Oven,
  PiggyBank,
  Truck,
} from "./art/Scenery";
import {
  Coin,
  Pin,
  NoEntry,
  Waves,
  ReturnArrow,
  StepBadge,
  CurrencyExchange,
} from "./art/Icons";
import { Flag } from "./art/Flags";

/** Asset sheet used to review the artwork (not part of the episode). */
export const Gallery: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: C.bg,
      fontFamily: sans,
      color: "white",
      padding: 30,
      display: "flex",
      flexWrap: "wrap",
      gap: 24,
      alignContent: "flex-start",
    }}
  >
    <Bank letter="A" country="MA" width={160} />
    <Bank letter="B" country="FR" width={200} large />
    <T2Building width={280} />
    <Envelope width={300} from="Casa Bank" to="Paris Bank" />
    <Envelope width={200} from="A" to="B" compact />
    <Envelope
      width={260}
      open={1}
      letterOut={0.8}
      from="Casa Bank"
      to="Paris Bank"
      style={{ marginTop: 120 }}
    />
    <Letter width={300} />
    <Receipt
      width={100}
      bubble="Settlement complete"
      style={{ marginTop: 60 }}
    />
    <Amina width={150} />
    <Lukas width={150} smile={1} />
    <Avatar who="amina" />
    <Avatar who="lukas" />
    <CasablancaSkyline width={300} />
    <MunichSkyline width={300} />
    <Oven width={140} />
    <BakeryCounter width={300} />
    <PiggyBank width={180} />
    <Truck width={200} />
    <Coin size={60} />
    <Pin size={40} />
    <NoEntry size={50} />
    <Waves size={60} />
    <ReturnArrow size={50} />
    <StepBadge n={2} />
    <CurrencyExchange size={50} />
    <Flag country="MA" />
    <Flag country="FR" />
    <Flag country="DE" />
    <Flag country="EU" />
  </AbsoluteFill>
);
