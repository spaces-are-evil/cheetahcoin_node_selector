import Head from 'next/head'
import Image from 'next/image'

import { getConnectedNodes } from '../lib/miningnodes'
import { getNodeCountries } from '../lib/miningnodes'
import { getCurrentBlock } from '../lib/miningnodes'
import { GetFullCountryName } from '../lib/miningnodes'
import { ClipboardCopy } from '../lib/clipboardcopy'

import React, { useState } from 'react'

export default function Home({ nodes, connectedNodes, nodeCountries, currentBlock }) {
    const [nodeList, setNodeList] = useState(nodes);

    const [filteredNodeList, setFilteredNodeList] = useState(connectedNodes);

    const [nodeCountryList, setSelectedNodeCountryList] = useState(nodeCountries);

    const [filteredNodeCountryList, setFilteredNodeCountryList] = useState("");

    const donateAddress = "CHnMzKaAB1TDoHKi7MePNHf6ymhP9eSNiB";

    //button click event
    const handleFlagClick = (event, country) => {
        var currentFilteredNodeCountryList = filteredNodeCountryList;

        //do if selected country isnt in filter
        if (!currentFilteredNodeCountryList.includes(country)) {
            //initialize array if empty
            if (currentFilteredNodeCountryList === 'undefined' || currentFilteredNodeCountryList.length === 0) {
                currentFilteredNodeCountryList = [country];
            }
            else {
                //add country to filter
                currentFilteredNodeCountryList.push(country);
            }
        }
        //do if selected country is in filter
        else {
            //remove country from array
            const newFilteredNodeCountryList = currentFilteredNodeCountryList.filter(
                (nodeCountry) => {
                    if (nodeCountry != country) {
                        return nodeCountry;
                    }
                });
            currentFilteredNodeCountryList = newFilteredNodeCountryList;
        }

        //update state
        setFilteredNodeCountryList(currentFilteredNodeCountryList);

        var newFilteredNodeList = nodeList.filter((node) => {
            //apply blocks away filter
            if (node.blocksfromcurrent < 2000) {
                //empty country filter, just return the node
                if (typeof (currentFilteredNodeCountryList) !== 'undefined' && currentFilteredNodeCountryList.length === 0
                    || currentFilteredNodeCountryList === undefined || currentFilteredNodeCountryList.length == 0) {
                    return node;
                }
                //return node only if node country in filter list
                else {
                    if (currentFilteredNodeCountryList.includes(node.countryId)) {
                        return node;
                    }
                }
            }
        });
        setFilteredNodeList(newFilteredNodeList);
    }


    //button element
    const FlagButton = ({ countryId, countryName }) => (
        <>
            <button
                key={countryId}
                name={countryId}
                onClick={(event) => (handleFlagClick(event, countryId))}
                className={filteredNodeCountryList.includes(countryId) ? 'FlagButtonClicked' : 'FlagButton'}
            >
                <Image
                    width='100%'
                    height='100%'
                    src={`/${countryId}.png`}
                    alt={countryName}
                />
                <h3 className={'FlagButtonCountry'}>{countryName}</h3>
            </button>
        </>
    );


    //page html
    return (
      <div className="container">
      <Head>
        <title>Cheetahcoin Node Selector</title>
        <link rel="icon" href="/cheetahcoin.ico" />
      </Head>

      <main>
        <h1 className="title">
            <a href="https://cheetahcoin.org/">Cheetahcoin</a> Node Selector
        </h1>
              <div className="grid">
                  <div className="flagcard">
                      <h2>Select Country</h2>
                      <div className="flagcardcontainer">
                          {
                              nodeCountryList.map((node) => (
                                  <FlagButton
                                      countryId={node.countryId }
                                      countryName={node.countryName }
                                  />
                               ))
                          }
                      </div>
                  </div>
                  <div className="card">
                      <ClipboardCopy copyText={filteredNodeList} buttonText="Copy Config Friendly List" isNodeOutput="true" />
                      <h2> {filteredNodeList.length}/{nodes.length} Active Nodes </h2>
                      <h3> {`Current API Block: ${currentBlock}`}</h3>
                      <div className="nodeInfo">
                      {
                          filteredNodeList.map((node) => (
                              <Node
                                  ipport={node.ipport}
                                  subver={node.subver}
                                  blocksfromcurrent={node.blocksfromcurrent}
                                  countryId={node.countryId}
                                  countryName={node.CountryName}
                              />
                          ))
                        }
                        </div>
                  </div>
                  <div className="card">
                      <h2> Donate </h2>
                      <ClipboardCopy copyText={donateAddress} buttonText="Copy Donate Address" isNodeOutput="false" />
                  </div>

              </div>
          </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex-flow: column wrap;
          background-image: url(../background.jpg);
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          background-attachment: fixed;
        }

        .container:before {
          content: "";
          display: block;
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: -10;
          background: url(../background.jpg) no-repeat center center;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex-flow: column wrap;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 2.5rem;
        }

        .title,
        .description {
          text-align: center;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          flex-direction: column;

          max-width: 4000px;
          margin-top: 3rem;
        }

        .card {
          flex: 1 0 45%;
          flex-direction: column;
          margin: 1rem;
          padding: 1.5rem;
          text-align: center;
          color: inherit;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          border: 2px solid #000000;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          background: rgb(255,255,255);
          background: rgba(255,255,255,0.5);
          width: 95vw;
        }

        .flagcard {
          flex: 1 0;
          flex-direction: row;
          margin: 1rem;
          padding: 1rem;
          text-align: center;
          color: inherit;
          justify-content: center;
          flex-wrap: wrap;
          align-items: center;
          text-decoration: none;
          border: 2px solid #000000;
          border-radius: 10px;
          background-color: white;
          transition: color 0.15s ease, border-color 0.15s ease;
          background: rgb(255,255,255);
          background: rgba(255,255,255,0.5);
          width: 95vw;
        }

        .copycard {
          flex: 1 0 45%;
          flex-direction: column;
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: center;
          color: inherit;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          border: 2px solid #000000;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          flex-flow: center;
          background: rgb(255,255,255);
          background: rgba(255,255,255,0.5);
          width: 95vw;
        }

        .flagcardcontainer {
          display: inline-flex;
          flex: 1 0 45%;
          flex-direction: row;
          margin: 1rem;
          padding: 1.5rem;
          text-align: center;
          color: inherit;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          text-decoration: none;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card h2 {
          margin: 0 0 1rem 0;
          font-size: 2rem;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .flagcard h2 {
          margin: 0 0 1rem 0;
          font-size: 2rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
          font-weight: bold;
        }

        .nodeInfo {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-evenly;
          flex: 0 0;
          align-items: stretch;
          align-content: space-evenly;
          padding: 1rem;
          color: inherit;
          gap: 5px;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          transition: color 0.15s ease; border-color 0.15s ease;
        }

        @media (max-width: 400px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        particle {
          position: fixed;
          top: 0;
          left: 0;
          opacity: 0;
          pointer-events: none;
          background-repeat: no-repeat;
          background-size: contain;
        }

        * {
          box-sizing: border-box;
        }

        .FlagButton {
            width: 125px;
            height: 125px;
            background: transparent;
            color: black;
            font-size: 12px;
            font-weight: bold;
            border: 1.5px solid #000000;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 2px 2px 2px grey;
            transition: background 0.5s, box-shadow 0.5s, border 0.5s;
            -webkit-transition: -webkit-transform 500ms;
        }
        
        .FlagButtonClicked {
            width: 125px;
            height: 125px;
            background: #e9b846;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
            color: black;
            border: 1.5px solid #000000;
            cursor: pointer;
            box-shadow: 2px 2px 2px black;
            transition: background 0.5s, box-shadow 0.5s, border 0.5s;
            -webkit-transition: -webkit-transform 500ms;

        }
        
        .FlagButton:hover, .FlagButton:focus, .FlagButton:active  {
            background: #e9b846;
            box-shadow: none;
            border: 3px solid #93b72f;
        }
        
        .FlagButtonClicked:hover, .FlagButtonClicked:focus, .FlagButtonClicked:active {
            background: #FFB200;
            box-shadow: none;
            border: 3px solid #709827;
        }
        
        
        .FlagButtonCountry  {
            position: relative;
            bottom: 25px;
            font-size: 1em
        }
      `}</style>
    </div>
  )
}

const node = {
    display: "flex",
    flexFlow: "row nowrap",
    'justify-content': "space-between",
    alignItems: "center",
    gap: "10px 10px"
}

const column1 = {
    width: '0px',
    flex: '1 0'
}

const column2 = {
    width: '0px',
    flex: '2 0'
}

const column3 = {
    width: '400px',
    flex: '2 0'
}


const Node = ({ ipport, subver, blocksfromcurrent, countryId, countryName }) => (
    <>
        <div style={node}>
            <div style={column1}><Image src={`/${countryId}.png`} width={30} height={30} alt={countryName} layout='fixed' /></div>
            <div style={column2}>{ipport}</div>
            <div style={column3}>{blocksfromcurrent} away</div>
        </div>
    </>
);

export async function getStaticProps()
{
    let nodes  = await getConnectedNodes();
    
    const currentBlock = await getCurrentBlock();

    const blockHeightDifferenceLimit = 2000;

    const connectedNodes = nodes.filter((node) => { if (node.blocksfromcurrent < blockHeightDifferenceLimit) return node });

    const nodeCountries = await getNodeCountries(connectedNodes);

    return {
        props: {
            nodes,
            connectedNodes,
            nodeCountries,
            currentBlock
        }
    }
};
