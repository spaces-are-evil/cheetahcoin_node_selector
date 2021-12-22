import useSWR from 'swr'
import { GetIpCountryData } from '../lib/countrydata'

const fetcher = (...args) => fetch(...args).then(res => res.json())

//CURRENT BLOCK API CALL
export async function GetCurrentBlockFromApi() {
    const { data, error } = useSWR('http://chtaexplorer.mooo.com:3002/api/getblockcount',
        fetcher,
        {
            refreshInterval: 60000
        });

    return {
        currentBlock: data,
        isLoading: !error && !data,
        isError: error
    }
}
//END CURRENT BLOCK API CALL

//PEER INFO API CALL
export async function GetPeerInfoFromApi() {
    const { data, error } = useSWR(`http://chtaexplorer.mooo.com:3002/api/getpeerinfo`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 60000
        });

    return {
        peerInfo: data,
        isLoading: !error && !data,
        isError: error
    }
}
//END PEER INFO API CALL

//START HOOKS

//Update Node List State Hook
function usePeerInfoList() {
    const [peerInfoState, setPeerInfoList] = useState([]);

    const peerInfo = await GetPeerInfoFromApi();

    setPeerInfoList(peerInfo);

}


function useNodeList(stateNodeList) {
    const [nodeList, setNodeList] = useState([]);

    //nodeList is empty and needs to be initialized
    if (nodeList === undefined || nodeList.length == 0) {
        setNodeList(stateNodeList);
    }
    else {

    }

    return nodeList;
}

//END HOOKS

//CURRENT BLOCK ELEMENT
export async function CurrentBlock() {
    const { data } = UseSWR('http://chtaexplorer.mooo.com:3002/api/getblockcount',
        fetcher,
        {
            refreshInterval: 60000
        });

    return <h3> {`Current API Block: ${data}`}</h3>
}
//END CURRENT BLOCK ELEMENT

//NODE LIST ELEMENT
export async function GetNodeList() {
    const nodes = await GetPeerInfoFromApi();


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


    const Node = ({ ipport, blocksAway, countryId, countryName }) => (
        <>
            <div style={node}>
                <div style={column1}><Image src={`/${countryId}.png`} width={30} height={30} alt={countryName} layout='fixed' /></div>
                <div style={column2}>{ipport}</div>
                <div style={column3}>{blocksAway} away</div>
            </div>
        </>
    );

    var nodeList = [];
    nodeList.push(<Node ip={ } port={ } subVer={ } blocksAway={ } countryId={ } />);

    return nodeList;
}
//END NODE LIST ELEMENT

export function FilterNodesByBlocksAway(nodes, blockHeightFilter) {
    var filteredNodes = nodes.filter((node) => {
        //set blocksaway property
        node.blocksAway = blockCount - node.startingHeight;
        if (node.blocksAway < blockHeightFilter) {
            return node;
        }
    })
    return filteredNodes;
}

//Get an array of 2 character country codes for flag buttons
export async function GetFilteredNodesCountries(filteredNodes) {
    const countries = [];

    filteredNodes.map(filteredNode => {
        if (countries.includes(filteredNode.country) == false) {
            countries.push(filteredNode.country);
        }
    });
    return countries;
}