'use client'

import { useState, useEffect } from 'react';
import { useContractWrite, useWaitForTransaction } from 'wagmi';

import { marketPlaceContract, stableCoinContract, etherCoinContract } from './contracts';

export function Swap() {
    return (
        <div>
            <div>
                <Swapper />
            </div>
        </div>
    );
}

function Swapper() {
    type SpecificContract = typeof etherCoinContract | typeof stableCoinContract;


    const [tokenFrom, setTokenFrom] = useState('ETH');
    const [amountFrom, setAmountFrom] = useState(0);
    const [wantToApprove, setWantToApprove] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [wantToSwap, setWantToSwap] = useState(false);
    const [isSwapped, setIsSwapped] = useState(false);
    const [tokenContract, setTokenContract] = useState<SpecificContract>(etherCoinContract);
    const [swapFunctionName, setSwapFunctionName] = useState<'swapEthForStable' | 'swapStableForEth'>('swapEthForStable');

    useEffect(() => {
        if (tokenFrom === 'ETH') {
            setTokenContract(etherCoinContract);
            setSwapFunctionName('swapEthForStable');
        } else {
            setTokenContract(stableCoinContract);
            setSwapFunctionName('swapStableForEth');
        }
    }, [tokenFrom]);

    useEffect(() => {
        if (wantToSwap && isApproved) {
            writeSwap({ args: [BigInt(amountFrom * 10 ** 18)] });
        }
        setWantToSwap(false);
    }, [wantToSwap, isApproved, amountFrom]);

    useEffect(() => {
        if (wantToApprove) {
            writeApprove({ args: [marketPlaceContract.address, BigInt(amountFrom * 10 ** 18)] });
        }
        setWantToApprove(false);
    }, [wantToApprove, amountFrom]);

    const { write: writeApprove, data: approveData, isLoading: approveIsLoading, isError: approveIsError } = useContractWrite({
        ...tokenContract,
        functionName: 'approve',
    });

    const { data: receiptApprove, isLoading: isPendingApprove, isSuccess: isSuccessApprove } = useWaitForTransaction({ hash: approveData?.hash });

    const { write: writeSwap, data: swapData, isLoading: swapIsLoading, isError: swapIsError } = useContractWrite({
        ...marketPlaceContract,
        functionName: swapFunctionName,
    });

    const { data: receiptSwap, isLoading: isPendingSwap, isSuccess: isSuccessSwap } = useWaitForTransaction({ hash: swapData?.hash });

    useEffect(() => {
        if (isSuccessApprove) {
            setIsApproved(true);
        }
    }, [isSuccessApprove]);

    useEffect(() => {
        if (isSuccessSwap) {
            setIsSwapped(true);
            setIsApproved(false);
        }
    }, [isSuccessSwap]);



    return (
        <div>
            <div className='text-center'>
                <input
                    type="number"
                    step="0.000000000000000001"
                    value={amountFrom}
                    onChange={(e) => setAmountFrom(Number(e.target.value))}
                    className="border border-gray-300 rounded-md p-2"
                />
                <select
                    value={tokenFrom}
                    onChange={(e) => setTokenFrom(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"

                >
                    <option value="ETH">ETH</option>
                    <option value="USDC">USDC</option>
                </select>
            </div>
            <div className='text-center'>
                <div className='pt-4 pb-4'>
                    <button
                        onClick={() => setWantToApprove(true)}
                        disabled={isApproved}
                        className={`border rounded-md p-2 ${isApproved ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-400 text-white'}`}
                    >

                        {isPendingApprove ? 'Fetching...' : 'Step 1: Approve the contract to spend your tokens'}
                    </button>
                </div>
                <div className='pb-4'>
                    <button
                        onClick={() => setWantToSwap(true)}
                        disabled={!isApproved}
                        className={`border rounded-md p-2 ${!isApproved ? 'text-gray-800 bg-gray-500 cursor-not-allowed' : 'bg-blue-400 text-white'}`}
                    >
                        {isPendingSwap ? 'Fetching...' : 'Step 2: Swap the approved tokens'}
                    </button>
                </div>
                <div className='pb-4'>
                    {(isSwapped && !isApproved) ? 'Swap successed, please refetch your balance to see the result' : ''}
                </div>
            </div>
        </div >
    );
}
