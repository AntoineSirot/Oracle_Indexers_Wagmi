'use client'

import { useState, useEffect } from 'react'
import { useContractRead, useContractWrite, useWaitForTransaction, useAccount } from 'wagmi'

import { etherCoinContract, stableCoinContract } from './contracts'

export function Tokens() {
    return (
        <div>
            <MintAndBalance />
            <br />
            <Balances />
        </div>
    );
}

function MintAndBalance() {
    const [mintSTCAs, setMintSTCAs] = useState(false);
    const [mintETHAs, setMintETHAs] = useState(false);

    const { write: writeSTCAs, data: dataSTCAs, isLoading: isLoadingSTCAs, isError: isErrorSTCAs, isSuccess: isSuccessSTCAs } = useContractWrite({
        ...stableCoinContract,
        functionName: 'mintSomeTokens',
    })

    const { write: writeETHAs, data: dataETHAs, isLoading: isLoadingETHAs, isError: isErrorETHAs, isSuccess: isSuccessETHAs } = useContractWrite({
        ...etherCoinContract,
        functionName: 'mintSomeTokens',
    })

    const { data: receiptApproveSTCAs, isLoading: isPendingApproveSTCAs, isSuccess: isSuccessApproveSTCAs } = useWaitForTransaction({ hash: dataSTCAs?.hash });

    const { data: receiptApproveETHAs, isLoading: isPendingApproveETHAs, isSuccess: isSuccessApproveETHAs } = useWaitForTransaction({ hash: dataETHAs?.hash });

    useEffect(() => {
        if (mintSTCAs) {
            writeSTCAs();
        }
        setMintSTCAs(false);

    }, [mintSTCAs]);

    useEffect(() => {
        if (mintETHAs) {
            writeETHAs();
        }
        setMintETHAs(false);

    }, [mintETHAs]);



    return (
        <div>
            <div className=" flex justify-center gap-4">
                <button
                    onClick={() => setMintSTCAs(true)}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isPendingApproveSTCAs ? 'pointer-events-none opacity-50' : ''}`}
                    disabled={isPendingApproveSTCAs}
                >
                    {isPendingApproveSTCAs ? 'Minting STC...' : 'Mint STC (ERC20 $ stableCoin)'}
                </button>
                <button
                    onClick={() => setMintETHAs(true)}
                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${isPendingApproveETHAs ? 'pointer-events-none opacity-50' : ''}`}
                    disabled={isPendingApproveETHAs}
                >
                    {isPendingApproveETHAs ? 'Minting ETH...' : 'Mint ETH (ERC20 with ETH price)'}

                </button>
            </div>
        </div>
    )
}


function Balances() {

    let { address } = useAccount();

    if (!address) {
        address = "0x00"
    }

    function handleRefetch() {
        ethBalanceRefetch();
        stcBalanceRefetch();
    }


    const { data: ethBalance, isRefetching: ethBalanceIsRefetching, refetch: ethBalanceRefetch, isSuccess: ethBalanceIsSuccess } = useContractRead({
        ...etherCoinContract,
        functionName: 'balanceOf',
        args: [address],
    })

    const { data: stcBalance, isRefetching: stcBalanceIsRefetching, refetch: stcBalanceRefetch, isSuccess: stcBalanceIsSuccess } = useContractRead({
        ...stableCoinContract,
        functionName: 'balanceOf',
        args: [address],
    })

    if (address == "0x00") {
        return null;
    }

    return (
        <div>
            {ethBalanceIsSuccess && stcBalanceIsSuccess && (
                <>
                    <div className="flex justify-center items-center">
                        <div className="text-center pb-4">
                            <table className="border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200 text-blue-900">
                                        <th className="border border-gray-300 p-2">Currency</th>
                                        <th className="border border-gray-300 p-2">Address</th>
                                        <th className="border border-gray-300 p-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 p-2 text-blue-500">STC</td>
                                        <td className="border border-gray-300 p-2 text-blue-500">
                                            <a
                                                href={`https://sepolia.etherscan.io/address/${stableCoinContract.address}`}
                                                className="underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {stableCoinContract.address}
                                            </a>
                                        </td>
                                        <td className="border border-gray-300 p-2 text-blue-500">
                                            {Number(stcBalance) * 10 ** -18}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-2 text-green-500">ETH</td>
                                        <td className="border border-gray-300 p-2 text-green-500">
                                            <a
                                                href={`https://sepolia.etherscan.io/address/${etherCoinContract.address}`}
                                                className="underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {etherCoinContract.address}
                                            </a>
                                        </td>
                                        <td className="border border-gray-300 p-2 text-green-500">
                                            {Number(ethBalance) * 10 ** -18}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="text-center pt-4">

                        <button
                            disabled={ethBalanceIsRefetching || stcBalanceIsRefetching}
                            onClick={() => handleRefetch()}
                        >
                            {ethBalanceIsRefetching || stcBalanceIsRefetching ? 'refetching...' : 'refetch balances'}
                        </button>
                    </div>

                </>
            )}
        </div>
    );

}
