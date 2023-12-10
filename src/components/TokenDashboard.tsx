'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

export function TokenDashboard() {
    return (
        <div>
            <div>
                <TokenDashboardFunction />
            </div>
        </div>
    );
}

const TokenDashboardFunction = () => {
    const [selectedPair, setSelectedPair] = useState<string>('0x06da0fd433c1a5d7a4faa01111c044910a184553');
    const [userPair, setUserPair] = useState<string>('')
    const [fetchedData, setFetchedData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        const fetchGraphData = async () => {
            setLoading(true);
            try {
                const GET_TOKEN_DATA = {
                    query: `
                        query MyQuery($pairId: String!) {
                            liquidityPositions(
                                first: 3
                                where: { pair_: { id: $pairId } }
                                orderBy: liquidityTokenBalance
                                orderDirection: desc
                            ) {
                                user {
                                    id
                                }
                                liquidityTokenBalance
                            }
                            pair(id: $pairId) {
                                reserveUSD
                                totalSupply
                                name
                            }
                        }
                    `,
                    variables: { pairId: selectedPair },
                };

                const response = await axios.post('https://api.thegraph.com/subgraphs/name/sushiswap/exchange', GET_TOKEN_DATA);
                setFetchedData(response.data);
                setLoading(false);
                console.log('Fetched Data:', response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchGraphData();
    }, [selectedPair]);

    const handlePairChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPair(event.target.value);
    };

    const handleUserPairChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserPair(event.target.value);
    };

    const handleSetPairClick = () => {
        if (userPair == '') {
            setSelectedPair("0x06da0fd433c1a5d7a4faa01111c044910a184553");
        }
        else {
            setSelectedPair(userPair);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center">
                <label htmlFor="pairSelect" className="text-green-900 mr-2">Choose a pair:</label>
                <select
                    id="pairSelect"
                    value={selectedPair}
                    onChange={handlePairChange}
                    className="border border-gray-300 rounded-md p-2"
                >
                    <option value="0x06da0fd433c1a5d7a4faa01111c044910a184553">WETH-USDT</option>
                    <option value="0xceff51756c56ceffca006cd410b03ffc46dd3a58">WBTC-WETH</option>
                    <option value="0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f">DAI-WETH</option>
                    <option value="0x6a091a3406e0073c3cd6340122143009adac0eda">ILV-WETH</option>
                    <option value="0x795065dcc9f64b5614c407a6efdc400da6221fb0">SUSHI-WETH</option>
                </select>
                <a className='mx-6'> or </a>
                <input
                    type="text"
                    placeholder="Enter a pair id"
                    value={userPair}
                    onChange={handleUserPairChange}
                    className="border border-gray-300 rounded-md p-2 ml-2"
                />
                <button onClick={handleSetPairClick} className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 mx-4 px-4 rounded`}>
                    Set Pair
                </button>

            </div>




            {loading && (<div className="flex justify-center">Loading...</div>)}
            {((!loading && fetchedData) && fetchedData.data.pair ? (
                <div>
                    <div className="flex justify-center">
                        <div className="my-4 mx-auto lg:mx-16 lg:w-auto border border-green-900">
                            <div className="flex flex-col p-2 text-green-900">
                                <div >
                                    <p>Pair Name: {fetchedData.data.pair.name}</p>
                                </div>
                                <div >
                                    <p>Total Liquidity: {new Intl.NumberFormat('en-US').format(Math.floor(fetchedData.data.pair.reserveUSD))} $</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">

                        <table className="mx-auto my-4 lg:mx-16 w-full lg:w-auto border-collapse border border-green-900">
                            <thead>
                                <tr className="text-green-900">
                                    <th className="border border-green-900 py-2 px-4">User ID</th>
                                    <th className="border border-green-900 py-2 px-4">Total Amount (based on % of LPT owned and Total poll liquidity)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetchedData.data.liquidityPositions.map((position: any, index: number) => (
                                    <tr key={index} className="text-blue-900">
                                        <td className="border border-green-900 py-2 px-4">
                                            <a href={`https://etherscan.io/address/${position.user.id}`} target="_blank" rel="noopener noreferrer" className="underline">
                                                {position.user.id}
                                            </a>
                                        </td>
                                        <td className="border border-green-900 py-2 px-4">
                                            {new Intl.NumberFormat('en-US').format(
                                                parseFloat(
                                                    (
                                                        (position.liquidityTokenBalance / fetchedData.data.pair.totalSupply) *
                                                        fetchedData.data.pair.reserveUSD
                                                    ).toFixed(2)
                                                )
                                            )} $
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            ) : (!loading && (<div className="flex justify-center"> This id is invalid ! </div>)))}

        </div>
    );
};

export default TokenDashboardFunction;
