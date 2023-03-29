import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import Whal3s, { NftValidationUtility } from "@whal3s/whal3s.js";

let socket;

export default function Chat() {
  const whal3s = new Whal3s();
  const [utilityId, setUtilityId] = useState(
    "fc66d926-8010-41d1-af83-2e2d53ac6716"
  );
  const sRef = useRef();

  const [utility, setUtility] = useState(undefined);
  const [step, setStep] = useState(0);

  async function init() {
    console.log("init");
    if (!utilityId) return;
    setStep(0);
    if (utility) {
      console.log("destroying old utility");
      utility.destroy();
    }
    try {
      const tmpUtility = await whal3s.createValidationUtility(utilityId);
      console.log("tmp", tmpUtility);
      tmpUtility.addEventListener("stepChanged", (step) => {
        console.log("setting step to ", step.detail.step);
        setUtility(tmpUtility);
        console.log(tmpUtility.nfts.nfts[0].engagements);
        setStep(step.detail.step);
      });
      setUtility(tmpUtility);
      setStep(tmpUtility.step);
      console.log("step", tmpUtility.step);
      console.log(NftValidationUtility.STEP_CLAIMED, "claimed");
    } catch (e) {
      setUtility(undefined);
    }
  }

  useEffect(() => {
    init();
  }, []);

  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [first, setFirst] = useState(true);

  const ENDPOINT = "https://chat.keepitdefi.io";

  useEffect(() => {
    const { name } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    const room = "General Room";

    socket.emit("join", { name, room }, (error) => {
      console.log(name, room);
      if (error) {
        console.log(error);
        alert(error);
      }
    });

    socket.on("message", (message) => {
      console.log(messages);
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", { message });
      setMessage("");
    } else alert("empty input");
  };

  return (
    <div className="chat">
      {step === NftValidationUtility.STEP_INITIALIZED && (
        <button className="btn23" onClick={() => utility.connectWallet()}>
          Connect wallet
        </button>
      )}

      <div>Select NFT</div>
      {step === NftValidationUtility.STEP_NFTS_FETCHED &&
      utility?.nfts?.nfts[0]?.engagements.length > 0 ? (
        ""
      ) : step === NftValidationUtility.STEP_NFTS_FETCHED ? (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            utility.tokenId = utility.nfts.nfts[0].attributes.id.tokenId;
            utility.reserveEngagement();
          }}
          className="absolute inset-0"
          aria-hidden="true"
        >
          <img
            style={{ width: "100px" }}
            src={utility?.nfts?.nfts[0]?.attributes?.media[0]?.gateway}
            alt="nft"
          />
        </span>
      ) : (
        <span className="chat-text">You do not have access to this NFT</span>
      )}

      <div>
        {utility?.nfts?.nfts[0]?.engagements.length > 0 ? (
          <div ref={sRef} className="box">
            <h1 className="h1">Crypto General Chat (NFT needed for access)</h1>
            {messages.map((val, i) => {
              return (
                <div style={{ color: "white" }} key={i}>
                  <div className="user">{val.user}</div>
                  <div className="text">{val.text}</div>
                </div>
              );
            })}
            <form action="" onSubmit={handleSubmit}>
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  window.scrollTo(0, sRef.current.innerHeight);
                  if (first) {
                    sRef.current.scrollTop = sRef.current.scrollHeight;
                    setFirst(false);
                  } else if (
                    sRef.current.scrollTop + sRef.current.clientHeight ===
                    sRef.current.scrollHeight
                  ) {
                    sRef.current.scrollTop = sRef.current.scrollHeight;
                  }
                }}
                className="input2"
              />
            </form>
          </div>
        ) : (
          <div className="chat-text"></div>
        )}
      </div>
    </div>
  );
}
